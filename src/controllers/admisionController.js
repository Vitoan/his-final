const db = require('../config/db');

// 1. Mostrar el formulario de registro
exports.mostrarFormulario = (req, res) => {
    res.render('admission/create', { 
        title: 'Nuevo Paciente' 
    });
};

// 2. Guardar el nuevo paciente en la BD
exports.registrarPaciente = async (req, res) => {
    const { nombre, apellido, dni, fecha_nacimiento, telefono, direccion, obra_social, numero_afiliado, sexo } = req.body;

    try {
        // Validacion simple 
        if (!nombre || !apellido || !dni || !sexo) {
            return res.render('admission/create', {
                title: 'Nuevo Paciente',
                error: 'Por favor complete los campos obligatorios.',
                data: req.body // Devolver datos para no borrarlos
            });
        }

        const sql = `
            INSERT INTO pacientes 
            (nombre, apellido, dni, fecha_nacimiento, telefono, direccion, obra_social, numero_afiliado, sexo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(sql, [nombre, apellido, dni, fecha_nacimiento, telefono, direccion, obra_social, numero_afiliado, sexo]);

        // Redirigir al listado  o mostrar exito
        res.redirect('/admision?success=true');

    } catch (error) {
        console.error(error);
        // Manejo de error (ej: DNI duplicado)
        let mensaje = 'Error al guardar el paciente.';
        if (error.code === 'ER_DUP_ENTRY') mensaje = 'El DNI ya está registrado.';

        res.render('admission/create', {
            title: 'Nuevo Paciente',
            error: mensaje,
            data: req.body
        });
    }
};

// 3. Listar pacientes 
exports.listarPacientes = async (req, res) => {
    const pacientes = await db.query('SELECT * FROM pacientes ORDER BY created_at DESC');
    res.render('admission/index', { 
        title: 'Admisión', 
        pacientes 
    });
};