const { Paciente, Internacion, Visita, Cama, Habitacion } = require('../models');
const { Op } = require('sequelize');

// 1. Listar Pacientes (CON ESTADO EN TIEMPO REAL)
exports.renderIndex = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({
            include: [
                {
                    // Buscar si está Internado
                    model: Internacion,
                    required: false,
                    where: { fecha_egreso: null }, // Solo activas
                    include: [{ model: Cama, include: [Habitacion] }]
                },
                {
                    // Buscar si está en Mesa de Entrada (Guardia)
                    model: Visita,
                    required: false,
                    where: { estado: { [Op.or]: ['Esperando', 'En Atención'] } }
                }
            ],
            order: [['apellido', 'ASC']]
        });

        res.render('admission/index', {
            title: 'Listado de Pacientes',
            pacientes
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

// 2. Mostrar Formulario de Creación
exports.renderCreate = (req, res) => {
    res.render('admission/create', { 
        title: 'Nuevo Paciente',
        isEditing: false,
        data: null
    });
};

// 3. Guardar Nuevo Paciente
exports.create = async (req, res) => {
    try {
        await Paciente.create(req.body);
        res.redirect('/admision');
    } catch (error) {
        console.error(error);
        res.render('admission/create', {
            title: 'Nuevo Paciente',
            isEditing: false,
            error: 'Error al guardar. Verifique si el DNI ya existe.',
            data: req.body
        });
    }
};

// 4. Mostrar Formulario de Edición (CON ALERTAS ACTIVADAS)
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

// 5. Actualizar Paciente
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        await Paciente.update(req.body, { where: { id } });
        res.redirect('/admision');
    } catch (error) {
        res.render('admission/create', {
            title: 'Editar Paciente',
            isEditing: true,
            error: 'Error al actualizar datos.',
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
        res.redirect('/admision');
    }
};