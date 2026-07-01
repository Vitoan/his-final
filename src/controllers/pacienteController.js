const { 
    Paciente, 
    Turno, 
    Estudio, 
    Internacion, 
    Cama, 
    Habitacion, 
    Usuario, 
    ObraSocial,
    SignosVitales,
    Evolucion,
    Indicacion,
    Visita,
 
} = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { registrarAuditoria } = require('../helpers/auditoria');


// Función para normalizar el valor de sexo
function normalizarSexo(valor) {
    if (!valor) return 'X';
    
    const v = valor.toString().toLowerCase().trim();
    
    if (v === 'f' || v === 'femenino' || v === 'female') return 'F';
    if (v === 'm' || v === 'masculino' || v === 'male') return 'M';
    
    return 'X';
}

// ======================================================
// LISTAR PACIENTES (para personal de admisión)
// ======================================================
exports.renderIndex = async (req, res) => {
    try {
        const { search } = req.query;
        
        let whereCondition = {};
        if (search) {
            whereCondition = {
                [Op.or]: [
                    { dni: { [Op.like]: `%${search}%` } },
                    { apellido: { [Op.like]: `%${search}%` } },
                    { nombre: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const pacientes = await Paciente.findAll({
            where: whereCondition,
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

// ======================================================
// MOSTRAR FORMULARIO CREAR PACIENTE
// ======================================================
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

// ======================================================
// CREAR PACIENTE + USUARIO DEL PORTAL
// ======================================================
exports.create = async (req, res) => {
    try {
        if (req.body.email === "") req.body.email = null;
        if (req.body.obra_social_id === "") req.body.obra_social_id = null;
        req.body.sexo = normalizarSexo(req.body.sexo);


        const nuevoPaciente = await Paciente.create(req.body);

        // Crear usuario del portal solo si no es NN
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

// ======================================================
// MOSTRAR FORMULARIO EDITAR PACIENTE
// ======================================================
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

// ======================================================
// ACTUALIZAR PACIENTE
// ======================================================
exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.body.email === "") req.body.email = null;
        if (req.body.obra_social_id === "") req.body.obra_social_id = null;
        if (req.body.dni && req.body.dni.trim() !== "") {
            req.body.es_nn = false;
        }
        req.body.sexo = normalizarSexo(req.body.sexo);

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

// ======================================================
// DESACTIVAR PACIENTE
// ======================================================
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

// ======================================================
// REACTIVAR PACIENTE
// ======================================================
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

// ======================================================
// VER HISTORIA CLÍNICA (con seguridad para pacientes)
// ======================================================
exports.verHistoriaClinica = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.session.usuario.rol === 'Paciente') {
            const idPacienteDelUsuario = req.session.usuario.paciente_id;
            if (!idPacienteDelUsuario || parseInt(id) !== idPacienteDelUsuario) {
                return res.status(403).send("No tienes permiso para ver esta historia clínica.");
            }
        }

        const paciente = await Paciente.findByPk(id, {
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

// ======================================================
// DASHBOARD DEL PORTAL DEL PACIENTE (CON INDICACIONES)
// ======================================================
exports.renderDashboard = async (req, res) => {
    try {
        const pacienteId = req.session.usuario.paciente_id;
        if (!pacienteId) {
            return res.send("Este usuario no tiene una ficha de paciente vinculada.");
        }

        const paciente = await Paciente.findByPk(pacienteId, {
            include: [
                {
                    model: Turno,
                    where: { estado: 'Programado' },
                    required: false,
                    include: [{ model: Usuario, as: 'Medico' }]
                },
                {
                    model: Estudio,
                    required: false,
                    include: [{ model: Usuario, as: 'Medico' }]
                },
                {
                    model: Internacion,
                    required: false,
                    include: [{ model: Cama, include: [Habitacion] }]
                }
            ]
        });

        const activeInternacion = paciente.Internacions 
            ? paciente.Internacions.find(i => i.estado === 'Activa') 
            : null;

        let ultimosSignos = null;
        let indicacionesActivas = [];

        if (activeInternacion) {
            // Últimos signos vitales
            ultimosSignos = await SignosVitales.findOne({
                where: { internacion_id: activeInternacion.id },
                order: [['createdAt', 'DESC']]
            });

            // === NUEVO: Indicaciones / Medicamentos Activos ===
            indicacionesActivas = await Indicacion.findAll({
                where: { 
                    internacion_id: activeInternacion.id,
                    estado: 'Activa'
                },
                include: [{ model: Usuario, as: 'Medico' }],
                order: [['createdAt', 'DESC']]
            });
        }

        res.render('portal/dashboard', {
            title: 'Mi Portal de Salud',
            paciente,
            ultimosSignos,
            indicacionesActivas     // ← Nueva variable
        });

    } catch (error) {
        console.error("Error en el portal:", error);
        res.redirect('/');
    }
};