const { 
    Paciente, 
    Visita, 
    Internacion, 
    Cama, 
    Habitacion, 
    Usuario, 
    ObraSocial, 
    Admision,           
    sequelize 
} = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// ======================================================
// 1. DASHBOARD MESA DE ENTRADA
// ======================================================
// 1. Dashboard de Mesa de Entrada (Sala de Espera)
exports.dashboard = async (req, res) => {
    try {
        const espera = await Visita.findAll({
            where: { 
                estado: { [Op.or]: ['Esperando', 'En Atención'] }, 
                createdAt: { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) }
            },
            include: [
                { 
                    model: Paciente,
                    include: [
                        { model: ObraSocial, as: 'ObraSocial' }
                    ]
                }
            ],
            order: [['estado', 'ASC'], ['prioridad', 'DESC'], ['createdAt', 'ASC']]
        });

        res.render('mesa/index', { 
            title: 'Mesa de Entrada', 
            espera 
        });
    } catch (error) {
        console.error("Error en Mesa de Entrada:", error);
        res.redirect('/');
    }
};

// ======================================================
// 2. BUSCAR PACIENTE
// ======================================================
exports.buscarPaciente = async (req, res) => {
    const { dni } = req.query;
    let paciente = null;
    let mostrarAlta = false;
    let mensaje = null;

    if (dni) {
        paciente = await Paciente.findOne({ 
            where: { dni },
            include: [
                { model: ObraSocial, as: 'ObraSocial' },
                {
                    model: Internacion,
                    required: false,
                    where: { fecha_egreso: null },
                    include: [{ model: Cama, include: [Habitacion] }]
                },
                {
                    model: Visita,
                    required: false,
                    where: { estado: { [Op.or]: ['Esperando', 'En Atención'] } }
                }
            ]
        });
        
        if (!paciente) {
            mostrarAlta = true;
            mensaje = "Paciente no encontrado. Complete los datos para ingresarlo.";
        }
    }

    const obrasSociales = await ObraSocial.findAll({
        where: { activo: true },
        order: [['nombre', 'ASC']]
    });

    res.render('mesa/checkin', {
        title: 'Registrar Ingreso',
        paciente,
        dniBuscado: dni,
        mostrarAlta,
        obrasSociales,
        mensaje
    });
};

// ======================================================
// 3. REGISTRAR VISITA (Paciente existente)
// ======================================================
exports.registrarVisita = async (req, res) => {
    try {
        await Visita.create({ ...req.body, estado: 'Esperando' });
        res.redirect('/mesa-entrada');
    } catch (error) {
        console.error(error);
        res.redirect('/mesa-entrada/nuevo');
    }
};

// ======================================================
// 4. REGISTRAR PACIENTE NUEVO + VISITA + USUARIO
// ======================================================
exports.registrarCompleto = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { 
            dni, nombre, apellido, fecha_nacimiento, sexo, 
            direccion, telefono, email, obra_social_id, numero_afiliado,
            motivo, prioridad, tipo_ingreso 
        } = req.body;

        // Crear Paciente
        const nuevoPaciente = await Paciente.create({
            dni, nombre, apellido, fecha_nacimiento, sexo,
            direccion: direccion || 'No especificada', 
            telefono: telefono || 'No especificado',
            email: email || null,
            obra_social_id: obra_social_id || null,   
            numero_afiliado
        }, { transaction: t });

        // Crear usuario del portal
        const primerNombre = nombre.trim().split(' ')[0].toLowerCase();
        const passwordPlana = `${primerNombre}${dni}`;
        const passwordHash = await bcrypt.hash(passwordPlana, 10);
        const emailLogin = email || `${dni}@paciente.his`;

        await Usuario.create({
            nombre,
            apellido,
            email: emailLogin,
            password: passwordHash,
            rol: 'Paciente',
            paciente_id: nuevoPaciente.id
        }, { transaction: t });

        // Crear Visita
        await Visita.create({
            paciente_id: nuevoPaciente.id,
            motivo, prioridad, tipo_ingreso,
            estado: 'Esperando'
        }, { transaction: t });

        await t.commit();
        res.redirect('/mesa-entrada');

    } catch (error) {
        await t.rollback();
        console.error("Error al registrar completo:", error);
        res.redirect(`/mesa-entrada/nuevo?dni=${req.body.dni}&error=true`);
    }
};

