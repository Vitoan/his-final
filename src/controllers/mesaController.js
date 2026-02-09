const { Paciente, Visita } = require('../models');
const { Op } = require('sequelize');

// 1. Dashboard de Mesa de Entrada
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

// 2. Buscar Paciente (AQUÍ ESTÁ EL ARREGLO)
exports.buscarPaciente = async (req, res) => {
    const { dni } = req.query;
    let paciente = null;
    let mostrarAlta = false; // 📍 1. Inicializamos la bandera en falso
    let mensaje = null;

    if (dni) {
        paciente = await Paciente.findOne({ where: { dni } });
        
        // Si buscó DNI pero NO lo encontró:
        if (!paciente) {
            mostrarAlta = true; // 📍 2. ¡ENCENDEMOS LA SEÑAL!
            mensaje = "Paciente no encontrado. Complete los datos para ingresarlo.";
        }
    }

    res.render('mesa/checkin', {
        title: 'Registrar Ingreso',
        paciente,
        dniBuscado: dni,
        mostrarAlta, // 📍 3. Enviamos la señal a la vista
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

exports.registrarCompleto = async (req, res) => {
    const t = await require('../models').sequelize.transaction();
    
    try {
        // 1. Recibimos TODOS los datos del formulario (incluyendo telefono, direccion, email)
        const { 
            dni, nombre, apellido, fecha_nacimiento, 
            telefono, direccion, email, // <--- CAMPOS NUEVOS
            motivo, prioridad, tipo_ingreso 
        } = req.body;

        // 2. Creamos el Paciente con los datos reales
        const nuevoPaciente = await Paciente.create({
            dni, 
            nombre, 
            apellido, 
            fecha_nacimiento,
            // Si el usuario deja vacío email, guardamos null o un string vacío
            direccion: direccion || 'Sin especificar', 
            telefono: telefono || 'Sin especificar',
            email: email || null 
        }, { transaction: t });

        // 3. Creamos la Visita vinculada
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
        console.error("Error al registrar completo:", error);
        // En caso de error, volvemos al formulario (idealmente pasando los errores)
        res.redirect(`/mesa-entrada/nuevo?dni=${req.body.dni}&error=true`);
    }
};

// 5. Atender
exports.atender = async (req, res) => {
    const { id } = req.params;
    await Visita.update({ estado: 'En Atención' }, { where: { id } });
    res.redirect('/mesa-entrada');
};