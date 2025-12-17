const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cama = sequelize.define('Cama', {
    numero_cama: { type: DataTypes.INTEGER },
    estado: { type: DataTypes.ENUM('Disponible', 'Ocupada', 'Mantenimiento'), defaultValue: 'Disponible' }
}, { timestamps: false });

module.exports = Cama;