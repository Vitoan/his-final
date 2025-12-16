const express = require('express');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

// Importar rutas
const admisionRoutes = require('./routes/admision');
const habitacionesRoutes = require('./routes/habitaciones');
const internacionesRoutes = require('./routes/internaciones'); // <--- Verifica que el archivo routes/internaciones.js exista

const app = express();

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Usar Rutas
app.use('/admision', admisionRoutes);
app.use('/habitaciones', habitacionesRoutes);
app.use('/internacion', internacionesRoutes); // <--- Aquí estaba fallando

// Redireccionar raíz
app.get('/', (req, res) => {
    res.redirect('/admision');
});

// Iniciar servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});