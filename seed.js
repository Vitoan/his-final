const { sequelize, Ala, Habitacion, Cama } = require('./src/models');

async function poblarHospital() {
    try {
        console.log("⏳ Conectando a la base de datos...");
        
        // Sincronizamos por las dudas
        await sequelize.sync({ alter: true });

        // 1. Creamos las Alas
        console.log("🏗️ Construyendo Alas...");
        const guardia = await Ala.create({ nombre: 'Guardia y Emergencias', descripcion: 'Atención rápida y Shockroom' });
        const terapia = await Ala.create({ nombre: 'Terapia Intensiva (UTI)', descripcion: 'Cuidados críticos' });
        const salaComun = await Ala.create({ nombre: 'Internación General', descripcion: 'Recuperación y observación' });

        // 2. Creamos las Habitaciones
        console.log("🚪 Construyendo Habitaciones...");
        const habShock = await Habitacion.create({ numero: 'SHOCK-1', tipo: 'Shockroom', ala_id: guardia.id });
        const habUti = await Habitacion.create({ numero: 'UTI-A', tipo: 'Individual', ala_id: terapia.id });
        const habComun1 = await Habitacion.create({ numero: '101', tipo: 'Compartida', ala_id: salaComun.id });
        const habComun2 = await Habitacion.create({ numero: '102', tipo: 'Compartida', ala_id: salaComun.id });

        // 3. Instalamos las Camas
        console.log("🛏️ Instalando Camas...");
        // Camas en Guardia
        await Cama.create({ numero_cama: 1, estado: 'Disponible', habitacion_id: habShock.id });
        await Cama.create({ numero_cama: 2, estado: 'Limpieza', habitacion_id: habShock.id }); // Una sucia para probar
        
        // Camas en UTI
        await Cama.create({ numero_cama: 3, estado: 'Disponible', habitacion_id: habUti.id });
        
        // Camas en Internación General
        await Cama.create({ numero_cama: 4, estado: 'Disponible', habitacion_id: habComun1.id });
        await Cama.create({ numero_cama: 5, estado: 'Disponible', habitacion_id: habComun1.id });
        await Cama.create({ numero_cama: 6, estado: 'Disponible', habitacion_id: habComun2.id });

        console.log("✅ ¡Hospital poblado con éxito! Ya puedes ver el mapa.");
        process.exit(0); // Cerramos el script
    } catch (error) {
        console.error("❌ Error al poblar la base de datos:", error);
        process.exit(1);
    }
}

poblarHospital();