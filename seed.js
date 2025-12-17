// Cargar variables de entorno primero
require('dotenv').config();

console.log("1. Iniciando script de semillas...");
console.log(`   -> Conectando a BD: ${process.env.DB_NAME} en ${process.env.DB_HOST}`);

// Importar modelos
try {
    var { sequelize, Usuario, Paciente, Habitacion, Cama, Internacion, Evolucion } = require('./src/models');
    console.log("2. Modelos importados correctamente.");
} catch (err) {
    console.error("❌ Error importando modelos:", err);
    process.exit(1);
}

const bcrypt = require('bcryptjs');

async function seed() {
    try {
        console.log("3. Intentando autenticar conexión...");
        await sequelize.authenticate();
        console.log("   -> Conexión establecida con éxito.");

        console.log("4. Sincronizando tablas (FORCE: TRUE)... esto borrará los datos viejos.");
        await sequelize.sync({ force: true });
        console.log("   -> Tablas recreadas.");

        console.log("5. Creando Usuarios...");
        const passwordHash = await bcrypt.hash('123456', 10);
        
        const medico = await Usuario.create({ nombre: 'Dr. Gregory House', email: 'medico@his.com', password: passwordHash, rol: 'Medico' });
        const enfermera = await Usuario.create({ nombre: 'Enf. Carla Turk', email: 'enfermera@his.com', password: passwordHash, rol: 'Enfermeria' });
        const admin = await Usuario.create({ nombre: 'Director', email: 'admin@his.com', password: passwordHash, rol: 'Admin' });
        
        console.log("6. Creando Habitaciones y Camas...");
        const hab101 = await Habitacion.create({ numero: '101', tipo: 'Individual' });
        const cama1 = await Cama.create({ numero_cama: 101, estado: 'Ocupada', habitacion_id: hab101.id });

        console.log("7. Creando Paciente e Internación...");
        const paciente = await Paciente.create({ nombre: 'Lionel', apellido: 'Messi', dni: '10101010', fecha_nacimiento: '1987-06-24', sexo: 'M', obra_social: 'AFA' });
        
        const internacion = await Internacion.create({
            paciente_id: paciente.id,
            cama_id: cama1.id,
            motivo: 'Dolor muscular',
            estado: 'Activa'
        });

        console.log("8. Creando Evolución Médica...");
        await Evolucion.create({
            internacion_id: internacion.id,
            tipo: 'Medico',
            nota: 'Paciente refiere dolor leve.',
            autor_id: medico.id
        });

        console.log("✅ ¡SEED FINALIZADO EXITOSAMENTE!");
        process.exit(0);

    } catch (error) {
        console.error('❌ ERROR FATAL DURANTE EL SEED:', error);
        // Imprimir detalle si es error de conexión
        if (error.original) {
            console.error('   -> Detalle SQL:', error.original.sqlMessage);
        }
        process.exit(1);
    }
}

// Ejecutar
seed();