const { Internacion, Cama, Paciente, Habitacion, Usuario, Auditoria } = require('../models');

// 1. Mostrar Formulario de Asignación
exports.mostrarFormularioAsignacion = async (req, res) => {
    const { idCama } = req.params;
    try {
        const cama = await Cama.findByPk(idCama, { include: [Habitacion] });
        
        // Traemos los pacientes ordenados alfabéticamente para facilitar la búsqueda
        const pacientes = await Paciente.findAll({
            order: [['apellido', 'ASC']]
        }); 

        res.render('internacion/assign', {
            title: 'Asignar Paciente',
            cama,
            habitacion: cama.Habitacion,
            pacientes
        });
    } catch (error) {
        console.error(error);
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
            // Buscamos las OTRAS camas de esa habitación que estén OCUPADAS
            const camasVecinas = await Cama.findAll({
                where: { 
                    habitacion_id: camaObjetivo.habitacion_id,
                    estado: 'Ocupada',
                    id: { [require('sequelize').Op.ne]: cama_id } // Excluir la cama actual por si acaso
                },
                include: [{
                    model: Internacion,
                    where: { estado: 'Activa' },
                    include: [Paciente] // Necesitamos el sexo del vecino
                }]
            });

            // Verificamos sexo contra los vecinos
            for (const vecina of camasVecinas) {
                // Validación defensiva: asegurar que existe internación y paciente
                if (vecina.Internacions && vecina.Internacions.length > 0) {
                    const vecino = vecina.Internacions[0].Paciente;
                    
                    if (vecino.sexo !== pacienteNuevo.sexo) {
                        
                        const errorMsg = `CONFLICTO DE GÉNERO: La habitación ya está ocupada por un paciente (${vecino.sexo}). No se puede ingresar un paciente (${pacienteNuevo.sexo}).`;
                        return res.redirect('/habitaciones?error=' + encodeURIComponent(errorMsg));
                    }
                }
            }
        }

        // B. Crear Internación
        await Internacion.create({
            paciente_id,
            cama_id,
            motivo,
            estado: 'Activa'
        });

        // C. Actualizar estado de la Cama a OCUPADA
        await Cama.update({ estado: 'Ocupada' }, { where: { id: cama_id } });

        // D. Auditoría (Registro de seguridad)
        if (req.session.usuario) {
            await Auditoria.create({
                accion: 'Ingreso Paciente',
                detalles: `Paciente ${pacienteNuevo.apellido} ingresado en cama ${camaObjetivo.numero_cama} por ${req.session.usuario.nombre}`,
                usuario_id: req.session.usuario.id
            });
        }

        // Éxito: volver al mapa
        res.redirect('/habitaciones');

    } catch (error) {
        console.error(error);
        // Si hay error técnico, también volvemos al mapa con el mensaje
        res.redirect('/habitaciones?error=' + encodeURIComponent("Error del sistema: " + error.message));
    }
};

// 3. Dar de Alta
exports.darAlta = async (req, res) => {
    const { cama_id } = req.body;
    try {
        // A. Cerrar la internación (poner fecha de egreso)
        await Internacion.update(
            { estado: 'Alta', fecha_egreso: new Date() },
            { where: { cama_id, estado: 'Activa' } }
        );

        // B. Ciclo de Limpieza: La cama NO queda disponible, pasa a LIMPIEZA
        
        await Cama.update({ estado: 'Limpieza' }, { where: { id: cama_id } }); 

        // C. Auditoría de Alta
        if (req.session.usuario) {
             const cama = await Cama.findByPk(cama_id);
             await Auditoria.create({
                accion: 'Alta Paciente',
                detalles: `Se liberó la cama ${cama ? cama.numero_cama : 'N/A'} (Pasa a Limpieza)`,
                usuario_id: req.session.usuario.id
            });
        }

        res.redirect('/habitaciones');
    } catch (error) {
        console.error(error);
        res.redirect('/habitaciones?error=' + encodeURIComponent("Error al dar de alta"));
    }
};