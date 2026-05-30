const { 
    sequelize, 
    Ala, 
    Habitacion, 
    Cama, 
    Usuario, 
    Paciente, 
    Internacion, 
    Evolucion, 
    SignosVitales, 
    Indicacion, 
    AdministracionMedicamento, 
    Visita, 
    Turno, 
    Estudio,
    Auditoria
} = require('./src/models');
const bcrypt = require('bcryptjs');

async function poblarHospitalCompleto() {
    try {
        console.log("⏳ Conectando a la base de datos y limpiando tablas existentes...");
        
        // Forzamos la recreación de las tablas para garantizar un entorno limpio
        await sequelize.sync({ force: true });
        console.log("🗑️ Tablas limpiadas e inicializadas con éxito.");

        // 1. Encriptar contraseña común para desarrollo ('123456')
        console.log("🔑 Generando contraseñas seguras para los usuarios...");
        const passwordHash = await bcrypt.hash('123456', 10);

        // 2. Crear Usuarios del Personal del Hospital
        console.log("👥 Creando usuarios del personal médico y administrativo...");
        const admin = await Usuario.create({
            nombre: 'Administrador General',
            email: 'admin@his.com',
            password: passwordHash,
            rol: 'Admin'
        });

        const medico1 = await Usuario.create({
            nombre: 'Gregory House',
            email: 'medico@his.com',
            password: passwordHash,
            rol: 'Medico'
        });

        const medico2 = await Usuario.create({
            nombre: 'Lisa Cuddy',
            email: 'cuddy@his.com',
            password: passwordHash,
            rol: 'Medico'
        });

        const enfermera1 = await Usuario.create({
            nombre: 'Joy Nurse',
            email: 'enfermera@his.com',
            password: passwordHash,
            rol: 'Enfermeria'
        });

        const admisionista = await Usuario.create({
            nombre: 'Recepción Mesa',
            email: 'admision@his.com',
            password: passwordHash,
            rol: 'Admision'
        });

        // 3. Crear Estructura Hospitalaria (Alas, Habitaciones, Camas)
        console.log("🏗️ Construyendo Alas y Especialidades...");
        const alaGuardia = await Ala.create({ nombre: 'Guardia y Emergencias', descripcion: 'Atención rápida, Shockroom y triaje' });
        const alaTerapia = await Ala.create({ nombre: 'Terapia Intensiva (UTI)', descripcion: 'Cuidados críticos y monitoreo continuo' });
        const alaComun = await Ala.create({ nombre: 'Internación General', descripcion: 'Recuperación clínica y observación general' });

        console.log("🚪 Instalando Habitaciones...");
        const habShock = await Habitacion.create({ numero: 'SHOCK-1', tipo: 'Shockroom', ala_id: alaGuardia.id });
        const habUti1 = await Habitacion.create({ numero: 'UTI-101', tipo: 'Individual', ala_id: alaTerapia.id });
        const habUti2 = await Habitacion.create({ numero: 'UTI-102', tipo: 'Individual', ala_id: alaTerapia.id });
        const habComun201 = await Habitacion.create({ numero: '201', tipo: 'Compartida', ala_id: alaComun.id });
        const habComun202 = await Habitacion.create({ numero: '202', tipo: 'Compartida', ala_id: alaComun.id });

        console.log("🛏️ Distribuyendo Camas por Habitación...");
        const camaShock1 = await Cama.create({ numero_cama: 10, estado: 'Disponible', habitacion_id: habShock.id });
        const camaShock2 = await Cama.create({ numero_cama: 11, estado: 'Disponible', habitacion_id: habShock.id });
        const camaTerapia1 = await Cama.create({ numero_cama: 101, estado: 'Disponible', habitacion_id: habUti1.id });
        const camaTerapia2 = await Cama.create({ numero_cama: 102, estado: 'Disponible', habitacion_id: habUti2.id });
        const camaComun201_1 = await Cama.create({ numero_cama: 2011, estado: 'Disponible', habitacion_id: habComun201.id });
        const camaComun201_2 = await Cama.create({ numero_cama: 2012, estado: 'Disponible', habitacion_id: habComun201.id });
        const camaComun202_1 = await Cama.create({ numero_cama: 2021, estado: 'Disponible', habitacion_id: habComun202.id });
        const camaComun202_2 = await Cama.create({ numero_cama: 2022, estado: 'Disponible', habitacion_id: habComun202.id });

        // 4. Crear Pacientes de Prueba con Datos Clínicos Completos
        console.log("📂 Cargando historial de pacientes en el padrón...");
        
        // Paciente 1: Hombre con Obra Social - Internado en Cama 2011 (Habitación 201)
        const paciente1 = await Paciente.create({
            nombre: 'Juan Carlos',
            apellido: 'Pérez',
            dni: '20123456',
            es_nn: false,
            fecha_nacimiento: '1975-04-12',
            sexo: 'M',
            obra_social: 'OSDE',
            numero_afiliado: '1-44552-3',
            direccion: 'Av. Colón 1234, Córdoba',
            telefono: '3514445555',
            email: 'juan.perez@email.com',
            alergias: 'Penicilina, Aspirina',
            antecedentes: 'Hipertensión Arterial, Ex-fumador',
            medicamentos_actuales: 'Enalapril 10mg diario',
            contacto_emergencia_nombre: 'María Pérez (Esposa)',
            contacto_emergencia_telefono: '3514445556'
        });

        // Paciente 2: Hombre Particular - Internado en Cama 2012 (Habitación 201 - compartiendo con Paciente 1)
        const paciente2 = await Paciente.create({
            nombre: 'Roberto',
            apellido: 'Benítez',
            dni: '18765432',
            es_nn: false,
            fecha_nacimiento: '1968-11-25',
            sexo: 'M',
            obra_social: 'Particular',
            numero_afiliado: null,
            direccion: 'La Rioja 720, Córdoba',
            telefono: '3513029182',
            email: 'roberto.benitez@email.com',
            alergias: 'Ninguna conocida',
            antecedentes: 'Dislipemia, Sedentarismo',
            medicamentos_actuales: 'Atorvastatina 10mg noche',
            contacto_emergencia_nombre: 'Lucía Benítez (Hija)',
            contacto_emergencia_telefono: '3519876543'
        });

        // Paciente 3: Mujer con Obra Social - Internada en Cama 2021 (Habitación 202)
        const paciente3 = await Paciente.create({
            nombre: 'Ana María',
            apellido: 'Gómez',
            dni: '28987654',
            es_nn: false,
            fecha_nacimiento: '1982-08-20',
            sexo: 'F',
            obra_social: 'Swiss Medical',
            numero_afiliado: 'SM-9988-1',
            direccion: 'Chacabuco 450, Córdoba',
            telefono: '3516112233',
            email: 'ana.gomez@email.com',
            alergias: 'Sulfas',
            antecedentes: 'Diabetes Gestacional en 2018',
            medicamentos_actuales: 'Metformina 850mg con cena',
            contacto_emergencia_nombre: 'Roberto Gómez (Padre)',
            contacto_emergencia_telefono: '3516990099'
        });

        // Paciente 4: Mujer con Obra Social - Internada en Cama 2022 (Habitación 202 - compartiendo con Paciente 3)
        const paciente4 = await Paciente.create({
            nombre: 'Clara Luz',
            apellido: 'Rodríguez',
            dni: '32111444',
            es_nn: false,
            fecha_nacimiento: '1986-06-15',
            sexo: 'F',
            obra_social: 'APROSS',
            numero_afiliado: 'AP-55441-01',
            direccion: 'Duarte Quirós 1540, Córdoba',
            telefono: '3512229988',
            email: 'clara.rodriguez@email.com',
            alergias: 'Aspirina (Ácido Acetilsalicílico)',
            antecedentes: 'Hipotiroidismo',
            medicamentos_actuales: 'Levotiroxina 75mcg ayunas',
            contacto_emergencia_nombre: 'Santiago Rodríguez (Hermano)',
            contacto_emergencia_telefono: '3515556677'
        });

        // Paciente 5: Paciente de Emergencia NN (DNI NULO - es_nn = true) - Internado en Cama 101 (UTI-101)
        const pacienteNN = await Paciente.create({
            nombre: 'Emergencia',
            apellido: 'NN-Triage-Rojo',
            dni: null,
            es_nn: true,
            sexo: 'X',
            obra_social: 'Ninguna',
            direccion: 'Traído por ambulancia 107',
            telefono: 'No disponible',
            alergias: 'Desconocido',
            antecedentes: 'Paciente inconsciente traído de la vía pública por traumatismo craneoencefálico y politraumatismo'
        });

        // Paciente 6: Hombre de la tercera edad - Internado en Cama 102 (UTI-102)
        const paciente6 = await Paciente.create({
            nombre: 'Carlos',
            apellido: 'D\'Alessandro',
            dni: '12345678',
            es_nn: false,
            fecha_nacimiento: '1953-09-02',
            sexo: 'M',
            obra_social: 'PAMI',
            numero_afiliado: 'PA-88992211',
            direccion: 'Av. Patria 480, Córdoba',
            telefono: '3517778888',
            email: 'carlos.dalessandro@email.com',
            alergias: 'Ninguna conocida',
            antecedentes: 'Infarto agudo de miocardio en 2021, Insuficiencia Cardíaca Crónica',
            medicamentos_actuales: 'Furosemida 40mg mañana, Carvedilol 6.25mg cada 12 hs, Espironolactona 25mg almuerzo',
            contacto_emergencia_nombre: 'Mariano D\'Alessandro (Hijo)',
            contacto_emergencia_telefono: '3513334444'
        });

        // Paciente 7: Mujer joven - Internada en Cama 10 (Shockroom-1)
        const paciente7 = await Paciente.create({
            nombre: 'Valentina',
            apellido: 'Herrera',
            dni: '41222333',
            es_nn: false,
            fecha_nacimiento: '1998-03-10',
            sexo: 'F',
            obra_social: 'Galeno',
            numero_afiliado: 'GA-112233-4',
            direccion: 'Bv. San Juan 800, Córdoba',
            telefono: '3518889900',
            email: 'valentina.herrera@email.com',
            alergias: 'Polen, Ácaros, Penicilina',
            antecedentes: 'Asma bronquial severa diagnosticada en la infancia',
            medicamentos_actuales: 'Budesonida + Formoterol inhalador 2 veces al día',
            contacto_emergencia_nombre: 'Laura Herrera (Madre)',
            contacto_emergencia_telefono: '3512223344'
        });

        // Paciente 8: Paciente dado de alta hoy - Estuvo en Cama 11 (Shockroom) - Libera la cama para Limpieza
        const paciente8 = await Paciente.create({
            nombre: 'Lucas',
            apellido: 'Romero',
            dni: '35888999',
            es_nn: false,
            fecha_nacimiento: '1991-07-22',
            sexo: 'M',
            obra_social: 'OSECAC',
            numero_afiliado: 'OS-998822',
            direccion: 'Catamarca 120, Córdoba',
            telefono: '3515551122',
            email: 'lucas.romero@email.com',
            alergias: 'Picadura de avispa',
            antecedentes: 'Ninguno de relevancia',
            medicamentos_actuales: 'Ninguno',
            contacto_emergencia_nombre: 'Patricia Romero (Hermana)',
            contacto_emergencia_telefono: '3516667788'
        });

        // Pacientes 9, 10, 11: Pacientes en guardia / consultorio externos (Mesa de Entrada)
        const paciente9 = await Paciente.create({
            nombre: 'Mariano',
            apellido: 'López',
            dni: '38111222',
            es_nn: false,
            fecha_nacimiento: '1995-11-03',
            sexo: 'M',
            obra_social: 'Particular',
            numero_afiliado: null,
            direccion: 'Duarte Quirós 980, Córdoba',
            telefono: '3515887766',
            email: 'mariano.lopez@email.com',
            alergias: 'Polvo',
            antecedentes: 'Asma leve en la infancia',
            medicamentos_actuales: 'Salbutamol SOS',
            contacto_emergencia_nombre: 'Carmen López (Madre)',
            contacto_emergencia_telefono: '3515887700'
        });

        const paciente10 = await Paciente.create({
            nombre: 'Elena',
            apellido: 'Peralta',
            dni: '34567890',
            es_nn: false,
            fecha_nacimiento: '1989-12-14',
            sexo: 'F',
            obra_social: 'OSDE',
            numero_afiliado: '2-120033-0',
            direccion: 'Rondeau 340, Córdoba',
            telefono: '3517112233',
            email: 'elena.peralta@email.com',
            alergias: 'Ninguna conocida',
            antecedentes: 'Hipertensión crónica controlada',
            medicamentos_actuales: 'Losartán 50mg diario',
            contacto_emergencia_nombre: 'Juan Peralta (Padre)',
            contacto_emergencia_telefono: '3519881122'
        });

        const paciente11 = await Paciente.create({
            nombre: 'Mario',
            apellido: 'Domínguez',
            dni: '14222333',
            es_nn: false,
            fecha_nacimiento: '1961-05-30',
            sexo: 'M',
            obra_social: 'APROSS',
            numero_afiliado: 'AP-110022-00',
            direccion: 'Castro Barros 1100, Córdoba',
            telefono: '3516664422',
            email: 'mario.dominguez@email.com',
            alergias: 'Dipirona',
            antecedentes: 'Colecistectomía en 2015',
            medicamentos_actuales: 'Aspirina 100mg almuerzo',
            contacto_emergencia_nombre: 'Sonia Domínguez (Esposa)',
            contacto_emergencia_telefono: '3518882211'
        });

        // 5. Crear Cuentas de Portal para los Pacientes identificados
        console.log("💻 Creando accesos de Portal de Salud para los pacientes...");
        const pacientesIdentificados = [paciente1, paciente2, paciente3, paciente4, paciente6, paciente7, paciente8, paciente9, paciente10, paciente11];
        for (const p of pacientesIdentificados) {
            await Usuario.create({
                nombre: `${p.nombre} ${p.apellido}`,
                email: p.email,
                password: passwordHash,
                rol: 'Paciente',
                paciente_id: p.id
            });
        }

        // 6. Crear Internaciones Activas y simular Flujo Clínico
        console.log("🏥 Asignando internaciones y simulando flujo clínico...");

        // Internación 1: Paciente 1 (Juan Carlos) en Cama Comun 201_1 (Habitación 201 - Compartida M)
        const int1 = await Internacion.create({
            paciente_id: paciente1.id,
            cama_id: camaComun201_1.id,
            origen: 'Guardia',
            prioridad_triage: 'Amarillo',
            motivo: 'Dolor precordial típico opresivo de 2 horas de evolución asociado a diaforesis.',
            estado: 'Activa',
            fecha_ingreso: new Date(new Date().setDate(new Date().getDate() - 2)) // Ingresó hace 2 días
        });

        // Internación 2: Paciente 2 (Roberto) en Cama Comun 201_2 (Habitación 201 - Compartida M)
        const int2 = await Internacion.create({
            paciente_id: paciente2.id,
            cama_id: camaComun201_2.id,
            origen: 'Consultorio Externo',
            prioridad_triage: 'Amarillo',
            motivo: 'Postoperatorio de hernioplastía inguinal izquierda por hernia incarcerada.',
            estado: 'Activa',
            fecha_ingreso: new Date(new Date().setDate(new Date().getDate() - 1)) // Ingresó hace 1 día
        });

        // Internación 3: Paciente 3 (Ana María) en Cama Comun 202_1 (Habitación 202 - Compartida F)
        const int3 = await Internacion.create({
            paciente_id: paciente3.id,
            cama_id: camaComun202_1.id,
            origen: 'Guardia',
            prioridad_triage: 'Amarillo',
            motivo: 'Neumonía lobar derecha con disnea y desaturación leve al aire ambiente.',
            estado: 'Activa',
            fecha_ingreso: new Date(new Date().setDate(new Date().getDate() - 3)) // Ingresó hace 3 días
        });

        // Internación 4: Paciente 4 (Clara Luz) en Cama Comun 202_2 (Habitación 202 - Compartida F)
        const int4 = await Internacion.create({
            paciente_id: paciente4.id,
            cama_id: camaComun202_2.id,
            origen: 'Guardia',
            prioridad_triage: 'Verde',
            motivo: 'Gastroenteritis aguda severa con deshidratación clínica moderada e intolerancia total de la vía oral.',
            estado: 'Activa',
            fecha_ingreso: new Date(new Date().setDate(new Date().getDate() - 1)) // Ingresó hace 1 día
        });

        // Internación 5: Paciente NN en Cama Terapia 101 (Habitación UTI-101 - Individual)
        const int5 = await Internacion.create({
            paciente_id: pacienteNN.id,
            cama_id: camaTerapia1.id,
            origen: 'Guardia',
            prioridad_triage: 'Rojo',
            motivo: 'Paciente traído de la vía pública inconsciente tras colisión en moto. Traumatismo craneoencefálico grave y fractura expuesta de fémur izquierdo.',
            estado: 'Activa',
            fecha_ingreso: new Date()
        });

        // Internación 6: Paciente 6 (Carlos D'Alessandro) en Cama Terapia 102 (Habitación UTI-102 - Individual)
        const int6 = await Internacion.create({
            paciente_id: paciente6.id,
            cama_id: camaTerapia2.id,
            origen: 'Derivacion',
            prioridad_triage: 'Rojo',
            motivo: 'Insuficiencia cardíaca descompensada refractaria a tratamiento oral con disnea de reposo y ortopnea.',
            estado: 'Activa',
            fecha_ingreso: new Date(new Date().setDate(new Date().getDate() - 1))
        });

        // Internación 7: Paciente 7 (Valentina Herrera) en Cama Shockroom 10 (Habitación SHOCK-1)
        const int7 = await Internacion.create({
            paciente_id: paciente7.id,
            cama_id: camaShock1.id,
            origen: 'Guardia',
            prioridad_triage: 'Rojo',
            motivo: 'Status asmático. Crisis asmática severa refractaria a nebulizaciones y corticoides orales en domicilio.',
            estado: 'Activa',
            fecha_ingreso: new Date()
        });

        // Internación 8: Lucas Romero en Cama Shockroom 11 (Para simular el estado de Limpieza en la cama)
        const intDischarged = await Internacion.create({
            paciente_id: paciente8.id,
            cama_id: camaShock2.id,
            origen: 'Guardia',
            prioridad_triage: 'Amarillo',
            motivo: 'Shock anafiláctico secundario a picadura de insecto (avispa).',
            estado: 'Activa',
            fecha_ingreso: new Date(new Date().setHours(new Date().getHours() - 10)) // Ingresó hace 10 horas
        });

        // Hacemos el alta para disparar el hook y dejar la cama 11 en Limpieza
        console.log("🧹 Simulando alta médica para dejar la Cama 11 en estado 'Limpieza'...");
        await intDischarged.update({
            estado: 'Alta_Medica',
            resumen_epicrisis: 'Paciente responde favorablemente a dosis de Adrenalina IM y corticoides endovenosos en shockroom. Remisión total del angioedema y sibilancias. Se otorga alta con pautas de alarma estrictas y derivación a alergista.',
            recetas: 'Deltisona B 40mg diario por 3 días. Loratadina 10mg noche por 7 días. Inyector automático de adrenalina recetado para portación.',
            recomendaciones: 'Evitar áreas con insectos. Consulta ambulatoria con alergología.',
            fecha_egreso: new Date()
        });

        // 7. Cargar Controles Clínicos Estructurados (Signos Vitales y Evoluciones)
        console.log("📈 Población de la tabla estructurada signos_vitales...");

        // HISTORIAL DE PACIENTE 1 (Juan Carlos Pérez)
        await SignosVitales.create({
            presion_arterial: '150/95',
            frecuencia_cardiaca: 98,
            frecuencia_respiratoria: 20,
            temperatura: 36.6,
            saturacion_oxigeno: 94,
            observaciones: 'Ingresa con dolor de pecho moderado. Se coloca oxígeno por cánula.',
            internacion_id: int1.id,
            enfermero_id: enfermera1.id,
            createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
        });
        await Evolucion.create({
            tipo: 'Medico',
            nota: 'Paciente ingresa por dolor de pecho típico. ECG inicial con cambios inespecíficos. Troponina basal pedida. Se inicia protocolo de dolor de pecho.',
            internacion_id: int1.id,
            autor_id: medico1.id,
            createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
        });

        await SignosVitales.create({
            presion_arterial: '135/85',
            frecuencia_cardiaca: 82,
            frecuencia_respiratoria: 18,
            temperatura: 36.8,
            saturacion_oxigeno: 97,
            observaciones: 'Paciente estable. Segundo juego de enzimas cardíacas dio negativo.',
            internacion_id: int1.id,
            enfermero_id: enfermera1.id,
            createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
        });
        await Evolucion.create({
            tipo: 'Medico',
            nota: 'Paciente evoluciona favorablemente. Sin reaparición del dolor. Segundo set de enzimas cardíacas negativo. ECG sin cambios dinámicos.',
            internacion_id: int1.id,
            autor_id: medico1.id,
            createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
        });

        await SignosVitales.create({
            presion_arterial: '120/80',
            frecuencia_cardiaca: 72,
            frecuencia_respiratoria: 16,
            temperatura: 36.2,
            saturacion_oxigeno: 99,
            observaciones: 'Paciente asintomático, descansó bien en la noche.',
            internacion_id: int1.id,
            enfermero_id: enfermera1.id
        });
        await Evolucion.create({
            tipo: 'Enfermeria',
            nota: 'Control de guardia mañana. Paciente refiere sentirse óptimo y sin dolor precordial. Tolera dieta general. Signos vitales estables.',
            internacion_id: int1.id,
            autor_id: enfermera1.id
        });

        // HISTORIAL DE PACIENTE 2 (Roberto Benítez)
        await SignosVitales.create({
            presion_arterial: '110/70',
            frecuencia_cardiaca: 85,
            frecuencia_respiratoria: 18,
            temperatura: 37.2,
            saturacion_oxigeno: 96,
            observaciones: 'Postoperatorio inmediato. Somnoliento por la anestesia pero reactivo.',
            internacion_id: int2.id,
            enfermero_id: enfermera1.id,
            createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
        });
        await Evolucion.create({
            tipo: 'Medico',
            nota: 'Postoperatorio de hernioplastía inguinal izquierda. Procedimiento sin incidentes. Control de apósito inguinal correcto, seco. Plan: Hidratación y analgesia.',
            internacion_id: int2.id,
            autor_id: medico2.id,
            createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
        });

        await SignosVitales.create({
            presion_arterial: '120/75',
            frecuencia_cardiaca: 78,
            frecuencia_respiratoria: 16,
            temperatura: 36.7,
            saturacion_oxigeno: 98,
            observaciones: 'Refiere dolor leve en zona de la herida quirúrgica al moverse.',
            internacion_id: int2.id,
            enfermero_id: enfermera1.id
        });
        await Evolucion.create({
            tipo: 'Enfermeria',
            nota: 'Paciente lúcido. Dolor controlado con analgésicos. Apósito inguinal limpio y seco. Ya inició deambulación asistida con buena tolerancia. Diuresis positiva.',
            internacion_id: int2.id,
            autor_id: enfermera1.id
        });

        // HISTORIAL DE PACIENTE 3 (Ana María Gómez)
        await SignosVitales.create({
            presion_arterial: '115/70',
            frecuencia_cardiaca: 104,
            frecuencia_respiratoria: 24,
            temperatura: 39.1,
            saturacion_oxigeno: 91,
            observaciones: 'Ingreso. Paciente con fiebre alta y disnea moderada. Requiere oxígeno a 2 l/min.',
            internacion_id: int3.id,
            enfermero_id: enfermera1.id,
            createdAt: new Date(new Date().setDate(new Date().getDate() - 3))
        });

        await SignosVitales.create({
            presion_arterial: '120/75',
            frecuencia_cardiaca: 88,
            frecuencia_respiratoria: 19,
            temperatura: 37.8,
            saturacion_oxigeno: 95,
            observaciones: 'Menos taquipneica, tolera decúbito. Sigue con oxígeno por cánula.',
            internacion_id: int3.id,
            enfermero_id: enfermera1.id,
            createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
        });

        await SignosVitales.create({
            presion_arterial: '118/78',
            frecuencia_cardiaca: 76,
            frecuencia_respiratoria: 17,
            temperatura: 36.5,
            saturacion_oxigeno: 97,
            observaciones: 'Afebril. Se retira cánula de oxígeno de prueba. Saturando bien al aire ambiente.',
            internacion_id: int3.id,
            enfermero_id: enfermera1.id
        });
        await Evolucion.create({
            tipo: 'Medico',
            nota: 'Tercer día de ceftriaxona. Favorable evolución clínica, ruidos pulmonares con marcada disminución de estertores. Se suspende aporte de oxígeno y se planifica paso a vía oral en 24 horas si continúa estable.',
            internacion_id: int3.id,
            autor_id: medico1.id
        });

        // HISTORIAL DE PACIENTE 4 (Clara Luz Rodríguez)
        await SignosVitales.create({
            presion_arterial: '95/60',
            frecuencia_cardiaca: 102,
            frecuencia_respiratoria: 19,
            temperatura: 37.4,
            saturacion_oxigeno: 98,
            observaciones: 'Ingresa con taquicardia secundaria a deshidratación. Mucosas secas. PHP a goteo rápido.',
            internacion_id: int4.id,
            enfermero_id: enfermera1.id,
            createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
        });

        await SignosVitales.create({
            presion_arterial: '110/70',
            frecuencia_cardiaca: 82,
            frecuencia_respiratoria: 16,
            temperatura: 36.6,
            saturacion_oxigeno: 99,
            observaciones: 'Recuperando hidratación. Tolera pequeños sorbos de té de manera fraccionada.',
            internacion_id: int4.id,
            enfermero_id: enfermera1.id
        });
        await Evolucion.create({
            tipo: 'Enfermeria',
            nota: 'Paciente refiere mejoría importante del malestar general y cese del dolor abdominal. Sin registrar emesis en las últimas 12 horas. Tolera líquidos vía oral. Infusión de suero a goteo de mantenimiento.',
            internacion_id: int4.id,
            autor_id: enfermera1.id
        });

        // HISTORIAL DE PACIENTE NN (Triage Rojo en UTI)
        await SignosVitales.create({
            presion_arterial: '90/50',
            frecuencia_cardiaca: 115,
            frecuencia_respiratoria: 12, // Acoplado a ventilador mecánico
            temperatura: 35.8,
            saturacion_oxigeno: 89,
            observaciones: 'Monitoreo en UTI. Paciente intubado con asistencia respiratoria. Inestabilidad hemodinámica leve.',
            internacion_id: int5.id,
            enfermero_id: enfermera1.id,
            createdAt: new Date(new Date().setHours(new Date().getHours() - 3))
        });

        await SignosVitales.create({
            presion_arterial: '105/65',
            frecuencia_cardiaca: 98,
            frecuencia_respiratoria: 14,
            temperatura: 36.3,
            saturacion_oxigeno: 95,
            observaciones: 'Se administran fluidos y se estabiliza TA. Parámetros de ARM ajustados.',
            internacion_id: int5.id,
            enfermero_id: enfermera1.id
        });
        await Evolucion.create({
            tipo: 'Medico',
            nota: 'UTI - Paciente NN bajo sedoanalgesia profunda en ARM. Rx de tórax muestra tubo endotraqueal bien posicionado. Hemoglobina inicial estable. Pendiente de resolución traumatológica de fractura de fémur una vez lograda estabilidad neurológica.',
            internacion_id: int5.id,
            autor_id: medico1.id
        });

        // HISTORIAL DE PACIENTE 6 (Carlos D'Alessandro - UTI)
        await SignosVitales.create({
            presion_arterial: '170/105',
            frecuencia_cardiaca: 110,
            frecuencia_respiratoria: 28,
            temperatura: 36.5,
            saturacion_oxigeno: 88,
            observaciones: 'Ingresa disneico y cianótico. Trabajo respiratorio severo. Se coloca máscara con reservorio y se inicia bolo de furosemida.',
            internacion_id: int6.id,
            enfermero_id: enfermera1.id,
            createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
        });

        await SignosVitales.create({
            presion_arterial: '140/85',
            frecuencia_cardiaca: 92,
            frecuencia_respiratoria: 21,
            temperatura: 36.8,
            saturacion_oxigeno: 93,
            observaciones: 'Respuesta diurética abundante (1000cc). Disminuye disnea. Se tolera CPAP en UTI.',
            internacion_id: int6.id,
            enfermero_id: enfermera1.id,
            createdAt: new Date(new Date().setHours(new Date().getHours() - 12))
        });

        await SignosVitales.create({
            presion_arterial: '125/75',
            frecuencia_cardiaca: 80,
            frecuencia_respiratoria: 18,
            temperatura: 36.6,
            saturacion_oxigeno: 96,
            observaciones: 'Signos vitales estables. Paciente refiere gran alivio respiratorio.',
            internacion_id: int6.id,
            enfermero_id: enfermera1.id
        });
        await Evolucion.create({
            tipo: 'Medico',
            nota: 'Evolución en UTI por ICC. Balance de ingresos y egresos netamente negativo. Ruidos pulmonares con mejor entrada de aire bilateral, estertores basales mínimos. Nitroglicerina suspendida. Continúa control estricto.',
            internacion_id: int6.id,
            autor_id: medico2.id
        });

        // HISTORIAL DE PACIENTE 7 (Valentina Herrera - Shockroom)
        await SignosVitales.create({
            presion_arterial: '130/80',
            frecuencia_cardiaca: 118,
            frecuencia_respiratoria: 30,
            temperatura: 36.9,
            saturacion_oxigeno: 90,
            observaciones: 'Shockroom. Ingresa por crisis asmática severa. Tiraje intercostal marcado, sibilancias inspiratorias y espiratorias generalizadas.',
            internacion_id: int7.id,
            enfermero_id: enfermera1.id,
            createdAt: new Date(new Date().setHours(new Date().getHours() - 2))
        });

        await SignosVitales.create({
            presion_arterial: '122/75',
            frecuencia_cardiaca: 95,
            frecuencia_respiratoria: 22,
            temperatura: 36.7,
            saturacion_oxigeno: 94,
            observaciones: 'Refiere leve alivio tras sulfato de magnesio y nebulizaciones continuas con salbutamol.',
            internacion_id: int7.id,
            enfermero_id: enfermera1.id
        });
        await Evolucion.create({
            tipo: 'Medico',
            nota: 'Evaluación en Shockroom. Crisis asmática severa. Paciente responde lentamente al tratamiento de rescate. Se decide dejar bajo monitoreo continuo en Guardia durante las próximas horas para evaluar necesidad de pase a UTI o internación general.',
            internacion_id: int7.id,
            autor_id: medico1.id
        });

        // 8. Crear Indicaciones Médicas e Historial de Medicamentos
        console.log("💊 Prescribiendo indicaciones y registrando administración por enfermería...");
        
        // Indicaciones para Paciente 1 (Juan Carlos Pérez)
        const ind1_1 = await Indicacion.create({
            descripcion: 'Aspirina (Ácido Acetilsalicílico) Comprimidos',
            dosis: '100mg',
            frecuencia: 'Cada 24 hs (Oral)',
            estado: 'Activa',
            internacion_id: int1.id,
            medico_id: medico1.id
        });

        const ind1_2 = await Indicacion.create({
            descripcion: 'Enalapril Comprimidos',
            dosis: '10mg',
            frecuencia: 'Cada 12 hs (Oral)',
            estado: 'Activa',
            internacion_id: int1.id,
            medico_id: medico1.id
        });

        // Administraciones para Paciente 1
        await AdministracionMedicamento.create({
            dosis_aplicada: '100mg',
            observaciones: 'Administrada con el desayuno. Buena tolerancia oral.',
            indicacion_id: ind1_1.id,
            enfermero_id: enfermera1.id
        });
        await AdministracionMedicamento.create({
            dosis_aplicada: '10mg',
            observaciones: 'Administrada en ayunas.',
            indicacion_id: ind1_2.id,
            enfermero_id: enfermera1.id
        });

        // Indicaciones para Paciente 2 (Roberto Benítez)
        const ind2_1 = await Indicacion.create({
            descripcion: 'Ketorolac Ampollas',
            dosis: '30mg',
            frecuencia: 'Cada 8 hs (Intravenoso)',
            estado: 'Activa',
            internacion_id: int2.id,
            medico_id: medico2.id
        });

        const ind2_2 = await Indicacion.create({
            descripcion: 'Ranitidina Ampollas',
            dosis: '50mg',
            frecuencia: 'Cada 12 hs (Intravenoso)',
            estado: 'Activa',
            internacion_id: int2.id,
            medico_id: medico2.id
        });

        // Administraciones para Paciente 2
        await AdministracionMedicamento.create({
            dosis_aplicada: '30mg',
            observaciones: 'Administrado de forma lenta diluido en suero.',
            indicacion_id: ind2_1.id,
            enfermero_id: enfermera1.id
        });

        // Indicaciones para Paciente 3 (Ana María Gómez)
        const ind3_1 = await Indicacion.create({
            descripcion: 'Ceftriaxona Ampollas',
            dosis: '1g',
            frecuencia: 'Cada 12 hs (Intravenoso)',
            estado: 'Activa',
            internacion_id: int3.id,
            medico_id: medico1.id
        });

        const ind3_2 = await Indicacion.create({
            descripcion: 'Paracetamol Comprimidos',
            dosis: '1g',
            frecuencia: 'Condicional a temperatura mayor de 38°C',
            estado: 'Activa',
            internacion_id: int3.id,
            medico_id: medico1.id
        });

        // Administraciones para Paciente 3
        await AdministracionMedicamento.create({
            dosis_aplicada: '1g',
            observaciones: 'Antibiótico infundido en 30 minutos sin rash.',
            indicacion_id: ind3_1.id,
            enfermero_id: enfermera1.id
        });

        // Indicaciones para Paciente 4 (Clara Luz)
        const ind4_1 = await Indicacion.create({
            descripcion: 'Reliverán (Metoclopramida) Ampollas',
            dosis: '10mg',
            frecuencia: 'Cada 8 hs (Intravenoso)',
            estado: 'Activa',
            internacion_id: int4.id,
            medico_id: medico2.id
        });

        // Administraciones para Paciente 4
        await AdministracionMedicamento.create({
            dosis_aplicada: '10mg',
            observaciones: 'Administrado por catéter venoso periférico.',
            indicacion_id: ind4_1.id,
            enfermero_id: enfermera1.id
        });

        // Indicaciones para Paciente NN (UTI)
        const ind5_1 = await Indicacion.create({
            descripcion: 'Midazolam + Fentanilo (Bomba de Infusión)',
            dosis: '5mg/h fentanilo + 10mg/h midazolam',
            frecuencia: 'Infusión continua',
            estado: 'Activa',
            internacion_id: int5.id,
            medico_id: medico1.id
        });

        // Administraciones para Paciente NN
        await AdministracionMedicamento.create({
            dosis_aplicada: 'Completa',
            observaciones: 'Infusión en bomba activa a ritmo seteado.',
            indicacion_id: ind5_1.id,
            enfermero_id: enfermera1.id
        });

        // Indicaciones para Paciente 6 (Carlos D'Alessandro - UTI)
        const ind6_1 = await Indicacion.create({
            descripcion: 'Furosemida Ampollas',
            dosis: '20mg',
            frecuencia: 'Cada 8 hs (Intravenoso)',
            estado: 'Activa',
            internacion_id: int6.id,
            medico_id: medico2.id
        });

        // Administraciones para Paciente 6
        await AdministracionMedicamento.create({
            dosis_aplicada: '20mg',
            observaciones: 'Paciente orina abundantemente tras dosis.',
            indicacion_id: ind6_1.id,
            enfermero_id: enfermera1.id
        });

        // Indicaciones para Paciente 7 (Valentina Herrera - Shockroom)
        const ind7_1 = await Indicacion.create({
            descripcion: 'Metilprednisolona Ampollas',
            dosis: '40mg',
            frecuencia: 'Cada 6 hs (Intravenoso)',
            estado: 'Activa',
            internacion_id: int7.id,
            medico_id: medico1.id
        });

        // Administraciones para Paciente 7
        await AdministracionMedicamento.create({
            dosis_aplicada: '40mg',
            observaciones: 'Dosis administrada vía periférica.',
            indicacion_id: ind7_1.id,
            enfermero_id: enfermera1.id
        });

        // 9. Crear datos para Mesa de Entrada (Pacientes en sala de espera / visitas)
        console.log("🛎️ Cargando sala de espera de Mesa de Entrada...");

        // Paciente 9 (Mariano López) en sala de espera
        await Visita.create({
            motivo: 'Traumatismo y fuerte dolor en tobillo derecho tras torcedura.',
            prioridad: 'Media',
            estado: 'Esperando',
            tipo_ingreso: 'Guardia/Demanda Espontánea',
            paciente_id: paciente9.id
        });

        // Paciente 10 (Elena Peralta) en sala de espera
        await Visita.create({
            motivo: 'Cefalea intensa y mareos, sospecha de pico hipertensivo.',
            prioridad: 'Media',
            estado: 'Esperando',
            tipo_ingreso: 'Guardia/Demanda Espontánea',
            paciente_id: paciente10.id
        });

        // Paciente 11 (Mario Domínguez) en sala de espera
        await Visita.create({
            motivo: 'Fiebre y dolor abdominal agudo en fosa ilíaca derecha.',
            prioridad: 'Alta/Emergencia',
            estado: 'Esperando',
            tipo_ingreso: 'Guardia/Demanda Espontánea',
            paciente_id: paciente11.id
        });

        // Turno agendado para consulta de seguimiento
        await Turno.create({
            fecha: new Date().toISOString().split('T')[0],
            hora: '11:30:00',
            especialidad: 'Cardiología',
            motivo: 'Chequeo post-alta de enzimas cardíacas.',
            estado: 'Programado',
            paciente_id: paciente1.id,
            medico_id: medico1.id
        });

        // Estudio solicitado pendiente
        await Estudio.create({
            tipo_estudio: 'Radiografía de Tórax',
            descripcion: 'Control evolutivo de foco de condensación lobar.',
            estado: 'Pendiente',
            paciente_id: paciente3.id,
            medico_id: medico1.id
        });

        // 10. Crear algunas auditorías para registrar actividad en el sistema
        console.log("📝 Registrando actividad en el log de auditoría...");
        await Auditoria.create({
            accion: 'Inicialización de Base de Datos',
            detalles: 'Se realizó el borrado total e inserción de la seed de prueba.',
            usuario_id: admin.id,
            ip: '127.0.0.1'
        });

        await Auditoria.create({
            accion: 'Ingreso Paciente Emergencia',
            detalles: `Se registró el ingreso de paciente NN-Triage-Rojo en Cama 101.`,
            usuario_id: admisionista.id,
            ip: '127.0.0.1'
        });

        await Auditoria.create({
            accion: 'Prescripción de Medicamento',
            detalles: `Dr. House prescribió Aspirina 100mg para Paciente Juan Carlos Pérez.`,
            usuario_id: medico1.id,
            ip: '127.0.0.1'
        });

        console.log("✅ ¡Hospital HIS Pro poblado con éxito con un escenario clínico realista y TODAS las camas configuradas!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error al poblar la base de datos:", error);
        process.exit(1);
    }
}

poblarHospitalCompleto();