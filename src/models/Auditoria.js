const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Auditoria = sequelize.define('Auditoria', {
    accion: { type: DataTypes.STRING, allowNull: false }, // Ej: "Asignó cama", "Dio de alta"
    detalles: { type: DataTypes.TEXT }, // JSON o texto con qué cambió
    usuario_id: { type: DataTypes.INTEGER }, // Quién lo hizo
    ip: { type: DataTypes.STRING }
});

module.exports = Auditoria;