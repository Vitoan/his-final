// Importamos el Modelo Usuario (Sequelize) en lugar de la conexión db raw
const { Usuario } = require('../models'); 
const bcrypt = require('bcryptjs');

exports.mostrarLogin = (req, res) => {
    res.render('auth/login', { title: 'Iniciar Sesión HIS' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // --- CAMBIO CLAVE AQUÍ: Usamos Sequelize (findOne) ---
        const usuario = await Usuario.findOne({ where: { email } });
        
        if (!usuario) {
            return res.render('auth/login', { error: 'Usuario no encontrado' });
        }
        // ----------------------------------------------------

        const validPassword = await bcrypt.compare(password, usuario.password);

        if (!validPassword) {
            return res.render('auth/login', { error: 'Contraseña incorrecta' });
        }

        // Guardamos sesión (Sequelize devuelve un objeto, usamos .dataValues o directo)
        req.session.usuario = usuario; 
        
        // Redirección basada en Rol (Requisito del PDF)
        if (usuario.rol === 'Medico' || usuario.rol === 'Enfermeria') {
            res.redirect('/clinica/dashboard');
        } else {
            res.redirect('/');
        }

    } catch (error) {
        console.error(error);
        res.render('auth/login', { error: 'Error del servidor' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};