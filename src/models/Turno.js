module.exports = (sequelize, DataTypes) => {
    const Turno = sequelize.define('Turno', {
        fecha: { 
            type: DataTypes.DATEONLY, 
            allowNull: false 
        },
        hora: { 
            type: DataTypes.TIME, 
            allowNull: false 
        },
        especialidad: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Medicina General'
        },
        motivo: { 
            type: DataTypes.STRING, 
            allowNull: true 
        },
        estado: { 
            type: DataTypes.ENUM('Programado', 'Asistió', 'Cancelado'), 
            defaultValue: 'Programado' 
        }
    });

    Turno.associate = function(models) {
        // Un turno pertenece a un paciente
        Turno.belongsTo(models.Paciente, { foreignKey: 'paciente_id' });
        
        // Un turno se le asigna a un Médico (que está en tu tabla de Usuarios)
        Turno.belongsTo(models.Usuario, { as: 'Medico', foreignKey: 'medico_id' });
    };

    return Turno;
};