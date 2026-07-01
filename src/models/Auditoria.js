const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Auditoria = sequelize.define('Auditoria', {
    accion: { type: DataTypes.STRING, allowNull: false },
    detalles: { type: DataTypes.TEXT },
    usuario_id: { type: DataTypes.INTEGER },
    ip: { type: DataTypes.STRING }
}, {
    tableName: 'auditoria',
    timestamps: true
});

module.exports = Auditoria;
