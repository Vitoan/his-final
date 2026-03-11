const { Paciente, Turno, Estudio, Internacion, Cama, Habitacion } = require('../models');

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

        res.render('portal/dashboard', { title: 'Mi Portal de Salud', paciente });
    } catch (error) {
        console.error("Error en el portal:", error);
        res.redirect('/');
    }
};