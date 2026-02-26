const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Internacion = sequelize.define('Internacion', {
    origen: { 
        type: DataTypes.ENUM('Guardia', 'Consultorio Externo', 'Derivacion'), 
        defaultValue: 'Guardia' 
    },
    motivo: { type: DataTypes.TEXT },
    prioridad_triage: { 
        type: DataTypes.ENUM('Verde', 'Amarillo', 'Rojo'), 
        defaultValue: 'Verde' 
    },
    estado: { 
        type: DataTypes.ENUM('Activa', 'Alta_Medica', 'Traslado', 'Defuncion', 'Cancelada'), 
        defaultValue: 'Activa' 
    },
    resumen_epicrisis: { 
        type: DataTypes.TEXT 
    },
    fecha_ingreso: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fecha_egreso: { type: DataTypes.DATE }
}, { 
    tableName: 'internaciones',
    timestamps: true,
    // --- MAGIA AUTOMÁTICA (HOOKS) ---
    hooks: {
        // Se ejecuta DESPUÉS de guardar una nueva internación
        afterCreate: async (internacion, options) => {
            if (internacion.cama_id) {
                // Si le asignaron una cama, la marcamos como Ocupada
                await sequelize.models.Cama.update(
                    { estado: 'Ocupada' },
                    { where: { id: internacion.cama_id }, transaction: options.transaction }
                );
            }
        },
        // Se ejecuta DESPUÉS de actualizar una internación (ej. darle el alta)
        afterUpdate: async (internacion, options) => {
            const estadosAlta = ['Alta_Medica', 'Traslado', 'Defuncion'];
            
            // Si el estado cambió a uno de alta, y tiene una cama...
            if (estadosAlta.includes(internacion.estado) && internacion.cama_id) {
                // Ponemos la cama en Limpieza para maestranza
                await sequelize.models.Cama.update(
                    { estado: 'Limpieza' },
                    { where: { id: internacion.cama_id }, transaction: options.transaction }
                );
            }
        }
    }
});

module.exports = Internacion;