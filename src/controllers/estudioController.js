const { Estudio, Paciente, Usuario } = require('../models');

// 1. Listar todos los estudios (Laboratorio/Imágenes)
exports.listarEstudios = async (req, res) => {
    try {
        const estudios = await Estudio.findAll({
            include: [
                { model: Paciente },
                { model: Usuario, as: 'Medico' }
            ],
            order: [['fecha_solicitud', 'DESC']]
        });
        res.render('estudios/index', { title: 'Gestión de Estudios Médicos', estudios });
    } catch (error) {
        console.error("Error al listar estudios:", error);
        res.redirect('/');
    }
};

// 2. Mostrar formulario para solicitar un estudio nuevo
exports.renderSolicitar = async (req, res) => {
    try {
        const { paciente_id } = req.query;

        const pacientes = await Paciente.findAll({ order: [['apellido', 'ASC']] });

        // Buscamos el paciente si viene por query
        let pacientePreseleccionado = null;
        if (paciente_id) {
            pacientePreseleccionado = await Paciente.findByPk(paciente_id);
        }

        res.render('estudios/create', { 
            title: 'Solicitar Estudio', 
            pacientes, 
            pacientePreseleccionado
        });
    } catch (error) {
        console.error("Error al cargar formulario:", error);
        res.redirect('/estudios');
    }
};

// 3. Guardar la solicitud del estudio
exports.solicitar = async (req, res) => {
    try {
        const { paciente_id, tipo_estudio, descripcion } = req.body;
        const medico_id = req.session.usuario.id; // Asignación automática del médico
        
        await Estudio.create({
            paciente_id,
            medico_id,
            tipo_estudio,
            descripcion,
            estado: 'Pendiente'
        });

        res.redirect('/estudios');
    } catch (error) {
        console.error("Error al solicitar estudio:", error);
        res.redirect('/estudios/nuevo');
    }
};

// 4. Mostrar formulario para cargar el resultado de un estudio
exports.renderCargarResultado = async (req, res) => {
    try {
        const estudio = await Estudio.findByPk(req.params.id, {
            include: [{ model: Paciente }, { model: Usuario, as: 'Medico' }]
        });

        if (!estudio) return res.redirect('/estudios');

        // Si ya tiene resultado, lo mostramos en modo solo lectura
        const yaTieneResultado = estudio.resultado && estudio.resultado.trim() !== '';

        res.render('estudios/resultado', { 
            title: 'Resultado del Estudio', 
            estudio,
            yaTieneResultado   // ← Nueva variable
        });
    } catch (error) {
        console.error("Error al cargar estudio:", error);
        res.redirect('/estudios');
    }
};

// 5. Guardar el resultado y cambiar estado a "Realizado"
exports.guardarResultado = async (req, res) => {
    try {
        const { resultado } = req.body;
        
        await Estudio.update({
            resultado,
            estado: 'Realizado',
            fecha_realizacion: new Date()
        }, { 
            where: { id: req.params.id } 
        });

        res.redirect('/estudios');
    } catch (error) {
        console.error("Error al guardar resultado:", error);
        res.redirect('/estudios');
    }
};