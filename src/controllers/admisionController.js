const { Paciente, Internacion, Visita, Cama, Habitacion } = require('../models');
const { Op } = require('sequelize');

// 1. Listar Pacientes
exports.renderIndex = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({
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
            ],
            order: [['apellido', 'ASC']]
        });
        res.render('admission/index', { title: 'Listado de Pacientes', pacientes });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

// 2. Mostrar Formulario Crear
exports.renderCreate = (req, res) => {
    res.render('admission/create', { 
        title: 'Nuevo Paciente',
        isEditing: false,
        data: null
    });
};

// 3. Guardar Nuevo Paciente (CREATE)
exports.create = async (req, res) => {
    try {
        // LIMPIEZA DE DATOS: Si el email viene vacío, lo convertimos a NULL
        if (req.body.email === '') req.body.email = null;

        await Paciente.create(req.body);
        res.redirect('/admision');
    } catch (error) {
        console.error("Error al crear:", error);
        res.render('admission/create', {
            title: 'Nuevo Paciente',
            isEditing: false,
            error: 'Error: Posible DNI duplicado o Email inválido.',
            data: req.body
        });
    }
};

// 4. Mostrar Formulario Editar
exports.renderEdit = async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id, {
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

        if (!paciente) return res.redirect('/admision');

        res.render('admission/create', {
            title: 'Editar Paciente',
            isEditing: true,
            data: paciente
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admision');
    }
};

// 5. Actualizar Paciente (UPDATE) - ¡AQUÍ ESTABA EL PROBLEMA!
exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        // --- CORRECCIÓN CLAVE ---
        // Si el usuario borra el email y lo deja vacío, Sequelize falla la validación 'isEmail'.
        // Aquí forzamos que si es string vacío, se guarde como NULL.
        if (req.body.email === '') req.body.email = null;

        await Paciente.update(req.body, { where: { id } });
        res.redirect('/admision');
    } catch (error) {
        console.error("Error al actualizar:", error);
        
        // Volvemos a mostrar el formulario con el error
        res.render('admission/create', {
            title: 'Editar Paciente',
            isEditing: true,
            error: 'Error al actualizar. Verifique que el Email sea válido.',
            data: { ...req.body, id: req.params.id }
        });
    }
};

// 6. Eliminar Paciente
exports.delete = async (req, res) => {
    try {
        await Paciente.destroy({ where: { id: req.params.id } });
        res.redirect('/admision');
    } catch (error) {
        console.error(error);
        res.redirect('/admision?error=constraint');
    }
};