const { Evolucion, Usuario } = require('../models');

// OJO: Usamos 'exports', no 'apiController'
exports.guardarEvolucionAjax = async (req, res) => {
    try {
        const { internacion_id, nota, tipo } = req.body; 

        // 1. Guardar en BD
        const nuevaEvolucion = await Evolucion.create({
            internacion_id,
            tipo, 
            nota,
            autor_id: req.session.usuario.id
        });

        // 2. Buscamos el nombre del autor para devolverlo
        const evolucionConAutor = await Evolucion.findByPk(nuevaEvolucion.id, {
            include: [{ model: Usuario, as: 'Autor' }]
        });

        // 3. Responder JSON
        res.status(200).json({
            success: true,
            data: evolucionConAutor
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};