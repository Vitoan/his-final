const express = require('express');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

// Importar rutas
const admisionRoutes = require('./routes/admision');
const habitacionesRoutes = require('./routes/habitaciones');

const app = express();

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false })); // Para recibir datos de formularios
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // Archivos estáticos

// Rutas
app.use('/admision', admisionRoutes); // Módulo de admisión
app.use('/habitaciones', habitacionesRoutes); // Módulo de habitaciones 


// Redireccionar la raíz a admisión (por ahora)
app.get('/', (req, res) => {
    res.redirect('/admision');
});

// Iniciar servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});