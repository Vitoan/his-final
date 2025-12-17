const { Habitacion, Cama, Internacion } = require('../models');

exports.listarMapa = async (req, res) => {
    try {
        // Traemos Habitaciones -> Camas -> Internacion Activa
        const habitacionesData = await Habitacion.findAll({
            include: [{
                model: Cama,
                include: [{
                    model: Internacion,
                    where: { estado: 'Activa' },
                    required: false // LEFT JOIN (Trae cama aunque no tenga internación)
                }]
            }],
            order: [['numero', 'ASC']]
        });

        // Formateamos para que la vista PUG lo entienda fácil
        // La vista espera: habitacion.camas (array) y dentro cama.internacion_id
        const habitaciones = habitacionesData.map(hab => {
            const h = hab.toJSON(); // Convertir a objeto JS limpio
            
            // Procesamos las camas para facilitar la vida a la vista PUG
            h.camas = h.Camas.map(cama => {
                const internacionActiva = cama.Internacions.length > 0 ? cama.Internacions[0] : null;
                return {
                    id: cama.id,
                    numero: cama.numero_cama,
                    estado: cama.estado,
                    internacion_id: internacionActiva ? internacionActiva.id : null
                };
            });
            return h;
        });

        res.render('rooms/index', { 
            title: 'Mapa de Camas', 
            habitaciones 
        });

    } catch (error) {
        console.error(error);
        res.send("Error cargando mapa: " + error.message);
    }
};
exports.finalizarLimpieza = async (req, res) => {
    const { idCama } = req.params;
    try {
        // La cama vuelve a estar lista para usar
        await Cama.update({ estado: 'Disponible' }, { where: { id: idCama } });
        res.redirect('/habitaciones');
    } catch (error) {
        res.redirect('/habitaciones');
    }
};