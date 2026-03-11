const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Solo el dashboard por ahora
router.get('/inicio', pacienteController.renderDashboard);

module.exports = router;