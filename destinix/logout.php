<?php
header("Access-Control-Allow-Origin: https://ambitious-forest-0ecbd371e.6.azurestaticapps.net");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Manejo de preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

session_start();


$_SESSION = array();

// Destruir la sesión
session_destroy();

// Devolver respuesta JSON
echo json_encode(["success" => true, "message" => "Sesión cerrada correctamente."]);
?>
