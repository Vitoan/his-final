const { Admision, Paciente, Usuario, ObraSocial } = require("../models");
const { Op } = require("sequelize");
const { registrarAuditoria } = require("../helpers/auditoria");

// ======================================================
// RENDERIZAR FORMULARIO NUEVA ADMISIÓN + BUSCADOR
// ======================================================
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
                    ],
                    activo: true
                },
                limit: 10,
                order: [['apellido', 'ASC']]
            });
        }

        res.render('admission/nueva', {
            title: 'Nueva Admisión',
            pacientesEncontrados,
            search,
            error: req.query.error
        });
    } catch (error) {
        console.error("Error en renderNuevaAdmision:", error);
        res.redirect('/admision');
    }
};

// ======================================================
// CREAR ADMISIÓN (con soporte para paciente NN + validación)
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

        // === CREAR PACIENTE NN ===
        if (es_nn === 'true' || es_nn === true) {
            const nuevoPacienteNN = await Paciente.create({
                nombre: nombre || 'NN',
                apellido: apellido || 'NN',
                sexo: sexo || 'X',
                es_nn: true,
                dni: null,
                fecha_nacimiento: null,
                direccion: 'No especificada',
                telefono: 'No especificado'
            });

            pacienteId = nuevoPacienteNN.id;

            await registrarAuditoria(
                'Creó paciente NN',
                `Paciente NN: ${nombre || 'NN'} ${apellido || 'NN'}`,
                req.session.usuario.id,
                req.ip
            );
        }

        // === VALIDACIÓN: No permitir admisión duplicada ===
        const admisionActiva = await Admision.findOne({
            where: {
                paciente_id: pacienteId,
                estado: { [Op.or]: ['Pendiente', 'Activa'] }
            }
        });

        if (admisionActiva) {
            return res.redirect('/admision/nueva?error=ya_tiene_admision');
        }

        // === CREAR ADMISIÓN ===
        const nuevaAdmision = await Admision.create({
            paciente_id: pacienteId,
            tipo: tipo || 'Programada',
            motivo: motivo || 'Sin motivo especificado',
            estado: 'Pendiente',
            usuario_id: req.session.usuario.id
        });

        await registrarAuditoria(
            'Creó admisión',
            `Admision ID: ${nuevaAdmision.id} - Tipo: ${tipo} - Paciente ID: ${pacienteId}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/admision/listado');

    } catch (error) {
        console.error("Error al crear admisión:", error);
        res.redirect('/admision/nueva?error=crear_admision');
    }
};

// ======================================================
// LISTADO DE ADMISIONES
// ======================================================
exports.renderListadoAdmisiones = async (req, res) => {
    try {
        const admisiones = await Admision.findAll({
            include: [
                { model: Paciente },
                { 
                    model: Usuario, 
                    as: 'RegistradoPor'   // ← Asegúrate de tener este alias en models/index.js
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.render('admission/listado', {
            title: 'Listado de Admisiones',
            admisiones
        });
    } catch (error) {
        console.error("Error en listado de admisiones:", error);
        res.redirect('/admision');
    }
};

// ======================================================
// CANCELAR ADMISIÓN
// ======================================================
exports.cancelarAdmision = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo_cancelacion } = req.body;

        const admision = await Admision.findByPk(id);
        if (!admision) return res.redirect('/admision/listado');

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

        res.redirect('/admision/listado');
    } catch (error) {
        console.error(error);
        res.redirect('/admision/listado');
    }
};

// ======================================================
// REVERTIR CANCELACIÓN
// ======================================================
exports.revertirCancelacion = async (req, res) => {
    try {
        const { id } = req.params;
        const admision = await Admision.findByPk(id);
        if (!admision) return res.redirect('/admision/listado');

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

        res.redirect('/admision/listado');
    } catch (error) {
        console.error(error);
        res.redirect('/admision/listado');
    }
};