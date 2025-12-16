const db = require('../config/db');

// Función 1: Mostrar Formulario
exports.mostrarFormularioAsignacion = async (req, res) => {
    const { idCama } = req.params;
    try {
        const results = await db.query(`
            SELECT c.*, h.numero as numero_habitacion, h.tipo 
            FROM camas c 
            JOIN habitaciones h ON c.habitacion_id = h.id 
            WHERE c.id = ?
        `, [idCama]);
        const cama = results[0];
        
        if (!cama) return res.redirect('/habitaciones');

        const pacientes = await db.query(`
            SELECT * FROM pacientes 
            WHERE id NOT IN (SELECT paciente_id FROM internaciones WHERE estado = 'Activa')
        `);

        res.render('internacion/assign', {
            title: 'Asignar Paciente',
            cama: cama,
            pacientes
        });
    } catch (error) {
        console.error(error);
        res.redirect('/habitaciones');
    }
};

// Función 2: Procesar Asignación
exports.procesarAsignacion = async (req, res) => {
    const { cama_id, paciente_id, motivo } = req.body;

    try {
        const [nuevoPaciente] = await db.query('SELECT * FROM pacientes WHERE id = ?', [paciente_id]);
        
        // Validación de Sexo
        const sqlValidacion = `
            SELECT p.sexo 
            FROM internaciones i
            JOIN pacientes p ON i.paciente_id = p.id
            JOIN camas c ON i.cama_id = c.id
            WHERE c.habitacion_id = (SELECT habitacion_id FROM camas WHERE id = ?) 
            AND c.id != ? 
            AND i.estado = 'Activa'
        `;
        
        const ocupantes = await db.query(sqlValidacion, [cama_id, cama_id]);

        if (ocupantes.length > 0) {
            const sexoVecino = ocupantes[0].sexo;
            if (sexoVecino !== nuevoPaciente.sexo) {
                const results = await db.query(`
                    SELECT c.*, h.numero as numero_habitacion, h.tipo 
                    FROM camas c JOIN habitaciones h ON c.habitacion_id = h.id WHERE c.id = ?
                `, [cama_id]);
                const pacientes = await db.query(`
                    SELECT * FROM pacientes WHERE id NOT IN (SELECT paciente_id FROM internaciones WHERE estado = 'Activa')
                `);
                return res.render('internacion/assign', {
                    title: 'Asignar Paciente',
                    cama: results[0],
                    pacientes,
                    error: `No se puede asignar: La habitación ya está ocupada por un paciente de sexo '${sexoVecino}'.`
                });
            }
        }

        await db.query(`INSERT INTO internaciones (paciente_id, cama_id, motivo) VALUES (?, ?, ?)`, [paciente_id, cama_id, motivo]);
        await db.query(`UPDATE camas SET estado = 'Ocupada' WHERE id = ?`, [cama_id]);
        res.redirect('/habitaciones');

    } catch (error) {
        console.error(error);
        res.send("Error: " + error.message);
    }
};

// Función 3: Dar de Alta
exports.darAlta = async (req, res) => {
    const { cama_id } = req.body;
    try {
        await db.query(`UPDATE internaciones SET fecha_egreso = NOW(), estado = 'Alta' WHERE cama_id = ? AND estado = 'Activa'`, [cama_id]);
        await db.query(`UPDATE camas SET estado = 'Disponible' WHERE id = ?`, [cama_id]);
        res.redirect('/habitaciones');
    } catch (error) {
        console.error(error);
        res.send("Error: " + error.message);
    }
};