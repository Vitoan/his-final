const db = require('../config/db');

// 1. Mostrar formulario de evaluación
exports.mostrarFormulario = async (req, res) => {
    const { idInternacion } = req.params;
    try {
        // CORRECCIÓN: Quitamos los corchetes [ ] en la declaración
        // Ahora 'resultados' es el array completo de filas encontradas
        const resultados = await db.query(`
            SELECT i.id, p.nombre, p.apellido, c.numero_cama, h.numero as hab_numero
            FROM internaciones i
            JOIN pacientes p ON i.paciente_id = p.id
            JOIN camas c ON i.cama_id = c.id
            JOIN habitaciones h ON c.habitacion_id = h.id
            WHERE i.id = ?
        `, [idInternacion]);

        // Validamos si encontró algo
        if (resultados.length === 0) {
            return res.redirect('/habitaciones');
        }

        const pacienteEncontrado = resultados[0]; // Tomamos la primera fila

        // Buscamos evaluaciones previas (Historial)
        // NOTA: Aquí también recibimos un array directamente
        const evaluaciones = await db.query(`
            SELECT * FROM evaluaciones_enfermeria 
            WHERE internacion_id = ? 
            ORDER BY fecha DESC
        `, [idInternacion]);

        res.render('clinical/nursing', { 
            title: 'Evaluación de Enfermería',
            paciente: pacienteEncontrado, // Pasamos el objeto correcto
            historial: evaluaciones
        });

    } catch (error) {
        console.error(error);
        res.redirect('/habitaciones');
    }
};

// 2. Guardar la evaluación
exports.guardarEvaluacion = async (req, res) => {
    const { internacion_id, presion, pulso, temperatura, antecedentes, observaciones } = req.body;
    
    try {
        await db.query(`
            INSERT INTO evaluaciones_enfermeria 
            (internacion_id, presion_arterial, frecuencia_cardiaca, temperatura, antecedentes, observaciones)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [internacion_id, presion, pulso, temperatura, antecedentes, observaciones]);
        
        // Volvemos al formulario para ver el historial actualizado
        res.redirect('/enfermeria/evaluar/' + internacion_id);

    } catch (error) {
        console.error(error);
        res.send("Error al guardar: " + error.message);
    }
};