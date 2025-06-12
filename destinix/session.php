<?php
// Permitir solicitudes desde tu frontend en Azure Static Web Apps
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

if (isset($_SESSION['id_persona'])) {
    echo json_encode([
        'loggedIn' => true,
        'id_persona' => $_SESSION['id_persona'],
        'rol_idRol' => $_SESSION['rol_idRol'] ?? null  // <- Aquí enviamos el rol también
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>
