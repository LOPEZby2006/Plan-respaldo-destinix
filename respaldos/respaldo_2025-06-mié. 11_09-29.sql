-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: destinix
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `calificacion`
--

DROP TABLE IF EXISTS `calificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calificacion` (
  `id_calificacion` int(11) NOT NULL COMMENT 'Identificador único de la calificación',
  `puntuacion` int(11) NOT NULL COMMENT 'Valor numérico asignado como puntuación',
  PRIMARY KEY (`id_calificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calificacion`
--

LOCK TABLES `calificacion` WRITE;
/*!40000 ALTER TABLE `calificacion` DISABLE KEYS */;
INSERT INTO `calificacion` VALUES (1,1),(2,2),(3,3),(4,4),(5,5);
/*!40000 ALTER TABLE `calificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_cate` varchar(50) NOT NULL,
  `desc_cate` varchar(120) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Hotel','Alojamiento en hoteles'),(2,'Restaurante','Servicios de comida y bebida'),(3,'Sitio turistico','variedad de sitios turiscticos especiales de bogota');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comentarios` (
  `id_comentario` int(11) NOT NULL AUTO_INCREMENT,
  `persona_id_persona` int(11) NOT NULL,
  `id_sitio` int(11) DEFAULT NULL,
  `id_hoteles` int(11) DEFAULT NULL,
  `id_restaurante` int(11) DEFAULT NULL,
  `contenido` text NOT NULL,
  `fecha_comentario` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_calificacion` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_comentario`),
  KEY `persona_id_persona` (`persona_id_persona`),
  KEY `id_sitio` (`id_sitio`),
  KEY `id_hoteles` (`id_hoteles`),
  KEY `id_restaurante` (`id_restaurante`),
  KEY `id_calificacion` (`id_calificacion`),
  CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`persona_id_persona`) REFERENCES `persona` (`id_persona`) ON DELETE CASCADE,
  CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`id_sitio`) REFERENCES `sitio_turistico` (`id_sitio`) ON DELETE SET NULL,
  CONSTRAINT `comentarios_ibfk_3` FOREIGN KEY (`id_hoteles`) REFERENCES `hoteles` (`id_hoteles`) ON DELETE SET NULL,
  CONSTRAINT `comentarios_ibfk_4` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`) ON DELETE SET NULL,
  CONSTRAINT `comentarios_ibfk_5` FOREIGN KEY (`id_calificacion`) REFERENCES `calificacion` (`id_calificacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarios`
--

LOCK TABLES `comentarios` WRITE;
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
INSERT INTO `comentarios` VALUES (13,6,1,NULL,NULL,'dfthr','2025-04-22 18:36:35',3),(14,6,1,NULL,NULL,'ertytrew','2025-04-22 20:03:40',4),(15,6,2,NULL,NULL,'ertewertyhgf','2025-04-22 21:02:47',5),(16,6,NULL,NULL,1,'wertytrewq','2025-04-23 01:00:19',4),(17,6,NULL,1,NULL,'ertyuhgfdertyhgbvcdrtgvc','2025-04-23 02:10:58',3),(18,6,3,NULL,NULL,'rtyiopiuyreryuiopouiyt','2025-04-23 13:50:30',3),(20,6,NULL,1,NULL,'aserthsdfh','2025-05-07 00:57:04',5);
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresa`
--

DROP TABLE IF EXISTS `empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empresa` (
  `id_empresa` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_emp` varchar(50) NOT NULL,
  `direccion_emp` varchar(50) NOT NULL,
  `correo_empresa` varchar(45) NOT NULL,
  `telefono_empresa` int(11) NOT NULL,
  `persona_id_persona` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  PRIMARY KEY (`id_empresa`),
  KEY `fk_empresa_categoria_idx` (`id_categoria`),
  KEY `fk_empresa_persona_idx` (`persona_id_persona`),
  CONSTRAINT `fk_empresa_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`),
  CONSTRAINT `fk_empresa_persona` FOREIGN KEY (`persona_id_persona`) REFERENCES `persona` (`id_persona`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresa`
--

LOCK TABLES `empresa` WRITE;
/*!40000 ALTER TABLE `empresa` DISABLE KEYS */;
INSERT INTO `empresa` VALUES (1,'LOVIA Co.','Av. Principal 123','contacto123@hoteldestinix.com',123456789,25,1);
/*!40000 ALTER TABLE `empresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado`
--

DROP TABLE IF EXISTS `estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estado` (
  `id_estado` int(11) NOT NULL,
  `desc_estado` varchar(40) NOT NULL,
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado`
--

LOCK TABLES `estado` WRITE;
/*!40000 ALTER TABLE `estado` DISABLE KEYS */;
INSERT INTO `estado` VALUES (0,'activo'),(2,'inactivo'),(3,'bloqueado');
/*!40000 ALTER TABLE `estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoteles`
--

DROP TABLE IF EXISTS `hoteles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hoteles` (
  `id_hoteles` int(11) NOT NULL AUTO_INCREMENT,
  `titulo_hotel` varchar(45) NOT NULL,
  `img` varchar(45) NOT NULL,
  `descripcion_hotel` varchar(400) NOT NULL,
  `estado_id_estado` int(11) NOT NULL,
  `empresa_id_empresa` int(11) NOT NULL,
  PRIMARY KEY (`id_hoteles`),
  KEY `fk_hoteles_estado_idx` (`estado_id_estado`),
  KEY `fk_hoteles_empresa_idx` (`empresa_id_empresa`),
  CONSTRAINT `fk_hoteles_empresa` FOREIGN KEY (`empresa_id_empresa`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_hoteles_estado` FOREIGN KEY (`estado_id_estado`) REFERENCES `estado` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoteles`
--

LOCK TABLES `hoteles` WRITE;
/*!40000 ALTER TABLE `hoteles` DISABLE KEYS */;
INSERT INTO `hoteles` VALUES (1,'Hotel Destinix','hotel.jpeg','Un hotel de lujo con vista al mar.',0,1),(3,'hotel Bogota','Bogota.jpeg','HOTEL BOGOTA',0,1),(5,'hotel ejemplo','descarga.jpeg','ESTO ES UN EJEMPLO DE HOTEL',0,1),(6,'hotel Bogota','hotel.jpeg','tyswrtwertywty',0,1),(24,'HOTEL STARCLIMB','681aa53f18f8a_descarga.jpeg','juytfknbv,nbvgikuytf',0,1);
/*!40000 ALTER TABLE `hoteles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itinerario`
--

DROP TABLE IF EXISTS `itinerario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `itinerario` (
  `id_itinerario` int(11) NOT NULL AUTO_INCREMENT,
  `persona_id_persona` int(11) NOT NULL,
  `id_sitio` int(11) DEFAULT NULL,
  `id_hoteles` int(11) DEFAULT NULL,
  `id_restaurante` int(11) DEFAULT NULL,
  `fecha_itinerario` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `descripcion` varchar(300) NOT NULL,
  `estado_id_estado` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_itinerario`),
  KEY `persona_id_persona` (`persona_id_persona`),
  KEY `id_sitio` (`id_sitio`),
  KEY `id_hoteles` (`id_hoteles`),
  KEY `id_restaurante` (`id_restaurante`),
  KEY `estado_id_estado` (`estado_id_estado`),
  CONSTRAINT `itinerario_ibfk_1` FOREIGN KEY (`persona_id_persona`) REFERENCES `persona` (`id_persona`) ON DELETE CASCADE,
  CONSTRAINT `itinerario_ibfk_3` FOREIGN KEY (`id_sitio`) REFERENCES `sitio_turistico` (`id_sitio`) ON DELETE SET NULL,
  CONSTRAINT `itinerario_ibfk_4` FOREIGN KEY (`id_hoteles`) REFERENCES `hoteles` (`id_hoteles`) ON DELETE SET NULL,
  CONSTRAINT `itinerario_ibfk_5` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`) ON DELETE SET NULL,
  CONSTRAINT `itinerario_ibfk_6` FOREIGN KEY (`estado_id_estado`) REFERENCES `estado` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itinerario`
--

LOCK TABLES `itinerario` WRITE;
/*!40000 ALTER TABLE `itinerario` DISABLE KEYS */;
/*!40000 ALTER TABLE `itinerario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `persona` (
  `id_persona` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_usu` varchar(50) NOT NULL,
  `apellido_usu` varchar(50) NOT NULL,
  `tipo_documento` varchar(45) NOT NULL,
  `documento` int(11) NOT NULL,
  `email_usu` varchar(70) NOT NULL,
  `telefono_usu` varchar(11) NOT NULL,
  `genero` varchar(50) NOT NULL,
  `localidad` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `id_seguridad` int(11) NOT NULL,
  `rol_idRol` int(11) NOT NULL,
  `foto_perfil` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_persona`),
  KEY `fk_persona_seguridad_idx` (`id_seguridad`),
  KEY `fk_persona_rol_idx` (`rol_idRol`),
  CONSTRAINT `fk_persona_rol` FOREIGN KEY (`rol_idRol`) REFERENCES `rol` (`idRol`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_persona_seguridad` FOREIGN KEY (`id_seguridad`) REFERENCES `seguridad` (`id_seguridad`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (6,'Diego','López','CC',1021671180,'diego.lopezm0405@gmail.com','3155056916','masculino','San Cristobal','1996-11-13','$2y$10$VAaGwtBxHhk1qQOVsLl6he4yW7IU3h53Yd0CnrHx.kHsorRPSzHFy',11,1,'68104c46ef8d9_gumball.jpeg'),(25,'diego','lopez','CC',1021671182,'diegoestebanlopezmelo8@gmail.com','3212530709','masculino','San Cristobal','2006-05-04','$2y$10$U/aPKc6ltP8ny.clWczAZOsUUjOVzYMuJImFP0lvorfrHzPB4ZTh2',29,3,'68181de3d7bcb_68104c46ef8d9_gumball.jpeg'),(48,'diego','lopez','CC',1011202200,'diegolopez@gmail.com','8992423977','masculino','Barrios Unidos','2001-02-01','$2y$10$1spmUyEa4keK1pU/9LFPce8B79Gt4WZiPfPpmCL5BmQ3MpyYmeciO',50,2,NULL),(59,'diego','lopez','CC',1021671123,'destinix.sas@gmail.com','3144102859','masculino','San Cristobal','2003-03-02','$2y$10$HdYPm/ggZn0lwbNGJMJy9.WCK/d2Ay/ebyLc4qQfmNsTHxeyHfe9G',74,1,NULL);
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER before_persona_delete
BEFORE DELETE ON persona
FOR EACH ROW
BEGIN
    DELETE FROM seguridad WHERE id_seguridad = OLD.id_seguridad;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `restaurantes`
--

DROP TABLE IF EXISTS `restaurantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `restaurantes` (
  `id_restaurante` int(11) NOT NULL AUTO_INCREMENT,
  `titulo_restaurante` varchar(100) NOT NULL,
  `img` varchar(50) NOT NULL,
  `desc_restaurantes` varchar(50) NOT NULL,
  `estado_id_estado` int(11) NOT NULL,
  `empresa_id_empresa` int(11) NOT NULL,
  PRIMARY KEY (`id_restaurante`),
  KEY `fk_restaurantes_estado_idx` (`estado_id_estado`),
  KEY `fk_restaurantes_empresa_idx` (`empresa_id_empresa`),
  CONSTRAINT `fk_restaurantes_empresa` FOREIGN KEY (`empresa_id_empresa`) REFERENCES `empresa` (`id_empresa`),
  CONSTRAINT `fk_restaurantes_estado` FOREIGN KEY (`estado_id_estado`) REFERENCES `estado` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurantes`
--

LOCK TABLES `restaurantes` WRITE;
/*!40000 ALTER TABLE `restaurantes` DISABLE KEYS */;
INSERT INTO `restaurantes` VALUES (1,'restaurante destinix','restaurante.jpeg','restaurante de ejemplo destinix',0,1),(2,'restaurante destinix 2','restaurante2.jpeg','este es otro ejemplo de restaurante',0,1);
/*!40000 ALTER TABLE `restaurantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rol` (
  `idRol` int(11) NOT NULL,
  `Tipo_Rol` varchar(45) NOT NULL,
  PRIMARY KEY (`idRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'cliente'),(2,'administrador'),(3,'anunciante');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seguridad`
--

DROP TABLE IF EXISTS `seguridad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `seguridad` (
  `id_seguridad` int(11) NOT NULL AUTO_INCREMENT,
  `email_usu` varchar(70) NOT NULL,
  `contra_usu` varchar(255) NOT NULL,
  `token_recuperacion` varchar(255) DEFAULT NULL,
  `verificado` tinyint(1) DEFAULT 0,
  `token_verificacion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_seguridad`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seguridad`
--

LOCK TABLES `seguridad` WRITE;
/*!40000 ALTER TABLE `seguridad` DISABLE KEYS */;
INSERT INTO `seguridad` VALUES (11,'diego.lopezm0405@gmail.com','$2y$10$NF22J9AZGSW1rcGxjjiSMe0hR5NKJUL/zeDDwWnyhpVh0esEyeCwu',NULL,1,NULL),(29,'diegoestebanlopezmelo8@gmail.com','$2y$10$U/aPKc6ltP8ny.clWczAZOsUUjOVzYMuJImFP0lvorfrHzPB4ZTh2',NULL,1,NULL),(50,'diegolopez@gmail.com','$2y$10$1spmUyEa4keK1pU/9LFPce8B79Gt4WZiPfPpmCL5BmQ3MpyYmeciO',NULL,1,NULL),(74,'destinix.sas@gmail.com','$2y$10$HdYPm/ggZn0lwbNGJMJy9.WCK/d2Ay/ebyLc4qQfmNsTHxeyHfe9G',NULL,1,NULL);
/*!40000 ALTER TABLE `seguridad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sitio_turistico`
--

DROP TABLE IF EXISTS `sitio_turistico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sitio_turistico` (
  `id_sitio` int(10) NOT NULL AUTO_INCREMENT,
  `nombre_sitio` varchar(50) NOT NULL,
  `img_sitio` varchar(50) NOT NULL,
  `ubicacion_sitio` varchar(50) NOT NULL,
  `desc_sitio` varchar(500) NOT NULL,
  `persona_id_persona` int(10) NOT NULL,
  `estado_id_estado` int(11) NOT NULL,
  PRIMARY KEY (`id_sitio`),
  KEY `fk_sitio_turistico_persona1_idx` (`persona_id_persona`),
  KEY `fk_sitio_turistico_estado1_idx` (`estado_id_estado`),
  CONSTRAINT `fk_sitio_turistico_estado1` FOREIGN KEY (`estado_id_estado`) REFERENCES `estado` (`id_estado`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_sitio_turistico_persona1` FOREIGN KEY (`persona_id_persona`) REFERENCES `persona` (`id_persona`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sitio_turistico`
--

LOCK TABLES `sitio_turistico` WRITE;
/*!40000 ALTER TABLE `sitio_turistico` DISABLE KEYS */;
INSERT INTO `sitio_turistico` VALUES (1,'monserrate','monserrate.jpg','bogota D.C','Ubicado en el corazón de Bogotá, Monserrate es uno de los cerros más emblemáticos de la ciudad. Su cima alberga un santuario que atrae a miles de peregrinos y turistas cada año. Desde lo alto, ofrece una vista panorámica impresionante de la capital colombiana, ideal para disfrutar de atardeceres y paisajes inolvidables. Se puede acceder a través de senderos, teleférico o funicular.',6,0),(2,'iglesia 20 de julio','20dejulio.jpeg','bogota D.C','iglesia 20 de julio ubicada en bogota dc',6,0),(3,'Parque Nacional','nacional.jpeg','bogota D.C','parque nacional ubicado en bogota D.C',6,0);
/*!40000 ALTER TABLE `sitio_turistico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `soporte_pagos`
--

DROP TABLE IF EXISTS `soporte_pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `soporte_pagos` (
  `id_reserva` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_reserva` datetime NOT NULL,
  `fecha_visita` date NOT NULL,
  `cantidad_personas` int(11) NOT NULL,
  `restaurante_id` int(11) DEFAULT NULL,
  `sitio_id` int(11) DEFAULT NULL,
  `hotel_id` int(11) DEFAULT NULL,
  `estado_id` int(11) NOT NULL,
  `empresa_id` int(11) NOT NULL,
  `id_itinerario` int(11) NOT NULL,
  PRIMARY KEY (`id_reserva`),
  KEY `restaurante_id` (`restaurante_id`,`sitio_id`,`hotel_id`,`estado_id`,`empresa_id`),
  KEY `empresa_id` (`empresa_id`),
  KEY `estado_id` (`estado_id`),
  KEY `hotel_id` (`hotel_id`),
  KEY `sitio_id` (`sitio_id`),
  KEY `id_itinerario` (`id_itinerario`),
  CONSTRAINT `soporte_pagos_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `soporte_pagos_ibfk_2` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id_estado`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `soporte_pagos_ibfk_3` FOREIGN KEY (`restaurante_id`) REFERENCES `restaurantes` (`id_restaurante`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `soporte_pagos_ibfk_4` FOREIGN KEY (`hotel_id`) REFERENCES `hoteles` (`id_hoteles`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `soporte_pagos_ibfk_5` FOREIGN KEY (`sitio_id`) REFERENCES `sitio_turistico` (`id_sitio`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `soporte_pagos_ibfk_6` FOREIGN KEY (`id_itinerario`) REFERENCES `itinerario` (`id_itinerario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `soporte_pagos`
--

LOCK TABLES `soporte_pagos` WRITE;
/*!40000 ALTER TABLE `soporte_pagos` DISABLE KEYS */;
/*!40000 ALTER TABLE `soporte_pagos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11  9:29:42
