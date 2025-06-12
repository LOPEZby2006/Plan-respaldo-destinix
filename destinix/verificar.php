<?php
include "conexion.php";

$token = $_GET['token'] ?? '';

if (empty($token)) {
    die("Token inválido.");
}

$stmt = $conexion->prepare("SELECT id_seguridad FROM seguridad WHERE token_verificacion = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
    $stmt->bind_result($id);
    $stmt->fetch();
    $stmt->close();

    $update = $conexion->prepare("UPDATE seguridad SET verificado = 1, token_verificacion = NULL WHERE id_seguridad = ?");
    $update->bind_param("i", $id);
    $update->execute();

    header("Location: http://ambitious-forest-0ecbd371e.6.azurestaticapps.net/login?verificado=1");
    exit;
} else {
    echo "Token no válido o ya utilizado.";
}
$conexion->close();