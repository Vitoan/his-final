const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evolucion = sequelize.define('Evolucion', {
    tipo: { type: DataTypes.ENUM('Medico', 'Enfermeria'), allowNull: false },
    nota: { type: DataTypes.TEXT, allowNull: false }, // Diagnóstico, tratamiento o signos vitales
    signos_vitales: { type: DataTypes.JSON }, // Para guardar {presion: "120/80", temp: 36}
    autor_id: { type: DataTypes.INTEGER } // ID del médico/enfermero
});

module.exports = Evolucion;