const { Internacion, Paciente, Cama, Habitacion, Evolucion, sequelize } = require('../models');
const { Op } = require('sequelize');
const { registrarAuditoria } = require('../helpers/auditoria');

// ======================================================
// 1. MOSTRAR FORMULARIO DE NUEVA INTERNACIÓN
// ======================================================
const renderCreate = async (req, res) => {
    try {
        const { cama_id, paciente_id, error } = req.query;

        if (!cama_id) {
            return res.redirect(paciente_id ? `/habitaciones?paciente_id=${paciente_id}` : '/habitaciones');
        }

        const cama = await Cama.findByPk(cama_id, { include: [{ model: Habitacion }] });

        if (!cama) {
            return res.redirect('/habitaciones?error=' + encodeURIComponent('La cama no existe.'));
        }

        if (cama.estado !== 'Disponible') {
            return res.redirect('/habitaciones?error=' + encodeURIComponent('La cama no está disponible.'));
        }

// === CANDADO DE GÉNERO EN HABITACIONES COMPARTIDAS ===
let generoRestringido = null;
const tipoHab = cama.Habitacion?.tipo?.toLowerCase() || '';

if (tipoHab.includes('compartida')) {
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
            const sexoOcupante = c.Internacions[0].Paciente.sexo || 'X';
            const sexoNuevo = paciente_id 
                ? (await Paciente.findByPk(paciente_id))?.sexo || 'X' 
                : 'X';

            // Solo aplicamos restricción si ambos tienen sexo definido y son distintos
            if (sexoOcupante !== 'X' && sexoNuevo !== 'X' && sexoOcupante !== sexoNuevo) {
                generoRestringido = sexoOcupante;
                console.log(`🔒 Habitación restringida a sexo: ${generoRestringido}`);
                break;
            }
        }
    }
}

        let condicionBusqueda = {};
        if (generoRestringido) {
            const gen = generoRestringido.toUpperCase();
            condicionBusqueda.sexo = (gen === 'M' || gen === 'MASCULINO') ? ['M', 'Masculino'] : 
                                     (gen === 'F' || gen === 'FEMENINO') ? ['F', 'Femenino'] : generoRestringido;
        }

        const pacientesActivos = await Internacion.findAll({
            where: { estado: 'Activa' },
            attributes: ['paciente_id']
        });
        const idsActivos = pacientesActivos.map(i => i.paciente_id);
        condicionBusqueda.id = { [Op.notIn]: idsActivos.length > 0 ? idsActivos : [0] };

        if (paciente_id) {
            condicionBusqueda.id = {
                [Op.or]: [
                    { [Op.notIn]: idsActivos.length > 0 ? idsActivos : [0] },
                    { id: paciente_id }
                ]
            };
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
            error
        });
    } catch (err) {
        console.error("Error al cargar formulario:", err);
        res.redirect('/habitaciones');
    }
};

