<?php
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("Access-Control-Allow-Origin: https://ambitious-forest-0ecbd371e.6.azurestaticapps.net");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit();
}

header("Access-Control-Allow-Origin: https://ambitious-forest-0ecbd371e.6.azurestaticapps.net");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Manejo de preflight (petición OPTIONS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

ob_start();
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Manejo de errores fatales
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE])) {
        ob_end_clean();
        echo json_encode(["success" => false, "message" => "Error fatal del servidor."]);
    }
});

include "conexion.php";

// Obtener datos JSON del frontend
$data = json_decode(file_get_contents("php://input"), true);

$nombre = $conexion->real_escape_string($data['nombre'] ?? '');
$apellidos = $conexion->real_escape_string($data['apellidos'] ?? '');
$telefono = $conexion->real_escape_string($data['telefono'] ?? '');
$email = $conexion->real_escape_string($data['email'] ?? '');
$documento = $conexion->real_escape_string($data['documento'] ?? '');
$localidad = $conexion->real_escape_string($data['localidad'] ?? '');
$genero = $conexion->real_escape_string($data['genero'] ?? '');
$fecha = $conexion->real_escape_string($data['fecha'] ?? '');
$contraseña = $conexion->real_escape_string($data['contraseña'] ?? '');

// Validaciones
if (
    empty($nombre) || empty($apellidos) || empty($telefono) || empty($email) ||
    empty($documento) || empty($localidad) || empty($genero) || empty($fecha) || empty($contraseña)
) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
    exit();
}

if (strlen($documento) !== 10 || !ctype_digit($documento)) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Documento de identidad inválido"]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Correo electrónico no válido"]);
    exit();
}

if (
    !preg_match('/[A-Z]/', $contraseña) ||
    !preg_match('/[a-z]/', $contraseña) ||
    !preg_match('/[0-9]/', $contraseña) ||
    !preg_match('/[\W_]/', $contraseña) ||
    strlen($contraseña) < 8
) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales."]);
    exit();
}

$fecha_nacimiento = DateTime::createFromFormat('Y-m-d', $fecha);
$hoy = new DateTime();
if (!$fecha_nacimiento) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Fecha de nacimiento inválida"]);
    exit();
}
$edad = $hoy->diff($fecha_nacimiento)->y;
if ($edad < 18) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Debes tener al menos 18 años para registrarte"]);
    exit();
}

$hash = password_hash($contraseña, PASSWORD_BCRYPT);

try {
    // Teléfono
    $stmt = $conexion->prepare("SELECT telefono_usu FROM persona WHERE telefono_usu = ?");
    $stmt->bind_param("s", $telefono);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        $stmt->close();
        throw new Exception("El teléfono ya está registrado");
    }
    $stmt->close();

    // Documento
    $stmt = $conexion->prepare("SELECT documento FROM persona WHERE documento = ?");
    $stmt->bind_param("s", $documento);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        $stmt->close();
        throw new Exception("El documento ya está registrado");
    }
    $stmt->close();

    // Insertar en seguridad
    $stmt = $conexion->prepare("INSERT INTO seguridad (email_usu, contra_usu) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $hash);
    if (!$stmt->execute()) {
        throw new Exception("Error al insertar en seguridad: " . $stmt->error);
    }
    $id_seguridad = $stmt->insert_id;
    $stmt->close();

    // Token de verificación
    $token = bin2hex(random_bytes(16));
    $url_verificacion = "https://destinixweb-h7cxddbtb0duddbv.brazilsouth-01.azurewebsites.net/destinix/verificar.php?token=$token";
    $stmt = $conexion->prepare("UPDATE seguridad SET token_verificacion = ? WHERE id_seguridad = ?");
    $stmt->bind_param("si", $token, $id_seguridad);
    if (!$stmt->execute()) {
        throw new Exception("Error al guardar token de verificación");
    }
    $stmt->close();

    // Insertar en persona
    $rol_idRol = 1;
    $stmt = $conexion->prepare("INSERT INTO persona (
        nombre_usu, apellido_usu, tipo_documento, documento, email_usu, telefono_usu, genero, localidad, fecha_nacimiento, contraseña, id_seguridad, rol_idRol
    ) VALUES (?, ?, 'CC', ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssssi", $nombre, $apellidos, $documento, $email, $telefono, $genero, $localidad, $fecha, $hash, $id_seguridad, $rol_idRol);
    if (!$stmt->execute()) {
        throw new Exception("Error al registrar usuario: " . $stmt->error);
    }
    $stmt->close();

    // Correo de verificación
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'destinix.sas@gmail.com';
        $mail->Password = 'ichz hebr vnyr rtsz'; // Usa una app password segura
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('no-reply@destinix.com', 'Destinix');
        $mail->addAddress($email, $nombre);
        $mail->isHTML(true);
        $mail->Subject = "Verifica tu correo electrónico";
        $mail->Body = "
            <p>Hola $nombre,</p>
            <p>Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
            <a href='$url_verificacion'>$url_verificacion</a>
            <p>Gracias.</p>
        ";
        $mail->send();
    } catch (Exception $e) {
        throw new Exception("No se pudo enviar el correo de verificación: {$mail->ErrorInfo}");
    }

    echo json_encode(["success" => true, "message" => "Usuario registrado correctamente. Revisa tu correo para verificar la cuenta."]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conexion->close();
