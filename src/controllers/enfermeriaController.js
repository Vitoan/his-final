const { Internacion, Paciente, Cama, Habitacion, Evolucion, Usuario } = require('../models');

// 1. Mostrar formulario de evaluación
exports.mostrarFormulario = async (req, res) => {
    const { idInternacion } = req.params;
    try {
        // Buscamos la internación con todos los datos relacionados
        const internacion = await Internacion.findByPk(idInternacion, {
            include: [
                { model: Paciente },
                { 
                    model: Cama, 
                    include: [{ model: Habitacion }] 
                }
            ]
        });

        if (!internacion) {
            return res.redirect('/habitaciones');
        }

        // Buscamos el historial de enfermería previo
        const historial = await Evolucion.findAll({
            where: { 
                internacion_id: idInternacion,
                tipo: 'Enfermeria' // Filtramos solo notas de enfermería
            },
            include: [{ model: Usuario, as: 'Autor' }],
            order: [['createdAt', 'DESC']]
        });

        
        res.render('clinical/nursing', { 
            title: 'Evaluación de Enfermería',
            paciente: {
                ...internacion.Paciente.toJSON(),
                id: internacion.id, // ID de la internación para el form
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

// 2. Guardar la evaluación
exports.guardarEvaluacion = async (req, res) => {
    const { internacion_id, presion, pulso, temperatura, antecedentes, observaciones } = req.body;
    
    try {
        // Guardamos en la tabla unificada Evolucions
        await Evolucion.create({
            internacion_id,
            tipo: 'Enfermeria',
            nota: observaciones,
            // Guardamos los signos vitales en el campo JSON
            signos_vitales: {
                presion,
                frecuencia_cardiaca: pulso,
                temperatura,
                antecedentes // Si es relevante guardarlo aquí
            },
            autor_id: req.session.usuario.id
        });
        
        res.redirect('/enfermeria/evaluar/' + internacion_id);

    } catch (error) {
        console.error(error);
        res.send("Error al guardar: " + error.message);
    }
};