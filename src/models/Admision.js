const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admision = sequelize.define('Admision', {
    tipo: {
        type: DataTypes.ENUM('Programada', 'Derivacion', 'Guardia', 'Emergencia'),
        allowNull: false,
        defaultValue: 'Programada'
    },
    estado: {
        type: DataTypes.ENUM('Pendiente', 'Activa', 'Cancelada', 'Rechazada'),
        defaultValue: 'Pendiente'
    },
    motivo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    motivo_cancelacion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_admision: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_cancelacion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    paciente_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'admisiones',
    timestamps: true
});

module.exports = Admision;