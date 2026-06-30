const { Ala, Habitacion } = require('../models');

// Listar todas las alas
exports.listar = async (req, res) => {
    try {
        const alas = await Ala.findAll({
            include: [{ model: Habitacion }],
            order: [['nombre', 'ASC']]
        });
        res.render('admin/alas/index', {
            title: 'Gestión de Alas',
            alas
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
};

// Mostrar formulario de creación
exports.mostrarCrear = (req, res) => {
    res.render('admin/alas/create', { title: 'Nueva Ala' });
};

// Crear nueva ala
exports.crear = async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        await Ala.create({ nombre, descripcion });
        res.redirect('/admin/alas');
    } catch (error) {
        console.error(error);
        res.render('admin/alas/create', {
            title: 'Nueva Ala',
            error: 'Error al crear el ala (¿nombre duplicado?)'
        });
    }
};

// Mostrar formulario de edición
exports.mostrarEditar = async (req, res) => {
    try {
        const ala = await Ala.findByPk(req.params.id);
        if (!ala) return res.redirect('/admin/alas');

        res.render('admin/alas/edit', {
            title: 'Editar Ala',
            ala
        });
    } catch (error) {
        res.redirect('/admin/alas');
    }
};

// Actualizar ala
exports.editar = async (req, res) => {
    const { nombre, descripcion, activo } = req.body;
    try {
        await Ala.update(
            { nombre, descripcion, activo: activo === 'on' },
            { where: { id: req.params.id } }
        );
        res.redirect('/admin/alas');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/alas');
    }
};

// Desactivar ala
exports.desactivar = async (req, res) => {
    try {
        await Ala.update({ activo: false }, { where: { id: req.params.id } });
        res.redirect('/admin/alas');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/alas');
    }
};

// Reactivar ala
exports.reactivar = async (req, res) => {
    try {
        await Ala.update({ activo: true }, { where: { id: req.params.id } });
        res.redirect('/admin/alas');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/alas');
    }
};