const { Ala, Habitacion, Cama, Internacion, Paciente } = require('../models');

// ======================================================
// Mapa de Camas
// ======================================================

exports.listarMapa = async (req, res) => {
    try {
        const alas = await Ala.findAll({
            include: [{
                model: Habitacion,
                include: [{
                    model: Cama,
                    include: [{
                        model: Internacion,
                        where: { estado: 'Activa' },
                        required: false,
                        include: [{ model: Paciente }]
                    }]
                }]
            }],
            order: [
                ['nombre', 'ASC'],
                [Habitacion, 'numero', 'ASC'],
                [Habitacion, Cama, 'numero_cama', 'ASC']
            ]
        });

        let asignandoPaciente = null;
let admisionId = null;

if (req.query.paciente_id) {
    asignandoPaciente = await Paciente.findByPk(req.query.paciente_id);
}

if (req.query.admision_id) {
    admisionId = req.query.admision_id;
}

        res.render('rooms/index', { 
            title: 'Mapa de Camas', 
            alas: alas, 
            asignandoPaciente,
            admisionId,
            error: req.query.error 
        });

    } catch (error) {
        console.error("Error en mapa:", error);
        res.send("Error cargando mapa: " + error.message);
    }
};

exports.finalizarLimpieza = async (req, res) => {
    const { idCama } = req.params;
    try {
        await Cama.update({ estado: 'Disponible' }, { where: { id: idCama } });
        res.redirect('/habitaciones');
    } catch (error) {
        console.error(error);
        res.redirect('/habitaciones?error=' + encodeURIComponent("Error al finalizar limpieza"));
    }
};

// ======================================================
//  CRUD DE HABITACIONES (ADMIN)
// ======================================================

// Listar todas las habitaciones (para admin)
exports.listar = async (req, res) => {
    try {
        const habitaciones = await Habitacion.findAll({
            include: [{ model: Ala }],
            order: [['numero', 'ASC']]
        });
        res.render('admin/habitaciones/index', {
            title: 'Gestión de Habitaciones',
            habitaciones
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
};

// Mostrar formulario crear
exports.mostrarCrear = async (req, res) => {
    try {
        const alas = await Ala.findAll({ where: { activo: true }, order: [['nombre', 'ASC']] });
        res.render('admin/habitaciones/create', {
            title: 'Nueva Habitación',
            alas
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/habitaciones');
    }
};

// Crear habitación
exports.crear = async (req, res) => {
    const { numero, tipo, ala_id } = req.body;
    try {
        await Habitacion.create({
            numero,
            tipo,
            ala_id: ala_id || null
        });
        res.redirect('/admin/habitaciones');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/habitaciones/nuevo');
    }
};

// Mostrar formulario editar
exports.mostrarEditar = async (req, res) => {
    try {
        const habitacion = await Habitacion.findByPk(req.params.id);
        const alas = await Ala.findAll({ where: { activo: true }, order: [['nombre', 'ASC']] });

        if (!habitacion) return res.redirect('/admin/habitaciones');

        res.render('admin/habitaciones/edit', {
            title: 'Editar Habitación',
            habitacion,
            alas
        });
    } catch (error) {
        res.redirect('/admin/habitaciones');
    }
};

// Actualizar habitación
exports.editar = async (req, res) => {
    const { numero, tipo, ala_id, activo } = req.body;
    try {
        await Habitacion.update({
            numero,
            tipo,
            ala_id: ala_id || null,
            activo: activo === 'on'
        }, {
            where: { id: req.params.id }
        });
        res.redirect('/admin/habitaciones');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/habitaciones');
    }
};

// Desactivar habitación
exports.desactivar = async (req, res) => {
    try {
        await Habitacion.update({ activo: false }, { where: { id: req.params.id } });
        res.redirect('/admin/habitaciones');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/habitaciones');
    }
};

// Reactivar habitación
exports.reactivar = async (req, res) => {
    try {
        await Habitacion.update({ activo: true }, { where: { id: req.params.id } });
        res.redirect('/admin/habitaciones');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/habitaciones');
    }
};