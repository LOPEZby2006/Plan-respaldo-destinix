<?php
header("Access-Control-Allow-Origin: http://ambitious-forest-0ecbd371e.6.azurestaticapps.net");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

session_start();


$_SESSION = array();

// Destruir la sesión
session_destroy();

// Devolver respuesta JSON
echo json_encode(["success" => true, "message" => "Sesión cerrada correctamente."]);
?>
