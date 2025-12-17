const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evolucion = sequelize.define('Evolucion', {
    tipo: { type: DataTypes.ENUM('Medico', 'Enfermeria'), allowNull: false },
    nota: { type: DataTypes.TEXT, allowNull: false }, 
    signos_vitales: { type: DataTypes.JSON }, // Ej: { "presion": "120/80", "temp": 36.5 }
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { timestamps: true });

module.exports = Evolucion;