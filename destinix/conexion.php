<?php
$host = "destinixserver.mysql.database.azure.com";
$user = "Lopez123";
$password = "DIEGOlp2001*";
$dbname = "destinix";

// Crear conexión
$conexion = new mysqli($host, $user, $password, $dbname);

// Manejar error de conexión (sin imprimir nada si todo va bien)
if ($conexion->connect_error) {
    error_log("Conexión fallida: " . $conexion->connect_error);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos.'
    ]);
    exit;
}
