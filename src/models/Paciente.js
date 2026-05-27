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
        allowNull: true 
    },
    es_nn: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    },
    // --- NUEVOS CAMPOS CLÍNICOS Y DE AUDITORÍA ---
    alergias: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    antecedentes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    medicamentos_actuales: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    contacto_emergencia_nombre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contacto_emergencia_telefono: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { 
    tableName: 'pacientes', 
    timestamps: true 
});

module.exports = Paciente;