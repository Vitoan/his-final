// Middleware para proteger rutas privadas
module.exports = (req, res, next) => {
    if (req.session && req.session.usuario) {
        return next(); // Si existe sesión, pasa
    }
    // Si no, al login
    return res.redirect('/auth/login');
};