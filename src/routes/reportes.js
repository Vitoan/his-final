const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// No poner middlewares aquí de nuevo (ya están en app.js)
router.get('/', adminController.reportes);

module.exports = router;