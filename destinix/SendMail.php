<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// 👇 CORS headers para producción
header("Access-Control-Allow-Origin: https://ambitious-forest-0ecbd371e.6.azurestaticapps.net");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// 👇 Manejo de preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


include "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Correo requerido']);
    exit;
}

// Verifica si el correo existe
$stmt = $conexion->prepare("SELECT id_persona FROM persona WHERE email_usu = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
    $token = bin2hex(random_bytes(32));

    // Guarda el token en seguridad
    $update = $conexion->prepare("UPDATE seguridad SET token_recuperacion = ? WHERE email_usu = ?");
    $update->bind_param("ss", $token, $email);
    $update->execute();

    // URL de recuperación (cambia ambitious-forest-0ecbd371e.6.azurestaticapps.net por tu IP local si lo pruebas en celular)
    $url = "http://ambitious-forest-0ecbd371e.6.azurestaticapps.net/resetpassword?token=" . $token;

    // Enviar correo
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'destinix.sas@gmail.com'; // tu correo
        $mail->Password   = 'ichz hebr vnyr rtsz';         // tu clave de app de Gmail
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        $mail->setFrom('destinix.sas@gmail.com', 'Destinix');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Recuperacion de contrasena';
        $mail->Body    = "Haz clic en el siguiente enlace para restablecer tu contraseña:<br><a href='$url'>$url</a>";

        $mail->send();
        echo json_encode(['success' => true, 'message' => 'Correo de recuperación enviado']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'No se pudo enviar el correo']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Correo no encontrado']);
}

$conexion->close();