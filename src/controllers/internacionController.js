const { Internacion, Paciente, Cama, Habitacion, Evolucion, Auditoria, sequelize } = require('../models');
// 1. GET: Mostrar formulario para internar
// 1. GET: Mostrar formulario para internar
const renderCreate = async (req, res) => {
    try {
        const { cama_id, paciente_id, error } = req.query; // Capturamos si viene un error o paciente
        
        if (!cama_id) {
            if (paciente_id) {
                return res.redirect(`/habitaciones?paciente_id=${paciente_id}`);
            }
            return res.redirect('/habitaciones');
        }

        const cama = await Cama.findByPk(cama_id, {
            include: [{ model: Habitacion }]
        });

        if (!cama) {
            return res.redirect('/habitaciones?error=' + encodeURIComponent('La cama no existe.'));
        }

        // CANDADO: Las camas SOLO pueden asignarse si están libres (Disponible)
        if (cama.estado !== 'Disponible') {
            return res.redirect('/habitaciones?error=' + encodeURIComponent('La cama seleccionada no está disponible o requiere limpieza/mantenimiento.'));
        }

        let generoRestringido = null;

        // FIX 1: Convertimos a minúscula para evitar errores tipográficos
        const tipoHab = cama.Habitacion && cama.Habitacion.tipo ? cama.Habitacion.tipo.toLowerCase() : '';

        // Si la palabra contiene "compartida"...
        if (tipoHab.includes('compartida')) {
            // FIX 2: Usamos cama.Habitacion.id que es 100% seguro que existe
            const camasEnHabitacion = await Cama.findAll({
                where: { habitacion_id: cama.Habitacion.id },
                include: [{
                    model: Internacion,
                    where: { estado: 'Activa' },
                    required: false,
                    include: [{ model: Paciente }]
                }]
            });

            for (let c of camasEnHabitacion) {
                if (c.Internacions && c.Internacions.length > 0 && c.Internacions[0].Paciente) {
                    const sexoOcupante = c.Internacions[0].Paciente.sexo;
                    if (sexoOcupante && sexoOcupante !== 'X') {
                        generoRestringido = sexoOcupante; 
                        console.log("🔒 [CANDADO FRONT] Habitación restringida a sexo:", generoRestringido);
                        break; 
                    }
                }
            }
        }

        // Filtramos la lista de pacientes según compatibilidad de sexo si aplica
        let condicionBusqueda = {};
        if (generoRestringido) {
            const genStr = String(generoRestringido).toUpperCase();
            if (genStr === 'M' || genStr === 'MASCULINO') {
                condicionBusqueda.sexo = ['M', 'Masculino', 'MASCULINO', 'm', 'masculino'];
            } else if (genStr === 'F' || genStr === 'FEMENINO') {
                condicionBusqueda.sexo = ['F', 'Femenino', 'FEMENINO', 'f', 'femenino'];
            } else {
                condicionBusqueda.sexo = generoRestringido;
            }
        }

        // Traemos solo pacientes que NO tengan una internación activa actualmente
        const pacientesActivos = await Internacion.findAll({
            where: { estado: 'Activa' },
            attributes: ['paciente_id']
        });
        const idsPacientesActivos = pacientesActivos.map(i => i.paciente_id);
        
        const { Op } = require('sequelize');
        condicionBusqueda.id = { [Op.notIn]: idsPacientesActivos.length > 0 ? idsPacientesActivos : [0] };

        // Si tenemos pre-seleccionado un paciente derivado, nos aseguramos de traerlo a pesar del filtro de activos (aunque por lógica ya debería estar libre)
        if (paciente_id) {
            condicionBusqueda.id = { [Op.and]: [
                condicionBusqueda.id,
                { [Op.or]: [{ id: paciente_id }, { id: { [Op.notIn]: idsPacientesActivos.length > 0 ? idsPacientesActivos : [0] } }] }
            ]};
        }

        const pacientes = await Paciente.findAll({ 
            where: condicionBusqueda,
            order: [['apellido', 'ASC']] 
        });

        res.render('internacion/create', { 
            pacientes, 
            cama, 
            generoRestringido,
            pacienteSeleccionadoId: paciente_id,
            error // Le pasamos el error a la vista por si falló el POST
        });
    } catch (err) {
        console.error("Error al cargar formulario:", err);
        res.redirect('/habitaciones');
    }
};

