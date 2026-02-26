const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paciente = sequelize.define('Paciente', {
    nombre: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    apellido: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    dni: { 
        type: DataTypes.STRING, 
        unique: true,
        allowNull: false 
    },
    fecha_nacimiento: { 
        type: DataTypes.DATEONLY 
    },
    sexo: { 
        type: DataTypes.ENUM('M', 'F', 'X'),
        defaultValue: 'X'
    },
    obra_social: { 
        type: DataTypes.STRING 
    },
    // --- CAMPOS NUEVOS QUE FALTABAN ---
    numero_afiliado: {
        type: DataTypes.STRING
    },
    direccion: {
        type: DataTypes.STRING,
        defaultValue: 'No especificada'
    },
    telefono: {
        type: DataTypes.STRING,
        defaultValue: 'No especificado'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true // Valida que sea un email real
        }
    }
}, { 
    tableName: 'pacientes', 
    timestamps: true 
});

module.exports = Paciente;