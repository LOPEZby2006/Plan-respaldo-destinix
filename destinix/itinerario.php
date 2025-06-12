<?php   
header("Access-Control-Allow-Origin: https://ambitious-forest-0ecbd371e.6.azurestaticapps.net");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Activar errores para pruebas
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ✅ INCLUYE CONEXIÓN — asegúrate que este archivo existe y no produce errores
require_once "conexion.php";

// 🚀 EJEMPLO DE CONSULTA (ajústalo a lo que tú necesitas)
$sql = "SELECT * FROM itinerario";
$resultado = $conexion->query($sql);

if ($resultado) {
    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }
    echo json_encode($datos);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener el itinerario"]);
}

$conexion->close();
?>