exports.registrarCompleto = async (req, res) => {
    const t = await require('../models').sequelize.transaction();
    
    try {
        const { 
            // Datos Personales
            dni, nombre, apellido, fecha_nacimiento, sexo, 
            // Datos de Contacto y Cobertura (Nuevos)
            direccion, telefono, email, obra_social, numero_afiliado,
            // Datos de la Visita
            motivo, prioridad, tipo_ingreso 
        } = req.body;

        // 1. Crear Paciente con todos los datos
        const nuevoPaciente = await Paciente.create({
            dni, 
            nombre, 
            apellido, 
            fecha_nacimiento,
            sexo,
            direccion: direccion || 'No especificada', 
            telefono: telefono || 'No especificado',
            email: email || null,
            obra_social,
            numero_afiliado
        }, { transaction: t });

        // 2. Crear Visita vinculada
        await Visita.create({
            paciente_id: nuevoPaciente.id,
            motivo, 
            prioridad, 
            tipo_ingreso,
            estado: 'Esperando'
        }, { transaction: t });

        await t.commit();
        res.redirect('/mesa-entrada');

    } catch (error) {
        await t.rollback();
        console.error("Error al registrar completo:", error);
        res.redirect(`/mesa-entrada/nuevo?dni=${req.body.dni}&error=true`);
    }
};