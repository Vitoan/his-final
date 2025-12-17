const db = require('../config/db');

// 1. Mostrar formulario de evolución médica
exports.mostrarEvolucion = async (req, res) => {
    const { idInternacion } = req.params;
    try {
        // Datos del paciente
        const [internacion] = await db.query(`
            SELECT i.id, p.nombre, p.apellido, c.numero_cama, h.numero as hab_numero
            FROM internaciones i
            JOIN pacientes p ON i.paciente_id = p.id
            JOIN camas c ON i.cama_id = c.id
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE i.id = ?
        `, [idInternacion]);

        if (!internacion) return res.redirect('/habitaciones');

        // Historial médico
        const evoluciones = await db.query(`
            SELECT * FROM evoluciones_medicas 
            WHERE internacion_id = ? 
            ORDER BY fecha DESC
        `, [idInternacion]);

        res.render('clinical/medical', { 
            title: 'Evolución Médica',
            paciente: internacion, // Ya viene limpio (sin array) si usas mi corrección anterior
            historial: evoluciones 
        });

    } catch (error) {
        console.error(error);
        res.redirect('/habitaciones');
    }
};

// 2. Guardar evolución
exports.guardarEvolucion = async (req, res) => {
    const { internacion_id, diagnostico, tratamiento } = req.body;
    try {
        await db.query(`
            INSERT INTO evoluciones_medicas (internacion_id, diagnostico, tratamiento) 
            VALUES (?, ?, ?)
        `, [internacion_id, diagnostico, tratamiento]);
        
        res.redirect('/medico/evolucionar/' + internacion_id);
    } catch (error) {
        res.send("Error: " + error.message);
    }
};