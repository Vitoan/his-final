const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Internacion = sequelize.define('Internacion', {
    motivo: { type: DataTypes.TEXT },
    estado: { type: DataTypes.ENUM('Activa', 'Alta', 'Cancelada'), defaultValue: 'Activa' },
    fecha_ingreso: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fecha_egreso: { type: DataTypes.DATE }
}, { timestamps: true });

module.exports = Internacion;