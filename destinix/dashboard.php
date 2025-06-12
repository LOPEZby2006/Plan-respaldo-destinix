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

include "conexion.php";

$response = [];

$query = "SELECT * FROM seguridad";
$resultado = $conexion->query($query);

if ($resultado) {
    $data = [];

    while ($fila = $resultado->fetch_assoc()) {
        $data[] = $fila;
    }

    $response['status'] = 'success';
    $response['data'] = $data;
} else {
    $response['status'] = 'error';
    $response['message'] = 'Error al ejecutar la consulta.';
}

echo json_encode($response);
$conexion->close();
?>
