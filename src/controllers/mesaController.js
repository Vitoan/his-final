const { Paciente, Visita } = require('../models');
const { Op } = require('sequelize');

// 1. Dashboard de Mesa de Entrada (Muestra la Sala de Espera)
exports.dashboard = async (req, res) => {
    try {
        // Traemos las visitas del día que estén "Esperando"
        const espera = await Visita.findAll({
            where: { 
                estado: 'Esperando',
                createdAt: {
                    [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) // Desde hoy a las 00:00
                }
            },
            include: [Paciente],
            order: [['prioridad', 'DESC'], ['createdAt', 'ASC']] // Primero emergencias, luego por hora de llegada
        });

        res.render('mesa/index', {
            title: 'Mesa de Entrada',
            espera
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

// 2. Buscar Paciente para Check-in
exports.buscarPaciente = async (req, res) => {
    const { dni } = req.query;
    let paciente = null;
    let error = null;

    if (dni) {
        paciente = await Paciente.findOne({ where: { dni } });
        if (!paciente) error = "Paciente no encontrado. Debe registrarlo primero.";
    }

    res.render('mesa/checkin', {
        title: 'Registrar Ingreso',
        paciente,
        dniBuscado: dni,
        error
    });
};

// 3. Guardar la Visita
exports.registrarVisita = async (req, res) => {
    const { paciente_id, motivo, prioridad, tipo_ingreso } = req.body;
    
    try {
        await Visita.create({
            paciente_id,
            motivo,
            prioridad,
            tipo_ingreso,
            estado: 'Esperando'
        });
        res.redirect('/mesa-entrada');
    } catch (error) {
        console.log(error);
        res.redirect('/mesa-entrada/nuevo');
    }
};

// 4. Marcar como Atendido (O derivar a internación)
exports.atender = async (req, res) => {
    const { id } = req.params;
    await Visita.update({ estado: 'En Atención' }, { where: { id } });
    res.redirect('/mesa-entrada');
};