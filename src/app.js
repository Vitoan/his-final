const express = require('express');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

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

// Rutas (Las agregaremos luego)
app.get('/', (req, res) => {
    res.render('index', { title: 'HIS Hospital' }); // Página de inicio
});

// Iniciar servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});