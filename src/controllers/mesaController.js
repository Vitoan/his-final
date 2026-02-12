const { Paciente, Visita, Internacion, Cama, Habitacion, sequelize } = require('../models');
const { Op } = require('sequelize');

// 1. Dashboard de Mesa de Entrada (Sala de Espera)
exports.dashboard = async (req, res) => {
    try {
        const espera = await Visita.findAll({
            where: { 
                estado: { [Op.or]: ['Esperando', 'En Atención'] }, 
                createdAt: { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) }
            },
            include: [Paciente],
            order: [['estado', 'ASC'], ['prioridad', 'DESC'], ['createdAt', 'ASC']]
        });
        res.render('mesa/index', { title: 'Mesa de Entrada', espera });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

// 2. Buscar Paciente
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

// 3. Registrar Visita
exports.registrarVisita = async (req, res) => {
    try {
        await Visita.create({ ...req.body, estado: 'Esperando' });
        res.redirect('/mesa-entrada');
    } catch (error) {
        console.error(error);
        res.redirect('/mesa-entrada/nuevo');
    }
};

// 4. Registrar Completo
exports.registrarCompleto = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { 
            dni, nombre, apellido, fecha_nacimiento, sexo, 
            direccion, telefono, email, obra_social, numero_afiliado,
            motivo, prioridad, tipo_ingreso 
        } = req.body;

        const nuevoPaciente = await Paciente.create({
            dni, nombre, apellido, fecha_nacimiento, sexo,
            direccion: direccion || 'No especificada', 
            telefono: telefono || 'No especificado',
            email: email || null,
            obra_social,
            numero_afiliado
        }, { transaction: t });

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

// 5. Atender
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

// 6. Finalizar Visita (Alta a Casa)
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

// 7. Derivar a Internación (ESTA ES LA QUE FALTABA)
exports.internar = async (req, res) => {
    const { id } = req.params;
    try {
        const visita = await Visita.findByPk(id);
        if (!visita) return res.redirect('/mesa-entrada');

        // Cerramos la guardia como "Internado"
        await visita.update({ estado: 'Internado' });

        // Redirigimos a la pantalla de asignar cama
        res.redirect(`/internacion/nuevo?paciente_id=${visita.paciente_id}`);

    } catch (error) {
        console.error("Error al derivar:", error);
        res.redirect('/mesa-entrada');
    }
};