const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Habitacion = sequelize.define('Habitacion', {
    numero: { type: DataTypes.STRING, allowNull: false },
    tipo: { type: DataTypes.ENUM('Individual', 'Compartida'), defaultValue: 'Individual' }
}, { timestamps: false });

module.exports = Habitacion;