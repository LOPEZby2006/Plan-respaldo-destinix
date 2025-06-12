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

$servername = "ambitious-forest-0ecbd371e.6.azurestaticapps.net";
$username = "root";
$password = "";
$dbname = "destinix";

include "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';
$newPassword = $data['password'] ?? '';

if (!$token || !$newPassword) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos.']);
    exit;
}

// Buscar usuario con ese token (tabla seguridad)
$sql = "SELECT email_usu FROM seguridad WHERE token_recuperacion = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $email = $row['email_usu'];
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Actualizar contraseña y limpiar token
    $updateSql = "UPDATE seguridad SET contra_usu = ?, token_recuperacion = NULL WHERE email_usu = ?";
    $updateStmt = $conexion->prepare($updateSql);
    $updateStmt->bind_param("ss", $hashedPassword, $email);

    if ($updateStmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Contraseña actualizada correctamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar la contraseña.']);
    }

    $updateStmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Token inválido o expirado.']);
}

$stmt->close();
$conexion->close();