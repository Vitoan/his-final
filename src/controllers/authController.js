const { Usuario } = require('../models'); 
const bcrypt = require('bcryptjs');

exports.mostrarLogin = (req, res) => {
    res.render('auth/login', { title: 'Iniciar Sesión HIS' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });
        
        if (!usuario) {
            return res.render('auth/login', { error: 'Usuario no encontrado' });
        }

        if (!usuario.activo) {
            return res.render('auth/login', { error: 'Usuario desactivado. Consulte con administración.' });
        }

        const validPassword = await bcrypt.compare(password, usuario.password);

        if (!validPassword) {
            return res.render('auth/login', { error: 'Contraseña incorrecta' });
        }

        req.session.usuario = usuario.get({ plain: true }); 
        
        if (usuario.rol === 'Medico' || usuario.rol === 'Enfermeria') {
            res.redirect('/clinica/dashboard');
        } else if (usuario.rol === 'Paciente') {
            res.redirect('/portal/inicio');
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
