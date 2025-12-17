const { Internacion, Paciente, Cama, Habitacion, Evolucion, Usuario } = require('../models');

// 1. Mostrar formulario de evolución médica
exports.mostrarEvolucion = async (req, res) => {
    const { idInternacion } = req.params;
    try {
        const internacion = await Internacion.findByPk(idInternacion, {
            include: [
                { model: Paciente },
                { 
                    model: Cama, 
                    include: [{ model: Habitacion }] 
                }
            ]
        });

        if (!internacion) return res.redirect('/habitaciones');

        // Historial Médico
        const historial = await Evolucion.findAll({
            where: { 
                internacion_id: idInternacion,
                tipo: 'Medico'
            },
            include: [{ model: Usuario, as: 'Autor' }],
            order: [['createdAt', 'DESC']]
        });

        res.render('clinical/medical', { 
            title: 'Evolución Médica',
            paciente: {
                ...internacion.Paciente.toJSON(),
                id: internacion.id,
                hab_numero: internacion.Cama.Habitacion.numero,
                numero_cama: internacion.Cama.numero_cama
            },
            historial: historial 
        });

    } catch (error) {
        console.error(error);
        res.redirect('/habitaciones');
    }
};

// 2. Guardar evolución
exports.guardarEvolucion = async (req, res) => {
    const { internacion_id, diagnostico, tratamiento } = req.body;
    try {
        // Concatenamos diagnóstico y tratamiento en la nota
        // O podrías guardarlos en el JSON si prefieres separarlos
        const notaCompleta = `Diagnóstico: ${diagnostico}. Tratamiento: ${tratamiento}`;

        await Evolucion.create({
            internacion_id,
            tipo: 'Medico',
            nota: notaCompleta,
            // Guardamos detalle estructurado también por si acaso
            signos_vitales: { diagnostico, tratamiento }, 
            autor_id: req.session.usuario.id
        });
        
        res.redirect('/medico/evolucionar/' + internacion_id);
    } catch (error) {
        res.send("Error: " + error.message);
    }
};