const { Usuario, Auditoria } = require('../models');
const { Op } = require('sequelize');
const { Paciente, Internacion, Cama, ObraSocial } = require('../models');
const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');

// 1. Listar todo el personal
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

// 2. Mostrar formulario de creación
exports.mostrarFormulario = (req, res) => {
    res.render('admin/users_create', { title: 'Registrar Personal' });
};

// 3. Guardar nuevo usuario
exports.crearUsuario = async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    try {
        // Verificar si el email ya existe
        const existe = await Usuario.findOne({ where: { email } });
        if (existe) {
            return res.render('admin/users_create', {
                error: 'Ese correo electrónico ya está registrado.',
                data: req.body
            });
        }

        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear usuario
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

// 4. Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        // Evitar que el admin se borre a sí mismo
        if (req.params.id == req.session.usuario.id) {
            return res.send("No puedes borrar tu propia cuenta.");
        }

        await Usuario.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/usuarios');
    } catch (error) {
        res.send("Error al eliminar.");
    }
};

// Ver Auditoría
exports.verAuditoria = async (req, res) => {
    try {
        const registros = await Auditoria.findAll({
            include: [{ model: Usuario }], // Para saber QUIÉN hizo la acción
            order: [['createdAt', 'DESC']], // Lo más nuevo primero
            limit: 100 // Opcional: traer solo los últimos 100 para no saturar
        });

        res.render('admin/audit', {
            title: 'Auditoría del Sistema',
            registros
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
}
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