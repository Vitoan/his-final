const { Paciente, Visita, Internacion, Cama, Habitacion, sequelize } = require('../models');
const { Op } = require('sequelize');

// 1. Dashboard de Mesa de Entrada (Sala de Espera)
exports.dashboard = async (req, res) => {
    try {
        const espera = await Visita.findAll({
            where: { 
                estado: 'Esperando',
                createdAt: { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) }
            },
            include: [Paciente],
            order: [['prioridad', 'DESC'], ['createdAt', 'ASC']]
        });
        res.render('mesa/index', { title: 'Mesa de Entrada', espera });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

// 2. Buscar Paciente (Con Alertas de Internación/Guardia)
exports.buscarPaciente = async (req, res) => {
    const { dni } = req.query;
    let paciente = null;
    let mostrarAlta = false;
    let mensaje = null;

    if (dni) {
        paciente = await Paciente.findOne({ 
            where: { dni },
            include: [
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

    res.render('mesa/checkin', {
        title: 'Registrar Ingreso',
        paciente,
        dniBuscado: dni,
        mostrarAlta,
        mensaje
    });
};

// 3. Registrar Visita (Paciente ya existe)
exports.registrarVisita = async (req, res) => {
    try {
        await Visita.create({ ...req.body, estado: 'Esperando' });
        res.redirect('/mesa-entrada');
    } catch (error) {
        console.error(error);
        res.redirect('/mesa-entrada/nuevo');
    }
};

// 4. Registrar Completo (Paciente Nuevo + Visita)
exports.registrarCompleto = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { 
            dni, nombre, apellido, fecha_nacimiento, sexo, 
            direccion, telefono, email, obra_social, numero_afiliado,
            motivo, prioridad, tipo_ingreso 
        } = req.body;

        // Crear Paciente
        const nuevoPaciente = await Paciente.create({
            dni, nombre, apellido, fecha_nacimiento, sexo,
            direccion: direccion || 'No especificada', 
            telefono: telefono || 'No especificado',
            email: email || null,
            obra_social,
            numero_afiliado
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

// 5. Atender (Sacar de lista)
exports.atender = async (req, res) => {
    const { id } = req.params;
    await Visita.update({ estado: 'En Atención' }, { where: { id } });
    res.redirect('/mesa-entrada');
};