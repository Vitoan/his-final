const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Ruta de reportes
router.get('/', adminController.reportes);

module.exports = router;