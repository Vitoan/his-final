const { Cama, Habitacion, Ala } = require('../models');

// Listar todas las camas
exports.listar = async (req, res) => {
    try {
        const camas = await Cama.findAll({
            include: [{
                model: Habitacion,
                include: [{ model: Ala }]
            }],
            order: [
                [Habitacion, 'numero', 'ASC'],
                ['numero_cama', 'ASC']
            ]
        });
        res.render('admin/camas/index', {
            title: 'Gestión de Camas',
            camas,
            error: req.query.error,
            success: req.query.success
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
};

// Mostrar formulario de creación
exports.mostrarCrear = async (req, res) => {
    try {
        const habitaciones = await Habitacion.findAll({
            where: { activo: true },
            order: [['numero', 'ASC']]
        });
        res.render('admin/camas/create', {
            title: 'Nueva Cama',
            habitaciones
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/camas');
    }
};

// Crear nueva cama
exports.crear = async (req, res) => {
    const { numero_cama, habitacion_id, estado } = req.body;
    try {
        if (!numero_cama || !habitacion_id) {
            return res.redirect('/admin/camas/nuevo?error=' + encodeURIComponent('Todos los campos son obligatorios.'));
        }
        await Cama.create({
            numero_cama: parseInt(numero_cama, 10),
            habitacion_id: parseInt(habitacion_id, 10),
            estado: estado || 'Disponible'
        });
        res.redirect('/admin/camas?success=' + encodeURIComponent('Cama creada exitosamente.'));
    } catch (error) {
        console.error(error);
        res.redirect('/admin/camas/nuevo?error=' + encodeURIComponent('Error al crear la cama.'));
    }
};

// Mostrar formulario de edición
exports.mostrarEditar = async (req, res) => {
    try {
        const cama = await Cama.findByPk(req.params.id, {
            include: [{ model: Habitacion }]
        });
        if (!cama) return res.redirect('/admin/camas');

        const habitaciones = await Habitacion.findAll({
            where: { activo: true },
            order: [['numero', 'ASC']]
        });

        res.render('admin/camas/edit', {
            title: 'Editar Cama',
            cama,
            habitaciones
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/camas');
    }
};

// Actualizar cama
exports.editar = async (req, res) => {
    const { numero_cama, habitacion_id, estado } = req.body;
    try {
        if (!numero_cama || !habitacion_id) {
            return res.redirect(`/admin/camas/editar/${req.params.id}?error=` + encodeURIComponent('Todos los campos son obligatorios.'));
        }
        await Cama.update({
            numero_cama: parseInt(numero_cama, 10),
            habitacion_id: parseInt(habitacion_id, 10),
            estado: estado || 'Disponible'
        }, {
            where: { id: req.params.id }
        });
        res.redirect('/admin/camas?success=' + encodeURIComponent('Cama actualizada exitosamente.'));
    } catch (error) {
        console.error(error);
        res.redirect(`/admin/camas/editar/${req.params.id}?error=` + encodeURIComponent('Error al actualizar la cama.'));
    }
};

// Eliminar cama
exports.eliminar = async (req, res) => {
    try {
        await Cama.destroy({
            where: { id: req.params.id }
        });
        res.redirect('/admin/camas?success=' + encodeURIComponent('Cama eliminada exitosamente.'));
    } catch (error) {
        console.error(error);
        res.redirect('/admin/camas?error=' + encodeURIComponent('No se puede eliminar la cama porque tiene registros clínicos o internaciones asociadas.'));
    }
};
