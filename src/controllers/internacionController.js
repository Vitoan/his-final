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
        
        // 1. Buscamos la cama, SU HABITACIÓN y los COMPAÑEROS de cuarto
        const cama = await Cama.findByPk(idCama, { 
            include: [{ 
                model: Habitacion,
                include: [{
                    model: Cama,
                    as: 'Camas', 
                    where: { 
                        estado: 'Ocupada',
                        id: { [Op.ne]: idCama } // Excluir la cama actual (por si acaso)
                    },
                    required: false, // Left Join (queremos la habitación aunque esté vacía)
                    include: [{
                        model: Internacion,
                        where: { fecha_egreso: null, estado: 'Activa' }, // Solo internaciones vigentes
                        required: false,
                        include: [Paciente] // Necesitamos el sexo del paciente
                    }]
                }] 
            }] 
        });

        if (!cama) return res.redirect('/habitaciones');

        // 2. Determinar si hay restricción de sexo
        let sexoRequerido = null;
        if (cama.Habitacion.tipo === 'Compartida' && cama.Habitacion.Camas && cama.Habitacion.Camas.length > 0) {
            // Buscamos el primer paciente activo en la habitación para definir el sexo
            for (const c of cama.Habitacion.Camas) {
                if (c.Internacions && c.Internacions.length > 0 && c.Internacions[0].Paciente) {
                    sexoRequerido = c.Internacions[0].Paciente.sexo;
                    break; // Con encontrar uno basta
                }
            }
        }

        // 3. Buscar Pacientes Disponibles (NO INTERNADOS) y aplicar filtro de sexo
        const todosLosPacientes = await Paciente.findAll({ 
            order: [['apellido', 'ASC']],
            include: [{
                model: Internacion,
                where: { estado: 'Activa' },
                required: false
            }]
        });

        // Filtramos en memoria
        const pacientesDisponibles = todosLosPacientes.filter(p => {
            // A. Que no esté internado actualmente
            const noEstaInternado = p.Internacions.length === 0;
            
            // B. Que cumpla con el sexo (si hay restricción)
            const sexoCompatible = sexoRequerido ? p.sexo === sexoRequerido : true;

            return noEstaInternado && sexoCompatible;
        });

        res.render('internacion/assign', { 
            title: 'Asignar Paciente', 
            cama, 
            pacientes: pacientesDisponibles,
            sexoRequerido // Pasamos esto a la vista para mostrar un aviso
        });

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