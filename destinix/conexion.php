<?php
$host = "destinixserver.mysql.database.azure.com";
$user = "Lopez123";
$password = "DIEGOlp2001*";
$dbname = "destinix";

// Crear conexión
$conexion = new mysqli($host, $user, $password, $dbname);

// Manejar error de conexión (sin imprimir nada si todo va bien)
if ($conexion->connect_error) {
    error_log("Error de conexión: " . $conexion->connect_error); // Esto va al log de Azure
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión.']);
    exit;
}

