const { Usuario } = require('../models');
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