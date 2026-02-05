const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Visita = sequelize.define('Visita', {
  motivo: {
    type: DataTypes.STRING, // Ej: "Consulta Traumatología", "Dolor de pecho", "Retirar análisis"
    allowNull: false
  },
  prioridad: {
    type: DataTypes.ENUM('Baja', 'Media', 'Alta/Emergencia'),
    defaultValue: 'Baja'
  },
  estado: {
    type: DataTypes.ENUM('Esperando', 'En Atención', 'Finalizado', 'Derivado a Internación'),
    defaultValue: 'Esperando'
  },
  tipo_ingreso: {
    type: DataTypes.STRING // "Turno Programado" o "Guardia/Demanda Espontánea"
  }
}, {
  tableName: 'visitas',
  timestamps: true
});

module.exports = Visita;