// 2. POST: Guardar la nueva internación (CON VALIDACIÓN ESTRICTA)
const create = async (req, res) => {
    try {
        const { cama_id, paciente_id, origen, motivo, prioridad_triage } = req.body;

        // Traemos la cama destino y al paciente que queremos internar
        const camaDestino = await Cama.findByPk(cama_id, { include: [Habitacion] });
        const pacienteNuevo = await Paciente.findByPk(paciente_id);

        if (!camaDestino || !pacienteNuevo) {
            return res.redirect('/habitaciones?error=' + encodeURIComponent('Datos inválidos de cama o paciente.'));
        }

        // CANDADO BACKEND 1: Verificar disponibilidad de cama
        if (camaDestino.estado !== 'Disponible') {
            return res.redirect(`/internacion/nuevo?cama_id=${cama_id}&error=Cama_No_Disponible`);
        }

        const tipoHab = camaDestino.Habitacion && camaDestino.Habitacion.tipo ? camaDestino.Habitacion.tipo.toLowerCase() : '';

        // CANDADO BACKEND 2: Verificamos género en habitación compartida
        if (tipoHab.includes('compartida')) {
            const camasMismaHab = await Cama.findAll({
                where: { habitacion_id: camaDestino.Habitacion.id },
                include: [{
                    model: Internacion, where: { estado: 'Activa' }, required: false,
                    include: [{ model: Paciente }]
                }]
            });

            for (let c of camasMismaHab) {
                if (c.Internacions && c.Internacions.length > 0 && c.Internacions[0].Paciente) {
                    const sexoOcupante = c.Internacions[0].Paciente.sexo;
                    // Si ya hay alguien, verificamos que las primeras letras coincidan (M con M, F con F)
                    if (sexoOcupante && sexoOcupante !== 'X' && pacienteNuevo.sexo !== 'X') {
                        const letOcupante = String(sexoOcupante).toUpperCase().charAt(0);
                        const letNuevo = String(pacienteNuevo.sexo).toUpperCase().charAt(0);
                        
                        if (letOcupante !== letNuevo) {
                            console.log(`🚨 [ALERTA SEGURIDAD] Intento de internar ${letNuevo} en habitación de ${letOcupante}`);
                            // RECHAZADO: Lo devolvemos al formulario con un mensaje de error
                            return res.redirect(`/internacion/nuevo?cama_id=${cama_id}&paciente_id=${paciente_id}&error=Genero_Incompatible`);
                        }
                    }
                }
            }
        }

        // Si pasó las pruebas de seguridad, lo internamos
        await Internacion.create({
            cama_id, paciente_id, origen, motivo, prioridad_triage, estado: 'Activa'
        });

        res.redirect('/habitaciones');
    } catch (error) {
        console.error("Error al internar paciente:", error);
        res.redirect('/habitaciones');
    }
};

// 3. GET: Mostrar formulario de Alta Médica
const mostrarFormularioAlta = async (req, res) => {
    try {
        const internacion = await Internacion.findByPk(req.params.id, {
            include: [{ model: Paciente }]
        });

        if (!internacion) {
            return res.redirect('/habitaciones');
        }

        res.render('internacion/alta', { internacion });
    } catch (error) {
        console.error("Error al cargar formulario de alta:", error);
        res.redirect('/habitaciones');
    }
};

// 4. POST: Procesar el Alta Médica
const darAlta = async (req, res) => {
    try {
        const { estado_alta, resumen_epicrisis, recetas, recomendaciones, seguimiento } = req.body;

        const internacion = await Internacion.findByPk(req.params.id);

        if (internacion) {
            // Actualizamos el episodio
            await internacion.update({
                estado: estado_alta, // 'Alta_Medica', 'Traslado' o 'Defuncion'
                resumen_epicrisis: resumen_epicrisis,
                recetas: recetas || null,
                recomendaciones: recomendaciones || null,
                seguimiento: seguimiento || null,
                fecha_egreso: new Date()
            });
        }

        res.redirect('/habitaciones');
    } catch (error) {
        console.error("Error al dar de alta:", error);
        res.redirect('/habitaciones');
    }
};

// 5. GET: Mostrar formulario de transferencia de cama
const mostrarFormularioTransferencia = async (req, res) => {
    try {
        const internacion = await Internacion.findByPk(req.params.id, {
            include: [{ model: Paciente }, { model: Cama, include: [Habitacion] }]
        });

        if (!internacion) {
            return res.redirect('/habitaciones');
        }

        // Buscamos todas las camas disponibles
        const camasDisponibles = await Cama.findAll({
            where: { estado: 'Disponible' },
            include: [Habitacion]
        });

        // Filtrar camas por sexo si la habitación es compartida
        const camasFiltradas = [];
        for (let cama of camasDisponibles) {
            const tipoHab = cama.Habitacion && cama.Habitacion.tipo ? cama.Habitacion.tipo.toLowerCase() : '';
            let compatible = true;

            if (tipoHab.includes('compartida')) {
                const camasMismaHab = await Cama.findAll({
                    where: { habitacion_id: cama.Habitacion.id },
                    include: [{
                        model: Internacion, where: { estado: 'Activa' }, required: false,
                        include: [{ model: Paciente }]
                    }]
                });

                for (let c of camasMismaHab) {
                    if (c.Internacions && c.Internacions.length > 0 && c.Internacions[0].Paciente) {
                        const sexoOcupante = c.Internacions[0].Paciente.sexo;
                        if (sexoOcupante && sexoOcupante !== 'X' && internacion.Paciente.sexo !== 'X') {
                            const letOcupante = String(sexoOcupante).toUpperCase().charAt(0);
                            const letNuevo = String(internacion.Paciente.sexo).toUpperCase().charAt(0);
                            if (letOcupante !== letNuevo) {
                                compatible = false;
                                break;
                            }
                        }
                    }
                }
            }

            if (compatible) {
                camasFiltradas.push(cama);
            }
        }

        res.render('internacion/transfer', { 
            internacion, 
            camas: camasFiltradas,
            error: req.query.error
        });
    } catch (error) {
        console.error("Error al cargar formulario de transferencia:", error);
        res.redirect('/habitaciones');
    }
};

