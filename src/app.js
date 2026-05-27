const express = require('express');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
const session = require('express-session');

// --- 1. INICIALIZAR APP (Lo primero) ---
const app = express();

// --- 2. IMPORTAR MODELOS Y RUTAS ---
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/auth');
const checkRole = require('./middlewares/roles');
const admisionRoutes = require('./routes/admision');
const habitacionesRoutes = require('./routes/habitaciones');
const internacionesRoutes = require('./routes/internaciones');
const enfermeriaRoutes = require('./routes/enfermeria');
const medicoRoutes = require('./routes/medico');
const clinicaRoutes = require('./routes/clinica');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');


// --- 3. CONFIGURACIONES ---
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// --- 4. MIDDLEWARES GENERALES ---
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false })); // Para recibir datos de formularios
app.use(express.json()); // Para recibir JSON (AJAX)
app.use(express.static(path.join(__dirname, '../public')));


// --- 5. CONFIGURACIÓN DE SESIÓN ---
app.use(session({
    secret: 'secreto_super_seguro_his_2025',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// --- 6. MIDDLEWARE DE USUARIO GLOBAL ---
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario;
    next();
});

// --- 7. DEFINICIÓN DE RUTAS ---

// Públicas
app.use('/auth', authRoutes);

// Protegidas con Autenticación y Autorización por Rol
app.use('/admision', authMiddleware, checkRole(['Admin', 'Admision', 'Enfermeria']), admisionRoutes);
app.use('/habitaciones', authMiddleware, checkRole(['Admin', 'Admision', 'Enfermeria', 'Medico']), habitacionesRoutes);
app.use('/internacion', authMiddleware, checkRole(['Admin', 'Admision', 'Medico', 'Enfermeria']), internacionesRoutes);
app.use('/enfermeria', authMiddleware, checkRole(['Admin', 'Enfermeria']), enfermeriaRoutes);
app.use('/medico', authMiddleware, checkRole(['Admin', 'Medico']), medicoRoutes); 
app.use('/clinica', authMiddleware, checkRole(['Admin', 'Medico', 'Enfermeria']), clinicaRoutes);
app.use('/admin', authMiddleware, checkRole(['Admin']), adminRoutes);
app.use('/api', authMiddleware, checkRole(['Admin', 'Admision', 'Medico', 'Enfermeria']), apiRoutes);
app.use('/mesa-entrada', authMiddleware, checkRole(['Admin', 'Admision', 'Enfermeria']), require('./routes/mesa'));
app.use('/turnos', authMiddleware, checkRole(['Admin', 'Admision', 'Medico', 'Enfermeria']), require('./routes/turnos'));
app.use('/estudios', authMiddleware, checkRole(['Admin', 'Medico', 'Enfermeria']), require('./routes/estudios'));
app.use('/portal', authMiddleware, checkRole(['Paciente', 'Admin']), require('./routes/portal'));

// --- CAMBIO IMPORTANTE AQUÍ ---
// Ruta Raíz: Si está logueado, muestra el INDEX (Menú Principal), no Admisión.
// --- RUTA DE RESCATE (Para crear usuarios de prueba) ---
app.get('/setup-usuarios', async (req, res) => {
    try {
        const { Usuario } = require('./models');
        const bcrypt = require('bcryptjs'); 
        const passwordHash = await bcrypt.hash('123456', 10);

        // 1. Creamos un Paciente de prueba
        await Usuario.findOrCreate({
            where: { email: 'paciente@test.com' },
            defaults: {
                nombre: 'Victor',
                apellido: 'Prueba',
                email: 'paciente@test.com',
                password: passwordHash,
                rol: 'Paciente',
                paciente_id: 1 // Debe existir en la DB
            }
        });
        
        // 2. Creamos un Administrador
        await Usuario.findOrCreate({
            where: { email: 'admin@his.com' },
            defaults: {
                nombre: 'Admin',
                apellido: 'Sistema',
                email: 'admin@his.com',
                password: passwordHash,
                rol: 'Admin'
            }
        });

        // 3. Creamos un Médico
        await Usuario.findOrCreate({
            where: { email: 'medico@his.com' },
            defaults: {
                nombre: 'Gregory',
                apellido: 'House',
                email: 'medico@his.com',
                password: passwordHash,
                rol: 'Medico'
            }
        });

        // 4. Creamos una Enfermera
        await Usuario.findOrCreate({
            where: { email: 'enfermera@his.com' },
            defaults: {
                nombre: 'Joy',
                apellido: 'Enfermera',
                email: 'enfermera@his.com',
                password: passwordHash,
                rol: 'Enfermeria'
            }
        });

        res.send(`
            <h1>✅ ¡Usuarios creados con éxito!</h1>
            <p>Ya puedes iniciar sesión con:</p>
            <ul>
                <li><b>Paciente:</b> paciente@test.com (Clave: 123456)</li>
                <li><b>Admin:</b> admin@his.com (Clave: 123456)</li>
                <li><b>Médico:</b> medico@his.com (Clave: 123456)</li>
                <li><b>Enfermería:</b> enfermera@his.com (Clave: 123456)</li>
            </ul>
            <a href="/auth/login" style="padding: 10px; background: blue; color: white; text-decoration: none; border-radius: 5px;">Ir al Login</a>
        `);
    } catch (error) {
        res.send('Hubo un error (revisa tu consola): ' + error.message);
        console.error(error);
    }
});
app.get('/', (req, res) => {
    if (req.session.usuario) {
        // Renderiza la vista 'src/views/index.pug'
        res.render('index', { title: 'Inicio - HIS Pro' });
    } else {
        res.redirect('/auth/login');
    }
});

// --- 8. SINCRONIZAR BD E INICIAR SERVIDOR ---
sequelize.sync({ alter: true })
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log(`✅ Servidor conectado a BD y corriendo en http://localhost:${app.get('port')}`);
        });
    })
    .catch(err => {
        console.error('❌ No se pudo conectar a la BD:', err);
    });