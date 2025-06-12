<?php
header("Access-Control-Allow-Origin: http://ambitious-forest-0ecbd371e.6.azurestaticapps.net");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

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
