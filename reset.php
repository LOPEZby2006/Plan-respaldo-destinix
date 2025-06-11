<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "destinix";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión.']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';
$newPassword = $data['password'] ?? '';

if (!$token || !$newPassword) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos.']);
    exit;
}

// Buscar usuario con ese token (tabla seguridad)
$sql = "SELECT email_usu FROM seguridad WHERE token_recuperacion = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $email = $row['email_usu'];
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Actualizar contraseña y limpiar token
    $updateSql = "UPDATE seguridad SET contra_usu = ?, token_recuperacion = NULL WHERE email_usu = ?";
    $updateStmt = $conn->prepare($updateSql);
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
$conn->close();