const express = require('express');
const router = express.Router();
const alaController = require('../controllers/alaController');

// Listar
router.get('/', alaController.listar);

// Crear
router.get('/nuevo', alaController.mostrarCrear);
router.post('/guardar', alaController.crear);

// Editar
router.get('/editar/:id', alaController.mostrarEditar);
router.post('/editar/:id', alaController.editar);

// Desactivar / Reactivar
router.post('/desactivar/:id', alaController.desactivar);
router.post('/reactivar/:id', alaController.reactivar);

module.exports = router;