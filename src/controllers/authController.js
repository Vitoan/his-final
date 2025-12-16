const db = require('../config/db');

exports.mostrarLogin = (req, res) => {
    res.render('auth/login', { title: 'Iniciar Sesión' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    // Consulta simple (Slide 7 - Acceso a BD)
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password]);

    if (rows.length > 0) {
        req.session.usuario = rows[0]; // Guardamos sesión (Slide 11)
        res.redirect('/admision');
    } else {
        res.render('auth/login', { error: 'Credenciales inválidas' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};