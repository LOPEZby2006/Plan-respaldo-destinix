<?php
$host = "destinixserver.mysql.database.azure.com";
$user = "Lopez123";
$password = "DIEGOlp2001*";
$dbname = "destinix";

$conexion = new mysqli($host, $user, $password, $dbname);

if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos.']);
    exit;
}
