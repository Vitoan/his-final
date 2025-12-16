const db = require('../config/db');

// 1. Mostrar el formulario de registro (CREATE - GET)
exports.mostrarFormulario = (req, res) => {
    res.render('admission/create', { 
        title: 'Nuevo Paciente',
        isEditing: false // Importante para saber si el formulario crea o edita
    });
};

// 2. Guardar el nuevo paciente (CREATE - POST)
exports.registrarPaciente = async (req, res) => {
    const { nombre, apellido, dni, fecha_nacimiento, telefono, direccion, obra_social, numero_afiliado, sexo } = req.body;

    try {
        if (!nombre || !apellido || !dni || !sexo) {
            return res.render('admission/create', {
                title: 'Nuevo Paciente',
                error: 'Por favor complete los campos obligatorios.',
                data: req.body,
                isEditing: false
            });
        }

        const sql = `
            INSERT INTO pacientes 
            (nombre, apellido, dni, fecha_nacimiento, telefono, direccion, obra_social, numero_afiliado, sexo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(sql, [nombre, apellido, dni, fecha_nacimiento, telefono, direccion, obra_social, numero_afiliado, sexo]);

        res.redirect('/admision?success=true');

    } catch (error) {
        console.error(error);
        let mensaje = 'Error al guardar el paciente.';
        if (error.code === 'ER_DUP_ENTRY') mensaje = 'El DNI ya está registrado.';

        res.render('admission/create', {
            title: 'Nuevo Paciente',
            error: mensaje,
            data: req.body,
            isEditing: false
        });
    }
};

// 3. Listar pacientes (READ)
exports.listarPacientes = async (req, res) => {
    // Capturamos el error de la URL si existe (ej: /admision?error=constraint)
    const { error } = req.query; 
    
    let mensajeError = null;
    if (error === 'constraint') {
        mensajeError = 'No se puede eliminar al paciente: Tiene historial clínico o internaciones activas.';
    }

    try {
        const pacientes = await db.query('SELECT * FROM pacientes ORDER BY created_at DESC');
        res.render('admission/index', { 
            title: 'Admisión', 
            pacientes,
            error: mensajeError // Pasamos el mensaje a la vista
        });
    } catch (error) {
        console.error(error);
        res.render('admission/index', { title: 'Admisión', pacientes: [], error: 'Error al cargar listado.' });
    }
};

// 4. Mostrar formulario de Edición (UPDATE - GET)
exports.mostrarFormularioEdicion = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await db.query('SELECT * FROM pacientes WHERE id = ?', [id]);
        
        if (results.length === 0) {
            return res.redirect('/admision');
        }

        res.render('admission/create', { 
            title: 'Editar Paciente', 
            data: results[0], // Pasamos los datos existentes
            isEditing: true // Activamos modo edición
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admision');
    }
};

// 5. Procesar la Actualización (UPDATE - POST)
exports.actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, fecha_nacimiento, telefono, direccion, obra_social, numero_afiliado, sexo } = req.body;

    try {
        const sql = `
            UPDATE pacientes 
            SET nombre=?, apellido=?, dni=?, fecha_nacimiento=?, telefono=?, direccion=?, obra_social=?, numero_afiliado=?, sexo=? 
            WHERE id=?
        `;
        
        await db.query(sql, [nombre, apellido, dni, fecha_nacimiento, telefono, direccion, obra_social, numero_afiliado, sexo, id]);
        
        res.redirect('/admision');
    } catch (error) {
        console.error(error);
        res.render('admission/create', {
            title: 'Editar Paciente',
            error: 'Error al actualizar el paciente: ' + error.message,
            data: { ...req.body, id }, // Mantenemos los datos ingresados
            isEditing: true
        });
    }
};

// 6. Borrar Paciente (DELETE)
exports.borrarPaciente = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM pacientes WHERE id = ?', [id]);
        res.redirect('/admision');
    } catch (error) {
        console.error(error);
        // Si falla (ej: tiene internaciones asociadas), redirigimos con un parámetro de error
        // En un sistema real usaríamos sesiones flash, pero esto sirve para salir del paso
        res.redirect('/admision?error=constraint'); 
    }
};