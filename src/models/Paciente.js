const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paciente = sequelize.define('Paciente', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    apellido: { type: DataTypes.STRING, allowNull: false },
    dni: { type: DataTypes.STRING, unique: true },
    fecha_nacimiento: { type: DataTypes.DATEONLY },
    sexo: { type: DataTypes.ENUM('M', 'F', 'X') },
    obra_social: { type: DataTypes.STRING }
}, { timestamps: true });

module.exports = Paciente;