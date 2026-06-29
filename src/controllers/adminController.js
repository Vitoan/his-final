const { 
    Usuario, 
    Auditoria, 
    Paciente, 
    Internacion, 
    Cama, 
    ObraSocial, 
    sequelize 
} = require('../models');

const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { registrarAuditoria } = require('../helpers/auditoria');

// ======================================================
// 1. GESTIÓN DE USUARIOS
// ======================================================
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.render('admin/users_index', { 
            title: 'Gestión de Personal',
            usuarios 
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admision');
    }
};

exports.mostrarFormulario = (req, res) => {
    res.render('admin/users_create', { title: 'Registrar Personal' });
};

exports.crearUsuario = async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    try {
        const existe = await Usuario.findOne({ where: { email } });
        if (existe) {
            return res.render('admin/users_create', {
                error: 'Ese correo electrónico ya está registrado.',
                data: req.body
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await Usuario.create({
            nombre,
            email,
            password: passwordHash,
            rol
        });

        await registrarAuditoria(
            'Creó usuario',
            `Usuario: ${nombre} (${email}) | Rol: ${rol}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/admin/usuarios');
    } catch (error) {
        console.error(error);
        res.render('admin/users_create', {
            error: 'Error al crear usuario: ' + error.message,
            data: req.body
        });
    }
};

// Mostrar formulario de edición
exports.mostrarFormularioEditar = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.redirect('/admin/usuarios');

        res.render('admin/users_edit', { 
            title: 'Editar Usuario',
            usuario 
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/usuarios');
    }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const { nombre, email, rol } = req.body;
        const { id } = req.params;

        await Usuario.update({ nombre, email, rol }, { where: { id } });

        await registrarAuditoria(
            'Modificó usuario',
            `Usuario ID: ${id} | Nombre: ${nombre} | Rol: ${rol}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/admin/usuarios');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/usuarios');
    }
};

// Desactivar usuario
exports.desactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (id == req.session.usuario.id) {
            return res.send("No puedes desactivar tu propia cuenta.");
        }

        await Usuario.update({ activo: false }, { where: { id } });

        await registrarAuditoria(
            'Desactivó usuario',
            `Usuario ID: ${id}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/admin/usuarios');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/usuarios');
    }
};

// Reactivar usuario
exports.reactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        await Usuario.update({ activo: true }, { where: { id } });

        await registrarAuditoria(
            'Reactivó usuario',
            `Usuario ID: ${id}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/admin/usuarios');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/usuarios');
    }
};

// ======================================================
// 2. AUDITORÍA
// ======================================================
exports.verAuditoria = async (req, res) => {
    try {
        const registros = await Auditoria.findAll({
            include: [{ model: Usuario }],
            order: [['createdAt', 'DESC']],
            limit: 100
        });

        res.render('admin/audit', {
            title: 'Auditoría del Sistema',
            registros
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

// ======================================================
// 3. REPORTES
// ======================================================
exports.reportes = async (req, res) => {
    try {
        const totalPacientes = await Paciente.count();
        const internacionesActivas = await Internacion.count({ where: { estado: 'Activa' } });
        const camasOcupadas = await Cama.count({ where: { estado: 'Ocupada' } });
        const camasTotales = await Cama.count();

        const obrasMasUsadas = await Paciente.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('obra_social_id')), 'total'],
                [sequelize.col('ObraSocial.nombre'), 'nombre']
            ],
            include: [{ model: ObraSocial, as: 'ObraSocial' }],
            where: { obra_social_id: { [Op.ne]: null } },
            group: ['obra_social_id', 'ObraSocial.nombre'],
            order: [[sequelize.literal('total'), 'DESC']],
            limit: 5
        });

        res.render('admin/reportes', { 
            title: 'Reportes del Sistema',
            totalPacientes,
            internacionesActivas,
            camasOcupadas,
            camasTotales,
            obrasMasUsadas
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
    // ======================================================
// EXPORTAR TODAS LAS FUNCIONES
// ======================================================
module.exports = {
    listarUsuarios: exports.listarUsuarios,
    mostrarFormulario: exports.mostrarFormulario,
    crearUsuario: exports.crearUsuario,
    mostrarFormularioEditar: exports.mostrarFormularioEditar,
    actualizarUsuario: exports.actualizarUsuario,
    desactivarUsuario: exports.desactivarUsuario,
    reactivarUsuario: exports.reactivarUsuario,
    verAuditoria: exports.verAuditoria,
    reportes: exports.reportes
};
};