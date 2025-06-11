<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "destinix";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$token = $_GET['token'] ?? '';

if (empty($token)) {
    die("Token inválido.");
}

$stmt = $conn->prepare("SELECT id_seguridad FROM seguridad WHERE token_verificacion = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
    $stmt->bind_result($id);
    $stmt->fetch();
    $stmt->close();

    $update = $conn->prepare("UPDATE seguridad SET verificado = 1, token_verificacion = NULL WHERE id_seguridad = ?");
    $update->bind_param("i", $id);
    $update->execute();

    header("Location: http://localhost:3000/login?verificado=1");
    exit;
} else {
    echo "Token no válido o ya utilizado.";
}
$conn->close();