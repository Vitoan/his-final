const { Internacion, Cama, Paciente, Habitacion, Usuario, Auditoria } = require('../models');

// 1. Mostrar Formulario de Asignación
exports.mostrarFormularioAsignacion = async (req, res) => {
    const { idCama } = req.params;
    try {
        const cama = await Cama.findByPk(idCama, { include: [Habitacion] });
        // Buscar pacientes NO internados actualmente
        // (Simplificado: traemos todos. En producción filtraríamos más)
        const pacientes = await Paciente.findAll(); 

        res.render('internacion/assign', {
            title: 'Asignar Paciente',
            cama,
            habitacion: cama.Habitacion,
            pacientes
        });
    } catch (error) {
        res.redirect('/habitaciones');
    }
};

// 2. Procesar Internación (Con validación de sexo y Auditoría)
exports.procesarAsignacion = async (req, res) => {
    const { cama_id, paciente_id, motivo } = req.body;

    try {
        // A. Validar Sexo en Habitación Compartida
        const camaObjetivo = await Cama.findByPk(cama_id, { include: [Habitacion] });
        const pacienteNuevo = await Paciente.findByPk(paciente_id);

        if (camaObjetivo.Habitacion.tipo === 'Compartida') {
            // Buscamos las OTRAS camas de esa habitación
            const camasVecinas = await Cama.findAll({
                where: { 
                    habitacion_id: camaObjetivo.habitacion_id,
                    estado: 'Ocupada' // Solo nos importan las ocupadas
                },
                include: [{
                    model: Internacion,
                    where: { estado: 'Activa' },
                    include: [Paciente] // Necesitamos el sexo del vecino
                }]
            });

            // Verificamos sexo
            for (const vecina of camasVecinas) {
                const vecino = vecina.Internacions[0].Paciente;
                if (vecino.sexo !== pacienteNuevo.sexo) {
                    return res.send(`Error: No se puede mezclar sexos. La habitación tiene un paciente ${vecino.sexo}`);
                }
            }
        }

        // B. Crear Internación
        const nuevaInternacion = await Internacion.create({
            paciente_id,
            cama_id,
            motivo,
            estado: 'Activa'
        });

        // C. Actualizar estado de la Cama
        await Cama.update({ estado: 'Ocupada' }, { where: { id: cama_id } });

        // D. Auditoría (Requisito)
        if (req.session.usuario) {
            await Auditoria.create({
                accion: 'Ingreso Paciente',
                detalles: `Paciente ${pacienteNuevo.apellido} ingresado en cama ${camaObjetivo.numero_cama}`,
                usuario_id: req.session.usuario.id
            });
        }

        res.redirect('/habitaciones');

    } catch (error) {
        console.error(error);
        res.send("Error: " + error.message);
    }
};

// 3. Dar de Alta
exports.darAlta = async (req, res) => {
    const { cama_id } = req.body;
    try {
        // Cerrar internación
        await Internacion.update(
            { estado: 'Alta', fecha_egreso: new Date() },
            { where: { cama_id, estado: 'Activa' } }
        );

        // Liberar cama
        await Cama.update({ estado: 'Disponible' }, { where: { id: cama_id } });

        res.redirect('/habitaciones');
    } catch (error) {
        res.send(error.message);
    }
};