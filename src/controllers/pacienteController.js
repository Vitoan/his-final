const { Paciente, Turno, Estudio, Internacion, Cama, Habitacion, Usuario, SignosVitales } = require('../models');

exports.renderDashboard = async (req, res) => {
    try {
        // Obtenemos el ID del paciente vinculado al usuario logueado
        const pacienteId = req.session.usuario.paciente_id;

        if (!pacienteId) {
            return res.send("Este usuario no tiene una ficha de paciente vinculada.");
        }

        const paciente = await Paciente.findByPk(pacienteId, {
            include: [
                { 
                    model: Turno, 
                    where: { estado: 'Programado' }, 
                    required: false,
                    include: [{ model: Usuario, as: 'Medico' }]
                },
                { 
                    model: Estudio, 
                    required: false,
                    include: [{ model: Usuario, as: 'Medico' }]
                },
                {
                    model: Internacion,
                    required: false,
                    include: [{ model: Cama, include: [Habitacion] }]
                }
            ]
        });

        // Obtener últimos signos vitales si está internado activamente
        const activeInternacion = paciente.Internacions ? paciente.Internacions.find(i => i.estado === 'Activa') : null;
        let ultimosSignos = null;
        if (activeInternacion) {
            ultimosSignos = await SignosVitales.findOne({
                where: { internacion_id: activeInternacion.id },
                order: [['createdAt', 'DESC']]
            });
        }

        res.render('portal/dashboard', { 
            title: 'Mi Portal de Salud', 
            paciente, 
            ultimosSignos 
        });
    } catch (error) {
        console.error("Error en el portal:", error);
        res.redirect('/');
    }
};