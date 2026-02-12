const { Internacion, Cama, Paciente, Habitacion, Auditoria } = require('../models');
const { Op } = require('sequelize');

// A. Mostrar formulario para el flujo desde GUARDIA (Botón "Internar")
exports.renderCreate = async (req, res) => {
    try {
        const { paciente_id } = req.query;
        let paciente = null;
        if (paciente_id) {
            paciente = await Paciente.findByPk(paciente_id);
        }

        const camas = await Cama.findAll({
            where: { estado: 'Disponible' },
            include: [{
                model: Habitacion,
                include: [{
                    model: Cama,
                    as: 'Camas', 
                    where: { estado: 'Ocupada' },
                    required: false,
                    include: [{
                        model: Internacion,
                        where: { fecha_egreso: null },
                        required: false,
                        include: [Paciente]
                    }]
                }]
            }],
            order: [[Habitacion, 'numero', 'ASC'], ['numero_cama', 'ASC']]
        });

        const camasProcesadas = camas.map(cama => {
            let incompatible = false;
            let generoPresente = null;
            if (cama.Habitacion && cama.Habitacion.tipo === 'Compartida' && paciente) {
                cama.Habitacion.Camas.forEach(c => {
                    const internacion = c.Internacions ? c.Internacions[0] : null;
                    if (internacion && internacion.Paciente) generoPresente = internacion.Paciente.sexo;
                });
                if (generoPresente && generoPresente !== paciente.sexo) incompatible = true;
            }
            return { ...cama.get({ plain: true }), incompatible };
        });

        res.render('internacion/create', { title: 'Nueva Internación', paciente, camas: camasProcesadas });
    } catch (error) {
        console.error("Error en renderCreate:", error);
        res.redirect('/mesa-entrada');
    }
};

// B. Mostrar formulario para asignar desde el MAPA DE CAMAS
exports.mostrarFormularioAsignacion = async (req, res) => {
    try {
        const { idCama } = req.params;
        const cama = await Cama.findByPk(idCama, { include: [Habitacion] });
        const pacientes = await Paciente.findAll({ order: [['apellido', 'ASC']] });
        res.render('internacion/assign', { title: 'Asignar Paciente', cama, pacientes });
    } catch (error) {
        console.error("Error en mostrarFormularioAsignacion:", error);
        res.redirect('/habitaciones');
    }
};

// C. Función única para GUARDAR la internación (POST)
exports.create = async (req, res) => {
    try {
        const { cama_id, paciente_id, diagnostico, motivo } = req.body;
        const motivoFinal = diagnostico || motivo;

        await Internacion.create({
            paciente_id,
            cama_id,
            motivo: motivoFinal,
            fecha_ingreso: new Date(),
            estado: 'Activa'
        });

        await Cama.update({ estado: 'Ocupada' }, { where: { id: cama_id } });
        
        res.redirect('/habitaciones');
    } catch (error) {
        console.error("Error en create:", error);
        res.redirect('/mesa-entrada');
    }
};

// D. Función para dar de ALTA
exports.darAlta = async (req, res) => {
    try {
        const { cama_id } = req.body;
        await Internacion.update({ estado: 'Alta', fecha_egreso: new Date() }, { where: { cama_id, estado: 'Activa' } });
        await Cama.update({ estado: 'Limpieza' }, { where: { id: cama_id } });
        res.redirect('/habitaciones');
    } catch (error) {
        console.error("Error en darAlta:", error);
        res.redirect('/habitaciones');
    }
};