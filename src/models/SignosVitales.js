const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SignosVitales = sequelize.define('SignosVitales', {
    presion_arterial: { 
        type: DataTypes.STRING, // Ej: "120/80"
        allowNull: true 
    },
    frecuencia_cardiaca: { 
        type: DataTypes.INTEGER, // Latidos por minuto
        allowNull: true 
    },
    frecuencia_respiratoria: { 
        type: DataTypes.INTEGER, // Respiraciones por minuto
        allowNull: true 
    },
    temperatura: { 
        type: DataTypes.DECIMAL(4, 1), // Ej: 36.5
        allowNull: true 
    },
    saturacion_oxigeno: { 
        type: DataTypes.INTEGER, // Porcentaje, Ej: 98
        allowNull: true 
    },
    observaciones: { 
        type: DataTypes.TEXT, // Para notas rápidas del enfermero
        allowNull: true
    }
}, { 
    tableName: 'signos_vitales',
    timestamps: true // Esto guardará automáticamente la hora exacta (createdAt) de la medición
});

module.exports = SignosVitales;