// ======================================================
// 2. CREAR NUEVA INTERNACIÓN
// ======================================================
const create = async (req, res) => {
    try {
        const { cama_id, paciente_id, origen, motivo, prioridad_triage } = req.body;

        const camaDestino = await Cama.findByPk(cama_id, { include: [Habitacion] });
        const pacienteNuevo = await Paciente.findByPk(paciente_id);

        if (!camaDestino || !pacienteNuevo) {
            return res.redirect('/habitaciones?error=' + encodeURIComponent('Datos inválidos.'));
        }

        if (camaDestino.estado !== 'Disponible') {
            return res.redirect(`/internacion/nuevo?cama_id=${cama_id}&error=Cama_No_Disponible`);
        }

        // Validación de género
        const tipoHab = camaDestino.Habitacion?.tipo?.toLowerCase() || '';
        if (tipoHab.includes('compartida')) {
            const camasMismaHab = await Cama.findAll({
                where: { habitacion_id: camaDestino.Habitacion.id },
                include: [{
                    model: Internacion,
                    where: { estado: 'Activa' },
                    required: false,
                    include: [{ model: Paciente }]
                }]
            });

            for (let c of camasMismaHab) {
                if (c.Internacions?.[0]?.Paciente?.sexo && c.Internacions[0].Paciente.sexo !== 'X') {
                    const sexoOcupante = c.Internacions[0].Paciente.sexo.toUpperCase().charAt(0);
                    const sexoNuevo = pacienteNuevo.sexo.toUpperCase().charAt(0);
                    if (sexoOcupante !== sexoNuevo) {
                        return res.redirect(`/internacion/nuevo?cama_id=${cama_id}&paciente_id=${paciente_id}&error=Genero_Incompatible`);
                    }
                }
            }
        }

        await Internacion.create({
            cama_id, paciente_id, origen, motivo, prioridad_triage, estado: 'Activa'
        });

        // Auditoría mejorada
        await registrarAuditoria(
            'Creó internación',
            `Paciente: ${pacienteNuevo.nombre} ${pacienteNuevo.apellido} → Cama ID: ${cama_id} | Origen: ${origen}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/habitaciones');
    } catch (error) {
        console.error("Error al crear internación:", error);
        res.redirect('/habitaciones');
    }
};

// ======================================================
// 3. ALTA MÉDICA
// ======================================================
const mostrarFormularioAlta = async (req, res) => {
    try {
        const internacion = await Internacion.findByPk(req.params.id, {
            include: [{ model: Paciente }]
        });
        if (!internacion) return res.redirect('/habitaciones');

        res.render('internacion/alta', { internacion });
    } catch (error) {
        res.redirect('/habitaciones');
    }
};

const darAlta = async (req, res) => {
    try {
        const { estado_alta, resumen_epicrisis, recetas, recomendaciones, seguimiento } = req.body;

        const internacion = await Internacion.findByPk(req.params.id, {
            include: [{ model: Paciente }]
        });

        if (internacion) {
            await internacion.update({
                estado: estado_alta,
                resumen_epicrisis,
                recetas: recetas || null,
                recomendaciones: recomendaciones || null,
                seguimiento: seguimiento || null,
                fecha_egreso: new Date()
            });

            await registrarAuditoria(
                'Dio de alta',
                `Paciente: ${internacion.Paciente.nombre} ${internacion.Paciente.apellido} | Estado: ${estado_alta}`,
                req.session.usuario.id,
                req.ip
            );
        }

        res.redirect('/habitaciones');
    } catch (error) {
        console.error("Error al dar de alta:", error);
        res.redirect('/habitaciones');
    }
};

// ======================================================
// 4. TRANSFERENCIA DE CAMA
// ======================================================
const mostrarFormularioTransferencia = async (req, res) => {
    try {
        const internacion = await Internacion.findByPk(req.params.id, {
            include: [{ model: Paciente }, { model: Cama, include: [Habitacion] }]
        });
        if (!internacion) return res.redirect('/habitaciones');

        const camasDisponibles = await Cama.findAll({
            where: { estado: 'Disponible' },
            include: [Habitacion]
        });

        const camasFiltradas = [];
        for (let cama of camasDisponibles) {
            const tipoHab = cama.Habitacion?.tipo?.toLowerCase() || '';
            let compatible = true;

            if (tipoHab.includes('compartida')) {
                const camasMismaHab = await Cama.findAll({
                    where: { habitacion_id: cama.Habitacion.id },
                    include: [{
                        model: Internacion,
                        where: { estado: 'Activa' },
                        required: false,
                        include: [{ model: Paciente }]
                    }]
                });

                for (let c of camasMismaHab) {
                    if (c.Internacions?.[0]?.Paciente?.sexo && c.Internacions[0].Paciente.sexo !== 'X') {
                        const sexoOcupante = c.Internacions[0].Paciente.sexo.toUpperCase().charAt(0);
                        const sexoPaciente = internacion.Paciente.sexo.toUpperCase().charAt(0);
                        if (sexoOcupante !== sexoPaciente) {
                            compatible = false;
                            break;
                        }
                    }
                }
            }
            if (compatible) camasFiltradas.push(cama);
        }

        res.render('internacion/transfer', {
            internacion,
            camas: camasFiltradas,
            error: req.query.error
        });
    } catch (error) {
        res.redirect('/habitaciones');
    }
};

// ======================================================
// 5. PROCESAR TRANSFERENCIA
// ======================================================
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
        const numeroCamaVieja = internacion.Cama?.numero_cama || 'Sin Cama';

        await Cama.update({ estado: 'Limpieza' }, { where: { id: viejaCamaId }, transaction: t });
        await Cama.update({ estado: 'Ocupada' }, { where: { id: nueva_cama_id }, transaction: t });
        await internacion.update({ cama_id: nueva_cama_id }, { transaction: t });

        await Evolucion.create({
            internacion_id: id,
            tipo: 'Medico',
            nota: `TRASLADO DE CAMA: Desde Cama ${numeroCamaVieja} → Cama ${nuevaCama.numero_cama}. Motivo: ${motivo_transferencia || 'No especificado'}.`,
            autor_id: req.session.usuario.id
        }, { transaction: t });

        // Auditoría correcta
        await registrarAuditoria(
            'Transfirió paciente de cama',
            `Paciente: ${internacion.Paciente.nombre} ${internacion.Paciente.apellido} | De Cama ${numeroCamaVieja} → Cama ${nuevaCama.numero_cama} | Motivo: ${motivo_transferencia || 'No especificado'}`,
            req.session.usuario.id,
            req.ip
        );

        await t.commit();
        res.redirect('/habitaciones');
    } catch (error) {
        await t.rollback();
        console.error("❌ Error al procesar transferencia:", error);
        res.redirect(`/internacion/${id}/transferir?error=` + encodeURIComponent(error.message || 'Error al transferir.'));
    }
};

// ======================================================
// 6. CANCELAR INTERNACIÓN
// ======================================================
const cancelarInternacion = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();

    try {
        const internacion = await Internacion.findByPk(id, { include: [Paciente] });
        if (!internacion || internacion.estado !== 'Activa') {
            await t.rollback();
            return res.redirect('/habitaciones?error=' + encodeURIComponent('Internación no encontrada o ya cerrada.'));
        }

        if (internacion.cama_id) {
            await Cama.update({ estado: 'Disponible' }, { where: { id: internacion.cama_id }, transaction: t });
        }

        await internacion.update({ estado: 'Cancelada', fecha_egreso: new Date() }, { transaction: t });

        await registrarAuditoria(
            'Canceló internación',
            `Paciente: ${internacion.Paciente.nombre} ${internacion.Paciente.apellido}`,
            req.session.usuario.id,
            req.ip
        );

        await t.commit();
        res.redirect('/habitaciones');
    } catch (error) {
        await t.rollback();
        res.redirect('/habitaciones?error=' + encodeURIComponent('No se pudo cancelar la internación.'));
    }
};

// ======================================================
// EXPORTAR
// ======================================================
module.exports = {
    renderCreate,
    create,
    mostrarFormularioAlta,
    darAlta,
    mostrarFormularioTransferencia,
    procesarTransferencia,
    cancelarInternacion
};