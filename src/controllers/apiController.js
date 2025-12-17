const { Evolucion, Usuario, Auditoria } = require('../models');

exports.crearEvolucion = async (req, res) => {
    try {
        const { internacion_id, nota, presion } = req.body;
        
        // Guardar Evolución
        const nuevaEvolucion = await Evolucion.create({
            internacion_id,
            nota,
            signos_vitales: presion ? { presion } : null,
            tipo: req.session.usuario.rol === 'Medico' ? 'Medico' : 'Enfermeria',
            autor_id: req.session.usuario.id
        });

        // --- MINI AUDITORÍA ---
        await Auditoria.create({
            accion: 'Nueva Evolución',
            detalles: `El usuario ${req.session.usuario.nombre} cargó nota en internación ${internacion_id}`,
            usuario_id: req.session.usuario.id,
            ip: req.ip
        });

        res.json(nuevaEvolucion); // Responder JSON para que el JS del frontend lo lea
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};