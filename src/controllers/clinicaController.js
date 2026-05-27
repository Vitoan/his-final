const { Ala, Habitacion, Cama, Internacion, Paciente, Evolucion, SignosVitales } = require('../models');

// 1. Cargar el Mapa de Camas (Dashboard)
const dashboard = async (req, res) => {
    try {
        // Buscamos todas las Alas con toda su estructura anidada
        const alas = await Ala.findAll({
            include: [
                {
                    model: Habitacion,
                    include: [
                        {
                            model: Cama,
                            include: [
                                {
                                    model: Internacion,
                                    where: { estado: 'Activa' }, // Solo internaciones en curso
                                    required: false, // Si la cama está libre (no tiene internación activa), igual la trae
                                    include: [{ model: Paciente }]
                                }
                            ]
                        }
                    ]
                }
            ],
            // Ordenamos alfabéticamente el Ala, luego por número de habitación y número de cama
            order: [
                ['nombre', 'ASC'],
                [Habitacion, 'numero', 'ASC'],
                [Habitacion, Cama, 'numero_cama', 'ASC']
            ]
        });

        // Enviamos la variable 'alas' a tu vista index.pug
        res.render('index', { alas }); 

    } catch (error) {
        console.error("Error cargando el dashboard:", error);
        res.render('index', { error: 'Error interno al cargar el mapa de camas.', alas: [] });
    }
};

// 2. Ver Historial Completo (Lo usaremos más adelante para ver el detalle de la internación)
const verHistorialCompleto = async (req, res) => {
    try {
        const { idInternacion } = req.params;
        
        const internacion = await Internacion.findByPk(idInternacion, {
            include: [
                { model: Paciente },
                { model: Cama, include: [{ model: Habitacion }] },
                { model: Evolucion, include: ['Autor'] },
                { model: SignosVitales, include: ['Enfermero'] }
            ]
        });

        if (!internacion) {
            return res.redirect('/clinica/dashboard'); 
        }

        // Construir un timeline cronológico combinado
        const timeline = [];

        if (internacion.Evolucions) {
            internacion.Evolucions.forEach(e => {
                timeline.push({
                    id: e.id,
                    tipoItem: 'Evolucion',
                    tipo: e.tipo, // 'Medico' o 'Enfermeria'
                    nota: e.nota,
                    signos_vitales: e.signos_vitales,
                    createdAt: e.createdAt,
                    Autor: e.Autor
                });
            });
        }

        if (internacion.SignosVitales) {
            internacion.SignosVitales.forEach(sv => {
                timeline.push({
                    id: sv.id,
                    tipoItem: 'SignosVitales',
                    tipo: 'Enfermeria',
                    nota: sv.observaciones,
                    presion_arterial: sv.presion_arterial,
                    frecuencia_cardiaca: sv.frecuencia_cardiaca,
                    temperatura: sv.temperatura,
                    createdAt: sv.createdAt,
                    Autor: sv.Enfermero
                });
            });
        }

        // Ordenar por fecha de creación descendente (los más recientes primero)
        timeline.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.render('clinical/detalle', { internacion, timeline });
    } catch (error) {
        console.error("Error al cargar el historial:", error);
        res.redirect('/clinica/dashboard');
    }
};

const historialGeneralPaciente = async (req, res) => {
    try {
        const { idPaciente } = req.params;
        
        // Buscamos al paciente y TODAS sus internaciones históricas
        const paciente = await Paciente.findByPk(idPaciente, {
            include: [{
                model: Internacion,
                include: [
                    { model: Cama, include: [Habitacion] }
                ],
                order: [['fecha_ingreso', 'DESC']] // Las más nuevas primero
            }]
        });

        if (!paciente) return res.redirect('/habitaciones');

        res.render('clinical/historial_general', { paciente });
    } catch (error) {
        console.error("Error al cargar historial general:", error);
        res.redirect('/habitaciones');
    }
};

module.exports = {
    dashboard,
    verHistorialCompleto,
    historialGeneralPaciente
};