// 6. POST: Procesar la transferencia de cama (bajo Transacción)
const procesarTransferencia = async (req, res) => {
    const { id } = req.params;
    const { nueva_cama_id, motivo_transferencia } = req.body;
    const t = await sequelize.transaction();

    try {
        const internacion = await Internacion.findByPk(id, { include: [Paciente, Cama] });
        if (!internacion || internacion.estado !== 'Activa') {
            await t.rollback();
            return res.redirect('/habitaciones?error=' + encodeURIComponent('Internación no encontrada o no activa.'));
        }

        const nuevaCama = await Cama.findByPk(nueva_cama_id, { include: [Habitacion] });
        if (!nuevaCama || nuevaCama.estado !== 'Disponible') {
            await t.rollback();
            return res.redirect(`/internacion/${id}/transferir?error=` + encodeURIComponent('La cama de destino no está disponible.'));
        }

        const viejaCamaId = internacion.cama_id;
        const numeroCamaVieja = internacion.Cama ? internacion.Cama.numero_cama : 'Sin Cama';

        // 1. Liberar cama anterior -> Pasa a Limpieza
        await Cama.update({ estado: 'Limpieza' }, { where: { id: viejaCamaId }, transaction: t });

        // 2. Ocupar nueva cama -> Pasa a Ocupada
        await Cama.update({ estado: 'Ocupada' }, { where: { id: nueva_cama_id }, transaction: t });

        // 3. Actualizar internación
        await internacion.update({ cama_id: nueva_cama_id }, { transaction: t });

        // 4. Crear evolución de traslado
        await Evolucion.create({
            internacion_id: id,
            tipo: 'Medico',
            nota: `TRASLADO DE CAMA: Paciente transferido desde Cama ${numeroCamaVieja} a Cama ${nuevaCama.numero_cama}. Motivo: ${motivo_transferencia || 'No especificado'}.`,
            autor_id: req.session.usuario.id
        }, { transaction: t });

        // 5. Registrar auditoría
        await Auditoria.create({
            accion: 'Transferencia de Cama',
            detalles: `Paciente ${internacion.Paciente.nombre} ${internacion.Paciente.apellido} transferido de Cama ${numeroCamaVieja} (ID ${viejaCamaId}) a Cama ${nuevaCama.numero_cama} (ID ${nueva_cama_id}). Motivo: ${motivo_transferencia}`,
            usuario_id: req.session.usuario.id,
            ip: req.ip
        }, { transaction: t });

        await t.commit();
        res.redirect('/habitaciones');
    } catch (error) {
        await t.rollback();
        console.error("Error al procesar transferencia:", error);
        res.redirect(`/internacion/${id}/transferir?error=` + encodeURIComponent('Error interno del servidor al transferir.'));
    }
};

// 7. POST: Cancelar Internación (bajo Transacción)
const cancelarInternacion = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();

    try {
        const internacion = await Internacion.findByPk(id, { include: [Paciente] });
        if (!internacion || internacion.estado !== 'Activa') {
            await t.rollback();
            return res.redirect('/habitaciones?error=' + encodeURIComponent('Internación no encontrada o ya cerrada.'));
        }

        const camaId = internacion.cama_id;

        // 1. Liberar la cama anterior -> Pasa a Disponible directamente
        if (camaId) {
            await Cama.update({ estado: 'Disponible' }, { where: { id: camaId }, transaction: t });
        }

        // 2. Marcar internación como Cancelada
        await internacion.update({ estado: 'Cancelada', fecha_egreso: new Date() }, { transaction: t });

        // 3. Registrar auditoría
        await Auditoria.create({
            accion: 'Cancelación de Internación',
            detalles: `Internación ID ${id} para el paciente ${internacion.Paciente.nombre} ${internacion.Paciente.apellido} cancelada.`,
            usuario_id: req.session.usuario.id,
            ip: req.ip
        }, { transaction: t });

        await t.commit();
        res.redirect('/habitaciones');
    } catch (error) {
        await t.rollback();
        console.error("Error al cancelar internación:", error);
        res.redirect('/habitaciones?error=' + encodeURIComponent('No se pudo cancelar la internación.'));
    }
};

// Exportamos todas las funciones
module.exports = {
    renderCreate,
    create,
    mostrarFormularioAlta,
    darAlta,
    mostrarFormularioTransferencia,
    procesarTransferencia,
    cancelarInternacion
};