const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Rutas de usuarios
router.get('/usuarios', adminController.listarUsuarios);
router.get('/usuarios/nuevo', adminController.mostrarFormulario);
router.post('/usuarios', adminController.crearUsuario);
router.get('/usuarios/editar/:id', adminController.mostrarFormularioEditar);
router.post('/usuarios/actualizar/:id', adminController.actualizarUsuario);

// Nuevas rutas (Desactivar / Reactivar)
router.post('/usuarios/desactivar/:id', adminController.desactivarUsuario);
router.post('/usuarios/reactivar/:id', adminController.reactivarUsuario);

module.exports = router;