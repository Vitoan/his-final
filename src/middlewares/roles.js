const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.session.usuario) {
            return res.redirect('/auth/login');
        }

        if (rolesPermitidos.includes(req.session.usuario.rol)) {
            next();
        } else {
            // Renderizar página de error 403 o redirigir
            res.render('error', { 
                mensaje: 'Acceso Denegado: No tienes permisos para realizar esta acción.',
                usuario: req.session.usuario
            });
        }
    }
};

module.exports = verificarRol;