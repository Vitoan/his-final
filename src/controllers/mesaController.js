const { Paciente, Visita } = require('../models');
const { Op } = require('sequelize');

// ... (dashboard se mantiene igual)
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

// 2. Buscar Paciente (Modificado)
exports.buscarPaciente = async (req, res) => {
    const { dni } = req.query;
    let paciente = null;
    let mostrarAlta = false; // Bandera para mostrar el formulario de alta
    let mensaje = null;

    if (dni) {
        paciente = await Paciente.findOne({ where: { dni } });
        if (!paciente) {
            mostrarAlta = true;
            mensaje = "Paciente no encontrado. Complete el formulario para registrarlo e ingresarlo.";
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

// 3. Registrar Visita (Solo visita, paciente ya existía)
exports.registrarVisita = async (req, res) => {
    try {
        await Visita.create({ ...req.body, estado: 'Esperando' });
        res.redirect('/mesa-entrada');
    } catch (error) {
        console.error(error);
        res.redirect('/mesa-entrada/nuevo');
    }
};

// 4. NUEVO: Registrar Paciente Nuevo + Visita (Todo junto)
exports.registrarCompleto = async (req, res) => {
    const t = await require('../models').sequelize.transaction(); // Usamos transacción por seguridad
    
    try {
        const { 
            dni, nombre, apellido, fecha_nacimiento, // Datos Paciente
            motivo, prioridad, tipo_ingreso // Datos Visita
        } = req.body;

        // 1. Crear Paciente
        const nuevoPaciente = await Paciente.create({
            dni, nombre, apellido, fecha_nacimiento,
            direccion: 'A completar', // Valores por defecto para agilizar
            telefono: 'A completar',
            email: 'sin@email.com'
        }, { transaction: t });

        // 2. Crear Visita vinculada
        await Visita.create({
            paciente_id: nuevoPaciente.id,
            motivo,
            prioridad,
            tipo_ingreso,
            estado: 'Esperando'
        }, { transaction: t });

        await t.commit();
        res.redirect('/mesa-entrada');

    } catch (error) {
        await t.rollback();
        console.error("Error en registro completo:", error);
        // Podrías renderizar de nuevo con error, pero por simpleza redirigimos
        res.redirect(`/mesa-entrada/nuevo?dni=${req.body.dni}&error=true`);
    }
};

// ... (atender se mantiene igual)
exports.atender = async (req, res) => {
    const { id } = req.params;
    await Visita.update({ estado: 'En Atención' }, { where: { id } });
    res.redirect('/mesa-entrada');
};