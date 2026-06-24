const express = require('express');
const router = express.Router();
const obraSocialController = require('../controllers/obraSocialController');

router.get('/', obraSocialController.listar);
router.get('/nuevo', obraSocialController.mostrarCrear);
router.post('/guardar', obraSocialController.crear);
router.get('/editar/:id', obraSocialController.mostrarEditar);
router.post('/editar/:id', obraSocialController.editar);
router.post('/eliminar/:id', obraSocialController.eliminar);

module.exports = router;