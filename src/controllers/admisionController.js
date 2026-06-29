const { 
    Paciente, 
    Internacion, 
    Visita, 
    Cama, 
    Habitacion, 
    Usuario, 
    ObraSocial 
} = require("../models");

const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { registrarAuditoria } = require("../helpers/auditoria");

// ======================================================
// 1. LISTAR PACIENTES
// ======================================================
exports.renderIndex = async (req, res) => {
    try {
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
        });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
};

// ======================================================
// 2. MOSTRAR FORMULARIO CREAR PACIENTE
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
// 3. CREAR PACIENTE + USUARIO DEL PORTAL
// ======================================================
exports.create = async (req, res) => {
    try {
        if (req.body.email === "") req.body.email = null;
        if (req.body.obra_social_id === "") req.body.obra_social_id = null;

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

        // === REGISTRAR EN AUDITORÍA ===
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
// 4. MOSTRAR FORMULARIO EDITAR
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
// 5. ACTUALIZAR PACIENTE
// ======================================================
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

// ======================================================
// 6. ELIMINAR PACIENTE
// ======================================================
exports.delete = async (req, res) => {
    try {
        await Paciente.destroy({ where: { id: req.params.id } });
        res.redirect("/admision");
    } catch (error) {
        console.error(error);
        res.redirect("/admision?error=constraint");
    }
};

// ======================================================
// 7. DESACTIVAR PACIENTE
// ======================================================
exports.desactivarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        await Paciente.update({ activo: false }, { where: { id } });

        await registrarAuditoria(
            'Desactivó paciente',
            `Paciente ID: ${id}`,
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
// 8. REACTIVAR PACIENTE
// ======================================================
exports.reactivarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        await Paciente.update({ activo: true }, { where: { id } });

        await registrarAuditoria(
            'Reactivó paciente',
            `Paciente ID: ${id}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/admision');
    } catch (error) {
        console.error(error);
        res.redirect('/admision');
    }
};