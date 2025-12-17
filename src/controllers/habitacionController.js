const { Habitacion, Cama, Internacion, Paciente } = require('../models');

// 1. Listar el Mapa de Camas
exports.listarMapa = async (req, res) => {
    try {
        const habitacionesRaw = await Habitacion.findAll({
            include: [{
                model: Cama,
                include: [{
                    model: Internacion,
                    where: { estado: 'Activa' },
                    required: false,
                    include: [{ model: Paciente }]
                }]
            }],
            order: [['numero', 'ASC']]
        });

        // --- CORRECCIÓN DE SEGURIDAD ---
        // Convertimos a JSON plano y aseguramos que 'camas' exista (sea minúscula o mayúscula)
        const habitacionesData = habitacionesRaw.map(h => {
            const habitacion = h.toJSON();
            // Truco: Si Sequelize trajo 'Camas', lo pasamos a 'camas'
            habitacion.camas = habitacion.camas || habitacion.Camas || [];
            return habitacion;
        });

        res.render('rooms/index', { 
            title: 'Mapa de Camas', 
            habitaciones: habitacionesData, 
            error: req.query.error 
        });

    } catch (error) {
        console.error("Error en mapa:", error);
        res.send("Error cargando mapa: " + error.message);
    }
};

// 2. Finalizar Limpieza
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