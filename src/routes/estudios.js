const express = require('express');
const router = express.Router();
const estudioController = require('../controllers/estudioController');

// 1. Ver lista de estudios
router.get('/', estudioController.listarEstudios);

// 2. Solicitar un estudio
router.get('/nuevo', estudioController.renderSolicitar);
router.post('/nuevo', estudioController.solicitar);

// 3. Cargar resultados
router.get('/:id/resultado', estudioController.renderCargarResultado);
router.post('/:id/resultado', estudioController.guardarResultado);

module.exports = router;