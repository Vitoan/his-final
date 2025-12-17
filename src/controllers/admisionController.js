const { Paciente } = require('../models'); // Importamos el Modelo

// 1. Mostrar formulario
exports.mostrarFormulario = (req, res) => {
    res.render('admission/create', { 
        title: 'Nuevo Paciente',
        isEditing: false 
    });
};

// 2. Guardar Paciente (CREATE)
exports.registrarPaciente = async (req, res) => {
    try {
        await Paciente.create(req.body); // Sequelize hace el INSERT mágico
        res.redirect('/admision?success=true');
    } catch (error) {
        console.error(error);
        res.render('admission/create', {
            title: 'Nuevo Paciente',
            error: 'Error al guardar (Posible DNI duplicado)',
            data: req.body,
            isEditing: false
        });
    }
};

// 3. Listar Pacientes (READ)
exports.listarPacientes = async (req, res) => {
    const { error } = req.query;
    try {
        const pacientes = await Paciente.findAll({ 
            order: [['createdAt', 'DESC']] 
        });
        
        res.render('admission/index', { 
            title: 'Admisión', 
            pacientes,
            error: error === 'constraint' ? 'No se puede borrar: Tiene historial médico.' : null
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

// 4. Formulario Edición
exports.mostrarFormularioEdicion = async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);
        if (!paciente) return res.redirect('/admision');

        res.render('admission/create', { 
            title: 'Editar Paciente', 
            data: paciente, 
            isEditing: true 
        });
    } catch (error) {
        res.redirect('/admision');
    }
};

// 5. Actualizar (UPDATE)
exports.actualizarPaciente = async (req, res) => {
    try {
        await Paciente.update(req.body, {
            where: { id: req.params.id }
        });
        res.redirect('/admision');
    } catch (error) {
        res.redirect('/admision');
    }
};

// 6. Borrar (DELETE)
exports.borrarPaciente = async (req, res) => {
    try {
        await Paciente.destroy({ where: { id: req.params.id } });
        res.redirect('/admision');
    } catch (error) {
        // Sequelize lanzará error si hay foreign keys (Internaciones)
        res.redirect('/admision?error=constraint');
    }
};