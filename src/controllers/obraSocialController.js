const { ObraSocial } = require('../models');
const { registrarAuditoria } = require('../helpers/auditoria');

exports.listar = async (req, res) => {
    try {
        const obras = await ObraSocial.findAll({
            order: [['nombre', 'ASC']]
        });
        res.render('admin/obras/index', { 
            title: 'Gestión de Obras Sociales',
            obras 
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
};

exports.mostrarCrear = (req, res) => {
    res.render('admin/obras/create', { title: 'Nueva Obra Social' });
};

exports.crear = async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        await ObraSocial.create({ nombre, descripcion });
        res.redirect('/admin/obras-sociales');
    } catch (error) {
        console.error(error);
        res.render('admin/obras/create', { 
            title: 'Nueva Obra Social',
            error: 'Error al crear (¿nombre duplicado?)' 
        });
    }
};

exports.mostrarEditar = async (req, res) => {
    try {
        const obra = await ObraSocial.findByPk(req.params.id);
        if (!obra) return res.redirect('/admin/obras-sociales');
        res.render('admin/obras/edit', { title: 'Editar Obra Social', obra });
    } catch (error) {
        res.redirect('/admin/obras-sociales');
    }
};

exports.editar = async (req, res) => {
    const { nombre, descripcion, activo } = req.body;
    try {
        await ObraSocial.update({ nombre, descripcion, activo }, { 
            where: { id: req.params.id } 
        });
        res.redirect('/admin/obras-sociales');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/obras-sociales');
    }
};

exports.eliminar = async (req, res) => {
    try {
        await ObraSocial.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/obras-sociales');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/obras-sociales?error=true');
    }
};
// Desactivar obra social (mejorado)
exports.desactivarObraSocial = async (req, res) => {
    try {
        const { id } = req.params;
        const obra = await ObraSocial.findByPk(id);

        await ObraSocial.update({ activo: false }, { where: { id } });

        await registrarAuditoria(
            'Desactivó obra social',
            `Obra Social: ${obra ? obra.nombre : 'ID ' + id}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/admin/obras-sociales');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/obras-sociales');
    }
};

// Reactivar obra social (mejorado)
exports.reactivarObraSocial = async (req, res) => {
    try {
        const { id } = req.params;
        const obra = await ObraSocial.findByPk(id);

        await ObraSocial.update({ activo: true }, { where: { id } });

        await registrarAuditoria(
            'Reactivó obra social',
            `Obra Social: ${obra ? obra.nombre : 'ID ' + id}`,
            req.session.usuario.id,
            req.ip
        );

        res.redirect('/admin/obras-sociales');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/obras-sociales');
    }
};