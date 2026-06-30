const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Dashboard
router.get('/', (req, res) => {
    res.render('admin/dashboard');
});

// Usuarios
router.get('/usuarios', adminController.listarUsuarios);
router.get('/usuarios/nuevo', adminController.mostrarFormulario);
router.post('/usuarios', adminController.crearUsuario);
router.get('/usuarios/editar/:id', adminController.mostrarFormularioEditar);
router.post('/usuarios/actualizar/:id', adminController.actualizarUsuario);
router.post('/usuarios/desactivar/:id', adminController.desactivarUsuario);
router.post('/usuarios/reactivar/:id', adminController.reactivarUsuario);

// Auditoría
router.get('/auditoria', adminController.verAuditoria);

// Obras Sociales (usamos el controlador de obras sociales)
router.use('/obras-sociales', require('./obrasSociales'));

// Reportes
router.get('/reportes', adminController.reportes);

module.exports = router;