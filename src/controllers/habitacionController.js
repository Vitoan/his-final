const { Ala, Habitacion, Cama, Internacion, Paciente } = require('../models');

exports.listarMapa = async (req, res) => {
    try {
        const alas = await Ala.findAll({
            include: [{
                model: Habitacion,
                include: [{
                    model: Cama,
                    include: [{
                        model: Internacion,
                        where: { estado: 'Activa' },
                        required: false,
                        include: [{ model: Paciente }]
                    }]
                }]
            }],
            order: [
                ['nombre', 'ASC'],
                [Habitacion, 'numero', 'ASC'],
                [Habitacion, Cama, 'numero_cama', 'ASC']
            ]
        });

        // AQUÍ ESTÁ EL CAMBIO CLAVE: Apuntamos a la carpeta rooms
        res.render('rooms/index', { 
            title: 'Mapa de Camas', 
            alas: alas, 
            error: req.query.error 
        });

    } catch (error) {
        console.error("Error en mapa:", error);
        res.send("Error cargando mapa: " + error.message);
    }
};

exports.finalizarLimpieza = async (req, res) => {
    const { idCama } = req.params;
    try {
        await Cama.update({ estado: 'Disponible' }, { where: { id: idCama } });
        res.redirect('/habitaciones');
    } catch (error) {
        console.error(error);
        res.redirect('/habitaciones?error=' + encodeURIComponent("Error al finalizar limpieza"));
    }
};