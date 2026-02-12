-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-02-2026 a las 12:45:01
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

--
-- Volcado de datos para la tabla `auditoria`
--

INSERT INTO `auditoria` (`id`, `accion`, `detalles`, `usuario_id`, `ip`, `createdAt`, `updatedAt`) VALUES
(1, 'Alta Paciente', 'Se liberó la cama 2021 (Pasa a Limpieza)', 2, NULL, '2025-12-17 17:36:50', '2025-12-17 17:36:50'),
(2, 'Ingreso Paciente', 'Paciente Gomez ingresado en cama 2021 por Dr. House', 2, NULL, '2025-12-17 17:37:10', '2025-12-17 17:37:10'),
(3, 'Alta Paciente', 'Se liberó la cama 2021 (Pasa a Limpieza)', 4, NULL, '2026-01-02 21:59:01', '2026-01-02 21:59:01'),
(4, 'Ingreso Paciente', 'Paciente Aguilera ingresado en cama 2012 por Director', 1, NULL, '2026-02-05 15:26:17', '2026-02-05 15:26:17'),
(5, 'Alta Paciente', 'Se liberó la cama 2012 (Pasa a Limpieza)', 1, NULL, '2026-02-05 15:26:41', '2026-02-05 15:26:41'),
(6, 'Ingreso Paciente', 'Paciente Femenino ingresado en cama 2021 por Director', 1, NULL, '2026-02-09 16:39:22', '2026-02-09 16:39:22'),
(7, 'Ingreso Paciente', 'Paciente Aguilera ingresado en cama 2012 por Director', 1, NULL, '2026-02-09 16:40:12', '2026-02-09 16:40:12'),
(8, 'Alta Paciente', 'Se liberó la cama 2021 (Pasa a Limpieza)', 1, NULL, '2026-02-09 16:40:34', '2026-02-09 16:40:34'),
(9, 'Alta Paciente', 'Se liberó la cama 2012 (Pasa a Limpieza)', 1, NULL, '2026-02-09 16:40:41', '2026-02-09 16:40:41');

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
(2, 2012, 'Limpieza', 1),
(3, 2021, 'Disponible', 2),
(4, 2022, 'Disponible', 2),
(5, 3001, 'Limpieza', 3);

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
(1, 'Medico', 'Paciente estable.', NULL, '2025-12-17 16:34:47', '2025-12-17 16:34:47', '2025-12-17 16:34:47', 1, 2),
(2, 'Medico', 'Comeson en el pie izquierdo', NULL, '2025-12-18 11:23:47', '2025-12-18 11:23:47', '2025-12-18 11:23:47', 3, 2),
(3, 'Enfermeria', 'se siente mal', '{\"presion\":\"130/80\",\"frecuencia_cardiaca\":\"84\",\"temperatura\":\"40\"}', '2026-01-02 21:52:59', '2026-01-02 21:52:59', '2026-01-02 21:52:59', 1, 1);

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
(3, '300', 'Individual');

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
(1, 'Neumonía', 'Activa', '2025-12-17 16:34:47', NULL, '2025-12-17 16:34:47', '2025-12-17 16:34:47', 1, 1),
(2, 'Fractura', 'Alta', '2025-12-17 16:34:47', '2025-12-17 17:36:50', '2025-12-17 16:34:47', '2025-12-17 17:36:50', 2, 3),
(3, 'Chequeo general', 'Alta', '2025-12-17 17:37:10', '2026-01-02 21:59:01', '2025-12-17 17:37:10', '2026-01-02 21:59:01', 2, 3),
(4, 'dolor', 'Alta', '2026-02-05 15:26:17', '2026-02-05 15:26:41', '2026-02-05 15:26:17', '2026-02-05 15:26:41', 5, 2),
(5, 'Malestar General', 'Alta', '2026-02-09 16:39:22', '2026-02-09 16:40:34', '2026-02-09 16:39:22', '2026-02-09 16:40:34', 4, 3),
(6, 'Dentista', 'Alta', '2026-02-09 16:40:12', '2026-02-09 16:40:41', '2026-02-09 16:40:12', '2026-02-09 16:40:41', 5, 2);

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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `numero_afiliado` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT 'No especificada',
  `telefono` varchar(255) DEFAULT 'No especificado',
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `apellido`, `dni`, `fecha_nacimiento`, `sexo`, `obra_social`, `createdAt`, `updatedAt`, `numero_afiliado`, `direccion`, `telefono`, `email`) VALUES
(1, 'Juan', 'Perez', '11111', '1980-01-01', 'M', NULL, '2025-12-17 16:34:47', '2025-12-17 16:34:47', NULL, 'No especificada', 'No especificado', NULL),
(2, 'Ana', 'Gomez', '22222', '1985-01-01', 'F', NULL, '2025-12-17 16:34:47', '2025-12-17 16:34:47', NULL, 'No especificada', 'No especificado', NULL),
(3, 'Pedro', 'Masculino', '88888', '1990-01-01', 'M', NULL, '2025-12-17 16:34:47', '2025-12-17 16:34:47', NULL, 'No especificada', 'No especificado', NULL),
(4, 'Lucia', 'Femenino', '99999', '1992-01-01', 'F', NULL, '2025-12-17 16:34:47', '2025-12-17 16:34:47', NULL, 'No especificada', 'No especificado', NULL),
(5, 'Victor', 'Aguilera', '12625991', '1959-04-23', 'M', 'PAMI', '2026-02-05 12:47:32', '2026-02-05 12:47:32', NULL, 'No especificada', 'No especificado', NULL);

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
(1, 'Director', 'admin@his.com', '$2b$10$Wqx.mo0ElCWQbPBS5T5s9ebuST2X90RTVtl/CUvZzVWS26wByxCVK', 'Admin', '2025-12-17 16:34:47', '2025-12-17 16:34:47'),
(2, 'Dr. House', 'medico@his.com', '$2b$10$Wqx.mo0ElCWQbPBS5T5s9ebuST2X90RTVtl/CUvZzVWS26wByxCVK', 'Medico', '2025-12-17 16:34:47', '2025-12-17 16:34:47'),
(3, 'Enf. Joy', 'enfermera@his.com', '$2b$10$Wqx.mo0ElCWQbPBS5T5s9ebuST2X90RTVtl/CUvZzVWS26wByxCVK', 'Enfermeria', '2025-12-17 16:34:47', '2025-12-17 16:34:47'),
(4, 'Dr. Nicotra', 'drnicotra@his.com', '$2b$10$YxnUhMZdLof/ouKZUEpR9uG4YFjlOWwgjiUwy2NT5d6ZkP7.IH8zW', 'Medico', '2026-01-02 21:56:52', '2026-01-02 21:56:52');

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
(1, 'Dentista', 'Media', 'En Atención', 'Turno', '2026-02-05 15:25:47', '2026-02-05 15:25:51', 5),
(2, 'Control', 'Baja', 'En Atención', 'Turno', '2026-02-09 16:30:39', '2026-02-09 16:32:37', 5);

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
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `dni_2` (`dni`),
  ADD UNIQUE KEY `dni_3` (`dni`),
  ADD UNIQUE KEY `dni_4` (`dni`),
  ADD UNIQUE KEY `dni_5` (`dni`),
  ADD UNIQUE KEY `dni_6` (`dni`),
  ADD UNIQUE KEY `dni_7` (`dni`),
  ADD UNIQUE KEY `dni_8` (`dni`),
  ADD UNIQUE KEY `dni_9` (`dni`),
  ADD UNIQUE KEY `dni_10` (`dni`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `camas`
--
ALTER TABLE `camas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `evolucions`
--
ALTER TABLE `evolucions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `habitacions`
--
ALTER TABLE `habitacions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `internacions`
--
ALTER TABLE `internacions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_4` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_5` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_6` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_7` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_8` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auditoria_ibfk_9` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `camas`
--
ALTER TABLE `camas`
  ADD CONSTRAINT `camas_ibfk_1` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_10` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_2` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_3` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_4` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_5` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_6` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_7` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_8` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `camas_ibfk_9` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `evolucions`
--
ALTER TABLE `evolucions`
  ADD CONSTRAINT `evolucions_ibfk_1` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_10` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_11` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_12` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_13` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_14` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_15` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_16` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_17` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_18` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_19` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_2` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_20` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_3` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_4` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_5` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_6` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_7` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_8` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `evolucions_ibfk_9` FOREIGN KEY (`internacion_id`) REFERENCES `internacions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `internacions`
--
ALTER TABLE `internacions`
  ADD CONSTRAINT `internacions_ibfk_10` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internacions_ibfk_12` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internacions_ibfk_14` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internacions_ibfk_16` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internacions_ibfk_18` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internacions_ibfk_19` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internacions_ibfk_2` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internacions_ibfk_20` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internacions_ibfk_4` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internacions_ibfk_6` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internacions_ibfk_8` FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `visitas`
--
ALTER TABLE `visitas`
  ADD CONSTRAINT `visitas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
