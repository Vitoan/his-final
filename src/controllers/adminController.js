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

// ======================================================
// 1. GESTIÓN DE USUARIOS (Personal del hospital)
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

        res.redirect('/admin/usuarios');
    } catch (error) {
        console.error(error);
        res.render('admin/users_create', {
            error: 'Error al crear usuario: ' + error.message,
            data: req.body
        });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        if (req.params.id == req.session.usuario.id) {
            return res.send("No puedes borrar tu propia cuenta.");
        }

        await Usuario.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/usuarios');
    } catch (error) {
        res.send("Error al eliminar.");
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
};