// ======================================================
// 5. ATENDER PACIENTE
// ======================================================
exports.atender = async (req, res) => {
    const { id } = req.params;
    try {
        await Visita.update({ estado: 'En Atención' }, { where: { id } });
        res.redirect('/mesa-entrada');
    } catch (error) {
        console.error("Error al atender:", error);
        res.redirect('/mesa-entrada');
    }
};

// ======================================================
// 6. FINALIZAR VISITA (Alta a casa)
// ======================================================
exports.finalizar = async (req, res) => {
    const { id } = req.params;
    try {
        await Visita.update({ estado: 'Finalizado' }, { where: { id } });
        res.redirect('/mesa-entrada');
    } catch (error) {
        console.error(error);
        res.redirect('/mesa-entrada');
    }
};

// ======================================================
// 7. DERIVAR A INTERNACIÓN
// ======================================================
exports.internar = async (req, res) => {
    const { id } = req.params;
    try {
        const visita = await Visita.findByPk(id);
        if (!visita) return res.redirect('/mesa-entrada');

        await visita.update({ estado: 'Derivado a Internación' });
        res.redirect(`/habitaciones?paciente_id=${visita.paciente_id}`);
    } catch (error) {
        console.error("Error al derivar:", error);
        res.redirect('/mesa-entrada');
    }
};

// Ingreso rápido de Emergencia NN (MEJORADO)
exports.ingresoRapidoNN = async (req, res) => {
    try {
        // Buscar cama disponible (prioridad Shockroom → Individual)
        const camaLibre = await Cama.findOne({
            where: { estado: 'Disponible' },
            include: [{
                model: Habitacion,
                where: { tipo: { [Op.in]: ['Shockroom', 'Individual'] } }
            }],
            order: [
                [Habitacion, 'tipo', 'DESC'],
                ['id', 'ASC']
            ]
        });

        if (!camaLibre) {
            return res.redirect('/mesa-entrada?error=' + 
                encodeURIComponent('No hay camas disponibles en Shockroom ni Individual.'));
        }

        // Crear paciente NN
        const pacienteNN = await Paciente.create({
    es_nn: true,
    nombre: 'Emergencia',
    apellido: `NN-${Math.floor(Math.random() * 10000)}`,
    sexo: 'X',
    dni: null,
    direccion: 'No especificada',
    telefono: 'No especificado',
    antecedentes: 'Ingreso rápido de emergencia - Sin documentación'   // ← Descripción por defecto
});

        // Crear Admisión
        await Admision.create({
            paciente_id: pacienteNN.id,
            tipo: 'Emergencia',
            motivo: 'Ingreso rápido de emergencia (NN)',
            estado: 'Activa',
            usuario_id: req.session.usuario.id
        });

        // Crear Internación
        await Internacion.create({
            cama_id: camaLibre.id,
            paciente_id: pacienteNN.id,
            origen: 'Guardia',
            motivo: 'Ingreso rápido de emergencia (NN)',
            prioridad_triage: 'Rojo',
            estado: 'Activa'
        });

        // Auditoría
        await registrarAuditoria(
            'Ingreso Rápido NN',
            `Paciente NN creado e internado en Cama ${camaLibre.numero_cama}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/habitaciones');

    } catch (error) {
        console.error("Error en Ingreso Rápido NN:", error);
        res.redirect('/mesa-entrada?error=' + encodeURIComponent('Error al realizar el ingreso rápido.'));
    }
};