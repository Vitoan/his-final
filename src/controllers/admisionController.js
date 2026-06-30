const {
    Paciente,
    Internacion,
    Visita,
    Cama,
    Habitacion,
    Usuario,
    ObraSocial,
    Evolucion,
    SignosVitales,
    Admision
} = require("../models");

const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { registrarAuditoria } = require("../helpers/auditoria");

// ======================================================
// ADMISIÓN - CREAR (con soporte para paciente NN)
// ======================================================
exports.crearAdmision = async (req, res) => {
    try {
        const {
            paciente_id,
            es_nn,
            nombre,
            apellido,
            sexo,
            tipo,
            motivo
        } = req.body;

        let pacienteId = paciente_id;

        // Si es paciente NN, lo creamos primero
        if (es_nn === 'true' || es_nn === true) {
            const nuevoPacienteNN = await Paciente.create({
                nombre: nombre || 'NN',
                apellido: apellido || 'NN',
                sexo: sexo || 'X',
                es_nn: true,
                dni: null
            });

            pacienteId = nuevoPacienteNN.id;

            await registrarAuditoria(
                'Creó paciente NN',
                `Paciente NN: ${nombre || 'NN'} ${apellido || 'NN'}`,
                req.session.usuario.id,
                req.ip
            );
        }

        // Creamos la admisión
        const nuevaAdmision = await Admision.create({
            paciente_id: pacienteId,
            tipo: tipo || 'Programada',
            motivo: motivo,
            estado: 'Pendiente',
            usuario_id: req.session.usuario.id
        });

        await registrarAuditoria(
            'Creó admisión',
            `Admision ID: ${nuevaAdmision.id} - Tipo: ${tipo} - Paciente ID: ${pacienteId}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/admision');
    } catch (error) {
        console.error("Error al crear admisión:", error);
        res.redirect('/admision?error=crear_admision');
    }
};
// Renderizar formulario de nueva admisión con buscador
exports.renderNuevaAdmision = async (req, res) => {
    try {
        const { search } = req.query;
        let pacientesEncontrados = [];

        if (search) {
            pacientesEncontrados = await Paciente.findAll({
                where: {
                    [Op.or]: [
                        { dni: { [Op.like]: `%${search}%` } },
                        { apellido: { [Op.like]: `%${search}%` } },
                        { nombre: { [Op.like]: `%${search}%` } }
                    ]
                },
                limit: 10,
                order: [['apellido', 'ASC']]
            });
        }

        res.render('admission/nueva', {
            title: 'Nueva Admisión',
            pacientesEncontrados,
            search
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admision');
    }
};

// Listado de admisiones
exports.renderListadoAdmisiones = async (req, res) => {
    try {
        const admisiones = await Admision.findAll({
            include: [
                { model: Paciente },
                { model: Usuario, as: 'RegistradoPor' }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.render('admission/listado', {
            title: 'Listado de Admisiones',
            admisiones
        });
    } catch (error) {
        console.error("❌ Error en listado de admisiones:", error);
        res.redirect('/admision');
    }
};
// ======================================================
// CANCELAR Y REVERTIR ADMISIÓN
// ======================================================
exports.cancelarAdmision = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo_cancelacion } = req.body;

        const admision = await Admision.findByPk(id);
        if (!admision) return res.redirect('/admision');

        await admision.update({
            estado: 'Cancelada',
            motivo_cancelacion: motivo_cancelacion || 'Cancelado por usuario',
            fecha_cancelacion: new Date()
        });

        await registrarAuditoria(
            'Canceló admisión',
            `Admision ID: ${id} - Motivo: ${motivo_cancelacion || 'No especificado'}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/admision');
    } catch (error) {
        console.error(error);
        res.redirect('/admision');
    }
};

exports.revertirCancelacion = async (req, res) => {
    try {
        const { id } = req.params;

        const admision = await Admision.findByPk(id);
        if (!admision) return res.redirect('/admision');

        await admision.update({
            estado: 'Activa',
            motivo_cancelacion: null,
            fecha_cancelacion: null
        });

        await registrarAuditoria(
            'Revirtió cancelación de admisión',
            `Admision ID: ${id}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/admision');
    } catch (error) {
        console.error(error);
        res.redirect('/admision');
    }
};

// ======================================================
// PACIENTES 
// ======================================================
exports.renderIndex = async (req, res) => {
    try {
        const { search } = req.query;
        const pacientes = await Paciente.findAll({
            include: [
                { model: ObraSocial, as: "ObraSocial" },
                {
                    model: Internacion,
                    required: false,
                    where: { fecha_egreso: null },
                    include: [{ model: Cama, include: [Habitacion] }],
                },
                {
                    model: Visita,
                    required: false,
                    where: { estado: { [Op.or]: ["Esperando", "En Atención"] } },
                },
            ],
            order: [
                ["apellido", "ASC"],
                ["nombre", "ASC"],
            ],
        });
        res.render("admission/index", {
            title: "Listado de Pacientes",
            pacientes,
            search,
        });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
};

exports.renderCreate = async (req, res) => {
    try {
        const obrasSociales = await ObraSocial.findAll({
            where: { activo: true },
            order: [["nombre", "ASC"]],
        });
        res.render("admission/create", {
            title: "Nuevo Paciente",
            isEditing: false,
            data: null,
            obrasSociales,
        });
    } catch (error) {
        console.error(error);
        res.render("admission/create", {
            title: "Nuevo Paciente",
            isEditing: false,
            data: null,
            obrasSociales: [],
            error: "Error al cargar obras sociales",
        });
    }
};

exports.create = async (req, res) => {
    try {
        if (req.body.email === "") req.body.email = null;
        if (req.body.obra_social_id === "") req.body.obra_social_id = null;

        const nuevoPaciente = await Paciente.create(req.body);

        if (!nuevoPaciente.es_nn && nuevoPaciente.dni && nuevoPaciente.nombre) {
            const primerNombre = nuevoPaciente.nombre.trim().split(" ")[0].toLowerCase();
            const passwordPlana = `${primerNombre}${nuevoPaciente.dni}`;
            const passwordHash = await bcrypt.hash(passwordPlana, 10);
            const emailLogin = nuevoPaciente.email || `${nuevoPaciente.dni}@paciente.his`;

            await Usuario.create({
                nombre: nuevoPaciente.nombre,
                apellido: nuevoPaciente.apellido,
                email: emailLogin,
                password: passwordHash,
                rol: "Paciente",
                paciente_id: nuevoPaciente.id,
            });
        }

        await registrarAuditoria(
            "Creó paciente",
            `Paciente: ${nuevoPaciente.nombre} ${nuevoPaciente.apellido} (DNI: ${nuevoPaciente.dni || "NN"})`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect("/admision");
    } catch (error) {
        console.error("Error al crear paciente y usuario:", error);
        res.render("admission/create", {
            title: "Nuevo Paciente",
            isEditing: false,
            error: "Error: Posible DNI duplicado o Email inválido.",
            data: req.body,
        });
    }
};

exports.renderEdit = async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id, {
            include: [{ model: ObraSocial, as: "ObraSocial" }],
        });
        if (!paciente) return res.redirect("/admision");

        const obrasSociales = await ObraSocial.findAll({
            where: { activo: true },
            order: [["nombre", "ASC"]],
        });

        res.render("admission/create", {
            title: "Editar Paciente",
            isEditing: true,
            data: paciente,
            obrasSociales,
        });
    } catch (error) {
        console.error(error);
        res.redirect("/admision");
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.body.email === "") req.body.email = null;
        if (req.body.obra_social_id === "") req.body.obra_social_id = null;
        if (req.body.dni && req.body.dni.trim() !== "") {
            req.body.es_nn = false;
        }
        await Paciente.update(req.body, { where: { id } });
        res.redirect("/admision");
    } catch (error) {
        console.error("Error al actualizar:", error);
        res.render("admission/create", {
            title: "Editar Paciente",
            isEditing: true,
            error: "Error al actualizar. Verifique que el Email sea válido.",
            data: { ...req.body, id: req.params.id },
        });
    }
};

exports.delete = async (req, res) => {
    try {
        await Paciente.destroy({ where: { id: req.params.id } });
        res.redirect("/admision");
    } catch (error) {
        console.error(error);
        res.redirect("/admision?error=constraint");
    }
};

// Desactivar / Reactivar paciente
exports.desactivarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await Paciente.findByPk(id);
        await Paciente.update({ activo: false }, { where: { id } });

        await registrarAuditoria(
            'Desactivó paciente',
            `Paciente: ${paciente ? paciente.nombre + ' ' + paciente.apellido : 'ID ' + id}`,
            req.session.usuario.id,
            req.ip
        );
        res.redirect('/admision');
    } catch (error) {
        console.error(error);
        res.redirect('/admision');
    }
};

exports.reactivarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await Paciente.findByPk(id);
        await Paciente.update({ activo: true }, { where: { id } });

        await registrarAuditoria(
            'Reactivó paciente',
            `Paciente: ${paciente ? paciente.nombre + ' ' + paciente.apellido : 'ID ' + id}`,
            req.session.usuario.id,
            req.ip
        );
        res.redirect('/admision');
    } catch (error) {
        console.error(error);
        res.redirect('/admision');
    }
};

// Historia Clínica
exports.verHistoriaClinica = async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id, {
            include: [
                { model: ObraSocial, as: 'ObraSocial' },
                {
                    model: Internacion,
                    include: [
                        { model: Cama, include: [Habitacion] },
                        { model: Evolucion, include: [{ model: Usuario, as: 'Autor' }] },
                        { model: SignosVitales, include: [{ model: Usuario, as: 'Enfermero' }] }
                    ],
                    order: [['fecha_ingreso', 'DESC']]
                }
            ]
        });

        if (!paciente) return res.redirect('/admision');

        res.render('admission/historia', {
            title: `Historia Clínica - ${paciente.nombre} ${paciente.apellido}`,
            paciente
        });
    } catch (error) {
        console.error("Error al cargar historia clínica:", error);
        res.redirect('/admision');
    }
};
exports.renderListadoAdmisiones = async (req, res) => {
    try {
        const admisiones = await Admision.findAll({
            include: [
                { model: Paciente }
                // Comentamos el Usuario por ahora para simplificar
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log("Admisiones encontradas:", admisiones.length);

        res.render('admission/listado', {
            title: 'Listado de Admisiones',
            admisiones
        });
    } catch (error) {
        console.error("❌ Error en listado de admisiones:", error);
        res.redirect('/admision');
    }
};