-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-02-2026 a las 20:34:32
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `his_hospital`
--
CREATE DATABASE IF NOT EXISTS `his_hospital` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `his_hospital`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id` int(11) NOT NULL,
  `accion` varchar(255) NOT NULL,
  `detalles` text DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `camas`
--

CREATE TABLE `camas` (
  `id` int(11) NOT NULL,
  `numero_cama` int(11) DEFAULT NULL,
  `estado` enum('Disponible','Ocupada','Mantenimiento','Limpieza') DEFAULT 'Disponible',
  `habitacion_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `camas`
--

INSERT INTO `camas` (`id`, `numero_cama`, `estado`, `habitacion_id`) VALUES
(1, 2011, 'Ocupada', 1),
(2, 2012, 'Disponible', 1),
(3, 2021, 'Ocupada', 2),
(4, 2022, 'Disponible', 2),
(5, 3011, 'Disponible', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evolucions`
--

CREATE TABLE `evolucions` (
  `id` int(11) NOT NULL,
  `tipo` enum('Medico','Enfermeria') NOT NULL,
  `nota` text NOT NULL,
  `signos_vitales` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`signos_vitales`)),
  `fecha` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `internacion_id` int(11) DEFAULT NULL,
  `autor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evolucions`
--

INSERT INTO `evolucions` (`id`, `tipo`, `nota`, `signos_vitales`, `fecha`, `createdAt`, `updatedAt`, `internacion_id`, `autor_id`) VALUES
(1, 'Medico', 'Paciente evoluciona favorablemente sin signos de infección.', NULL, '2026-02-12 16:33:45', '2026-02-12 16:33:45', '2026-02-12 16:33:45', 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitacions`
--

CREATE TABLE `habitacions` (
  `id` int(11) NOT NULL,
  `numero` varchar(255) NOT NULL,
  `tipo` enum('Individual','Compartida') DEFAULT 'Individual'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitacions`
--

INSERT INTO `habitacions` (`id`, `numero`, `tipo`) VALUES
(1, '201', 'Compartida'),
(2, '202', 'Compartida'),
(3, '301', 'Individual');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internacions`
--

CREATE TABLE `internacions` (
  `id` int(11) NOT NULL,
  `motivo` text DEFAULT NULL,
  `estado` enum('Activa','Alta','Cancelada') DEFAULT 'Activa',
  `fecha_ingreso` datetime DEFAULT NULL,
  `fecha_egreso` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `cama_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `internacions`
--

INSERT INTO `internacions` (`id`, `motivo`, `estado`, `fecha_ingreso`, `fecha_egreso`, `createdAt`, `updatedAt`, `paciente_id`, `cama_id`) VALUES
(1, 'Control Post-Operatorio', 'Activa', '2026-02-12 16:33:45', NULL, '2026-02-12 16:33:45', '2026-02-12 16:33:45', 1, 1),
(2, 'Observación por Cuadro Febril', 'Activa', '2026-02-12 16:33:45', NULL, '2026-02-12 16:33:45', '2026-02-12 16:33:45', 2, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `dni` varchar(255) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `sexo` enum('M','F','X') DEFAULT 'X',
  `obra_social` varchar(255) DEFAULT NULL,
  `numero_afiliado` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT 'No especificada',
  `telefono` varchar(255) DEFAULT 'No especificado',
  `email` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `apellido`, `dni`, `fecha_nacimiento`, `sexo`, `obra_social`, `numero_afiliado`, `direccion`, `telefono`, `email`, `createdAt`, `updatedAt`) VALUES
(1, 'Juan', 'Perez', '11111', '1980-05-15', 'M', 'OSDE', '1-4455-2', 'No especificada', 'No especificado', NULL, '2026-02-12 16:33:45', '2026-02-12 16:33:45'),
(2, 'Ana', 'Gomez', '22222', '1992-08-20', 'F', 'Swiss Medical', 'SM-9988', 'No especificada', 'No especificado', NULL, '2026-02-12 16:33:45', '2026-02-12 16:33:45'),
(3, 'Pedro', 'Ramirez', '33333', '1975-10-10', 'M', NULL, NULL, 'No especificada', '11-4455-6677', NULL, '2026-02-12 16:33:45', '2026-02-12 16:33:45'),
(4, 'Lucia', 'Fermin', '44444', '1995-03-12', 'F', NULL, NULL, 'Av. Siempre Viva 742', 'No especificado', NULL, '2026-02-12 16:33:45', '2026-02-12 16:33:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('Admin','Medico','Enfermeria','Admision') NOT NULL DEFAULT 'Admision',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin HIS', 'admin@his.com', '$2b$10$q2Ol5aCYuuSJLU5skuXBtejbzOm3KdnkBYCGSvxur8CBbUTVR7.VC', 'Admin', '2026-02-12 16:33:45', '2026-02-12 16:33:45'),
(2, 'Dr. Gregory House', 'medico@his.com', '$2b$10$q2Ol5aCYuuSJLU5skuXBtejbzOm3KdnkBYCGSvxur8CBbUTVR7.VC', 'Medico', '2026-02-12 16:33:45', '2026-02-12 16:33:45'),
(3, 'Enf. Joy', 'enfermera@his.com', '$2b$10$q2Ol5aCYuuSJLU5skuXBtejbzOm3KdnkBYCGSvxur8CBbUTVR7.VC', 'Enfermeria', '2026-02-12 16:33:45', '2026-02-12 16:33:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visitas`
--

CREATE TABLE `visitas` (
  `id` int(11) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `prioridad` enum('Baja','Media','Alta/Emergencia') DEFAULT 'Baja',
  `estado` enum('Esperando','En Atención','Finalizado','Derivado a Internación') DEFAULT 'Esperando',
  `tipo_ingreso` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paciente_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visitas`
--

INSERT INTO `visitas` (`id`, `motivo`, `prioridad`, `estado`, `tipo_ingreso`, `createdAt`, `updatedAt`, `paciente_id`) VALUES
(1, 'Dolor abdominal fuerte', 'Media', 'Esperando', 'Guardia', '2026-02-12 16:33:45', '2026-02-12 16:33:45', 3),
(2, 'Fractura de muñeca', 'Alta/Emergencia', 'En Atención', 'Guardia', '2026-02-12 16:33:45', '2026-02-12 16:33:45', 4);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `camas`
--
ALTER TABLE `camas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `habitacion_id` (`habitacion_id`);

--
-- Indices de la tabla `evolucions`
--
ALTER TABLE `evolucions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `internacion_id` (`internacion_id`),
  ADD KEY `autor_id` (`autor_id`);

--
-- Indices de la tabla `habitacions`
--
ALTER TABLE `habitacions`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `internacions`
--
ALTER TABLE `internacions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `cama_id` (`cama_id`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visitas`
--
ALTER TABLE `visitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `camas`
--
ALTER TABLE `camas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `evolucions`
--
ALTER TABLE `evolucions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `habitacions`
--
ALTER TABLE `habitacions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `internacions`
--
ALTER TABLE `internacions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `visitas`
--
ALTER TABLE `visitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `camas`
--
ALTER TABLE `camas`
  ADD CONSTRAINT `camas_ibfk_1` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `evolucions`
--
ALTER TABLE `evolucions`
  ADD CONSTRAINT `evolucions_ibfk_1` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_2` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `internacions`
--
ALTER TABLE `internacions`
  ADD CONSTRAINT `internacions_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internacions_ibfk_2` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `visitas`
--
ALTER TABLE `visitas`
  ADD CONSTRAINT `visitas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
