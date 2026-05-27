const { Internacion, Paciente, Cama, Habitacion, Evolucion, Usuario, Indicacion } = require('../models');

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

        // Indicaciones Médicas
        const indicaciones = await Indicacion.findAll({
            where: { internacion_id: idInternacion },
            include: [{ model: Usuario, as: 'Medico' }],
            order: [['createdAt', 'DESC']]
        });

        const historialLimpio = historial.map(h => {
            let data = h.toJSON();
            // Si la base de datos lo devolvió como texto, lo forzamos a objeto
            if (typeof data.signos_vitales === 'string') {
                try { data.signos_vitales = JSON.parse(data.signos_vitales); } catch(e){}
            }
            return data;
        });

        res.render('clinical/medical', { 
            title: 'Evolución Médica',
            paciente: {
                ...internacion.Paciente.toJSON(),
                id: internacion.id,
                hab_numero: internacion.Cama.Habitacion.numero,
                numero_cama: internacion.Cama.numero_cama
            },
            historial: historialLimpio,
            indicaciones
        });

    } catch (error) {
        console.error(error);
        res.redirect('/habitaciones');
    }
};

// 2. Guardar evolución e indicaciones
exports.guardarEvolucion = async (req, res) => {
    const { internacion_id, diagnostico, tratamiento, descripcion_indicacion, dosis, frecuencia } = req.body;
    try {
        const notaCompleta = `Diagnóstico: ${diagnostico}. Tratamiento: ${tratamiento}`;

        await Evolucion.create({
            internacion_id,
            tipo: 'Medico',
            nota: notaCompleta,
            signos_vitales: { diagnostico, tratamiento }, 
            autor_id: req.session.usuario.id
        });

        // Crear indicación médica si se ingresó alguna
        if (descripcion_indicacion && descripcion_indicacion.trim() !== '') {
            await Indicacion.create({
                internacion_id,
                descripcion: descripcion_indicacion,
                dosis,
                frecuencia,
                estado: 'Activa',
                medico_id: req.session.usuario.id
            });
        }
        
        res.redirect('/medico/evolucionar/' + internacion_id);
    } catch (error) {
        res.send("Error: " + error.message);
    }
};

// 3. Cambiar estado de indicación
exports.cambiarEstadoIndicacion = async (req, res) => {
    const { idIndicacion } = req.params;
    const { estado } = req.body; // 'Suspendida' o 'Finalizada'
    try {
        const ind = await Indicacion.findByPk(idIndicacion);
        if (ind) {
            await ind.update({ estado });
            res.redirect('/medico/evolucionar/' + ind.internacion_id);
        } else {
            res.redirect('/habitaciones');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/habitaciones');
    }
};