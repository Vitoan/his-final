# 🏥 HIS Pro - Sistema de Gestión Hospitalaria

> Sistema integral Full-Stack para la administración de flujos hospitalarios, desde la admisión por guardia hasta la gestión inteligente de camas e historia clínica.

![Estado del Proyecto](https://img.shields.io/badge/Estado-Finalizado-success?style=flat-square)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?style=flat-square)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-blueviolet?style=flat-square)

## 📖 Descripción

**HIS Pro** es una solución web moderna diseñada para optimizar los procesos críticos de una institución de salud. El sistema reemplaza los registros manuales con un flujo digital unificado que conecta la Mesa de Entrada (Guardia), la Internación y el seguimiento médico.

Se destaca por su **Lógica de Negocio Avanzada**, implementando reglas de validación en tiempo real para evitar conflictos de género en habitaciones compartidas y gestionando automáticamente los ciclos de limpieza de camas tras el alta médica.

## ✨ Características Principales

### 🚑 1. Mesa de Entrada y Guardia (Triage)
* **Gestión de Espera:** Tablero en tiempo real de pacientes en sala de espera y en consultorio.
* **Sistema de Prioridades:** Clasificación visual (Baja, Media, Alta/Emergencia) para el orden de atención.
* **Internación Directa:** Funcionalidad para derivar pacientes desde la guardia a una cama con un solo clic, transfiriendo todos sus datos automáticamente.

### 🛏️ 2. Gestión Inteligente de Camas
* **Mapa Interactivo:** Visualización del estado de cada habitación (Disponible, Ocupada, En Limpieza).
* **Motor de Validación de Género:** Algoritmo que bloquea la asignación de una cama en una habitación compartida si ya existe un paciente del sexo opuesto internado.
* **Ciclo de Higiene:** Al dar de alta a un paciente, la cama pasa automáticamente a estado "Limpieza" y requiere habilitación por parte de enfermería/maestranza.

### 🩺 3. Historia Clínica Digital
* **Timeline de Evoluciones:** Registro cronológico de notas médicas y de enfermería.
* **Roles y Permisos:** Vistas diferenciadas para Médicos (carga clínica) y Enfermería (signos vitales y administración).

### 🎨 4. Experiencia de Usuario (UI/UX)
* **Diseño Bento Grid:** Interfaz moderna basada en tarjetas y contenedores modulares.
* **Dark Mode Nativo:** Soporte completo para tema oscuro, ideal para guardias nocturnas.
* **Feedback Visual:** Alertas, toasts y estados de carga para confirmar acciones.

## 🛠️ Stack Tecnológico

* **Backend:** Node.js, Express.js.
* **Base de Datos:** SQLite (Dev) / MySQL (Prod), gestionada con **Sequelize ORM**.
* **Frontend:** Pug (Motor de Vistas), TailwindCSS (Estilos utilitarios).
* **Herramientas:** Bcrypt (Seguridad), Dotenv (Configuración), Nodemon.

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/his-final.git](https://github.com/tu-usuario/his-final.git)
cd his-final

```

### 2. Instalar dependencias

```bash
npm install

```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y define:

```env
PORT=3000
SESSION_SECRET=palabra_secreta_super_segura

```

### 4. Inicializar Base de Datos (Seed)

Importar database\his_hospital.sql

Ejecuta el script de "semilla" para crear las tablas(si la base esta vacia) y cargar datos de prueba (Habitaciones compartidas, pacientes en espera, usuarios):

```bash
node seed.js

```

> **Nota:** Este comando reinicia la base de datos (borra y crea de nuevo) para garantizar un entorno de pruebas limpio.

### 5. Iniciar el Servidor

```bash
npm run dev

```

Accede a `http://localhost:3000` en tu navegador.

## 🔑 Credenciales de Acceso (Testing)

El script `seed.js` genera los siguientes usuarios con roles predefinidos:

| Rol | Email | Contraseña | Acceso Principal |
| --- | --- | --- | --- |
| **Administrador** | `admin@his.com` | `123456` | Configuración Global |
| **Médico** | `medico@his.com` | `123456` | Historias Clínicas, Internación |
| **Enfermería** | `enfermera@his.com` | `123456` | Signos Vitales, Gestión de Camas |

## 📂 Estructura del Proyecto

```text
src/
├── controllers/       # Lógica: Mesa de Entrada, Internación, Habitaciones
├── models/            # Definición de tablas (Sequelize)
├── routes/            # Endpoints y Middleware de rutas
├── views/             # Plantillas PUG
│   ├── layouts/       # Estructura base (Navbar, Footer)
│   ├── mesa/          # Vistas de Guardia
│   ├── internacion/   # Formularios de asignación de camas
│   └── rooms/         # Mapa de camas
└── app.js             # Configuración del servidor Express

```

## 🔮 Próximas Mejoras (Roadmap)

* [ ] **Reportes PDF:** Generación de epicrisis y alta médica imprimibles.
* [ ] **Módulo de Farmacia:** Descuento de stock de medicamentos al cargarlos en la evolución.
* [ ] **Facturación:** Módulo para obras sociales y pre-pagas.
* [ ] **WebSockets:** Actualización del mapa de camas en tiempo real sin recargar la página.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

---

**Desarrollado con ❤️ para modernizar la salud.**

```

```