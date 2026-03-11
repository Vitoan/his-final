const { Paciente, Internacion, Visita, Cama, Habitacion, Usuario } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

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

// 3. Guardar Nuevo Paciente (CREATE) + Auto-Crear Usuario
exports.create = async (req, res) => {
    try {
        if (req.body.email === '') req.body.email = null;

        // 1. Creamos al Paciente
        const nuevoPaciente = await Paciente.create(req.body);

        // 2. Si NO es NN, le creamos su cuenta para el Portal
        if (!nuevoPaciente.es_nn && nuevoPaciente.dni && nuevoPaciente.nombre) {
            
            const primerNombre = nuevoPaciente.nombre.trim().split(' ')[0].toLowerCase();
            const passwordPlana = `${primerNombre}${nuevoPaciente.dni}`; // Ej: juan35123456
            const passwordHash = await bcrypt.hash(passwordPlana, 10);
            
            // Si no puso email, le inventamos uno para el login usando su DNI
            const emailLogin = nuevoPaciente.email ? nuevoPaciente.email : `${nuevoPaciente.dni}@paciente.his`;

            await Usuario.create({
                nombre: nuevoPaciente.nombre,
                apellido: nuevoPaciente.apellido,
                email: emailLogin,
                password: passwordHash,
                rol: 'Paciente',
                paciente_id: nuevoPaciente.id 
            });
        }

        res.redirect('/admision');
    } catch (error) {
        console.error("Error al crear paciente y usuario:", error);
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
        
        if (req.body.dni && req.body.dni.trim() !== '') {
            req.body.es_nn = false; 
        }
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