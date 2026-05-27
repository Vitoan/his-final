module.exports = (rolesPermitidos) => {
    return (req, res, next) => {
        if (req.session && req.session.usuario && rolesPermitidos.includes(req.session.usuario.rol)) {
            return next();
        }
        // Si no está autorizado, mostrar mensaje de error amigable
        return res.status(403).send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
                <h1 style="color: #ef4444; font-size: 3rem;">🛑 Acceso Denegado</h1>
                <p style="color: #64748b; font-size: 1.2rem;">Tu rol (${req.session && req.session.usuario ? req.session.usuario.rol : 'Ninguno'}) no tiene permisos para acceder a esta sección.</p>
                <a href="/" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Volver al Inicio</a>
            </div>
        `);
    };
};