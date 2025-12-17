const { Internacion, Paciente, Cama, Habitacion, Evolucion, Usuario } = require('../models');

exports.dashboard = async (req, res) => {
    try {
        // Consultamos TODAS las internaciones activas con TODOS sus datos relacionados
        const internaciones = await Internacion.findAll({
            where: { estado: 'Activa' },
            include: [
                { model: Paciente }, // Datos personales
                { 
                    model: Cama, 
                    include: [{ model: Habitacion }] // Dónde está (Cama y Habitación)
                },
                { 
                    model: Evolucion, 
                    limit: 1, // Solo la última nota para el resumen
                    order: [['createdAt', 'DESC']],
                    include: [{ model: Usuario, as: 'Autor' }] // Quién escribió la nota
                }
            ],
            order: [['updatedAt', 'DESC']] // Los modificados recientemente primero
        });

        res.render('clinical/dashboard', {
            title: 'Tablero Clínico General',
            pacientes: internaciones,
            usuario: req.session.usuario
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error cargando el dashboard clínico');
    }
};

exports.verHistorialCompleto = async (req, res) => {
    const { idInternacion } = req.params;
    
    // Aquí traemos TODO el historial de un paciente específico
    const internacion = await Internacion.findByPk(idInternacion, {
        include: [
            { model: Paciente },
            { model: Evolucion, include: [{ model: Usuario, as: 'Autor' }] } // Historial completo
        ],
        order: [[Evolucion, 'createdAt', 'DESC']]
    });

    res.render('clinical/detalle', { internacion });
};