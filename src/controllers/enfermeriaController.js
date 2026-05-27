const { Internacion, Paciente, Cama, Habitacion, Evolucion, Usuario, SignosVitales, Indicacion, AdministracionMedicamento } = require('../models');

// 1. Mostrar formulario de evaluación e indicaciones
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

        // Buscamos el historial de signos vitales previo
        const historial = await SignosVitales.findAll({
            where: { internacion_id: idInternacion },
            include: [{ model: Usuario, as: 'Enfermero' }],
            order: [['createdAt', 'DESC']]
        });

        const historialLimpio = historial.map(h => {
            let data = h.toJSON();
            data.Autor = data.Enfermero; 
            data.nota = data.observaciones;
            return data;
        });

        // Buscamos indicaciones médicas activas para que enfermería administre
        const indicaciones = await Indicacion.findAll({
            where: { internacion_id: idInternacion, estado: 'Activa' },
            include: [{ model: Usuario, as: 'Medico' }],
            order: [['createdAt', 'DESC']]
        });

        // Buscamos historial de administraciones recientes
        const administraciones = await AdministracionMedicamento.findAll({
            include: [
                { 
                    model: Indicacion, 
                    where: { internacion_id: idInternacion } 
                },
                { model: Usuario, as: 'Enfermero' }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.render('clinical/nursing', { 
            title: 'Evaluación de Enfermería',
            paciente: {
                ...internacion.Paciente.toJSON(),
                id: internacion.id, // ID de la internación
                hab_numero: internacion.Cama.Habitacion.numero,
                numero_cama: internacion.Cama.numero_cama
            },
            historial: historialLimpio,
            indicaciones,
            administraciones
        });

    } catch (error) {
        console.error(error);
        res.redirect('/habitaciones');
    }
};

// 2. Guardar la evaluación de signos vitales
exports.guardarEvaluacion = async (req, res) => {
    const { internacion_id, presion, pulso, temperatura, observaciones } = req.body;
    
    try {
        await SignosVitales.create({
            internacion_id,
            presion_arterial: presion,
            frecuencia_cardiaca: pulso,
            temperatura: temperatura,
            observaciones: observaciones,
            enfermero_id: req.session.usuario.id
        });
        
        await Evolucion.create({
            internacion_id,
            tipo: 'Enfermeria',
            nota: observaciones || 'Control de signos vitales realizado.',
            autor_id: req.session.usuario.id
        });

        res.redirect('/enfermeria/evaluar/' + internacion_id);

    } catch (error) {
        console.error(error);
        res.send("Error al guardar: " + error.message);
    }
};

// 3. POST: Registrar la administración de un medicamento
exports.registrarAdministracion = async (req, res) => {
    const { indicacion_id, dosis_aplicada, observaciones, internacion_id } = req.body;
    try {
        await AdministracionMedicamento.create({
            indicacion_id,
            dosis_aplicada: dosis_aplicada || null,
            observaciones: observaciones || null,
            enfermero_id: req.session.usuario.id
        });

        const ind = await Indicacion.findByPk(indicacion_id);
        
        // Creamos una evolución de tipo 'Enfermeria' para la línea de tiempo unificada
        await Evolucion.create({
            internacion_id,
            tipo: 'Enfermeria',
            nota: `MEDICACIÓN ADMINISTRADA: Se aplicó ${ind.descripcion} (Dosis: ${dosis_aplicada || ind.dosis || 'N/A'}). Observaciones: ${observaciones || 'Sin novedades.'}`,
            autor_id: req.session.usuario.id
        });

        res.redirect('/enfermeria/evaluar/' + internacion_id);
    } catch (error) {
        console.error(error);
        res.send("Error al registrar la administración: " + error.message);
    }
};
