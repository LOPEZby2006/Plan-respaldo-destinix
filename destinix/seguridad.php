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
if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Conexión fallida: " . $conexion->connect_error]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM seguridad";
        $result = $conexion->query($sql);

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    case 'POST':
        // Recibir datos JSON o form-data
        $input = json_decode(file_get_contents("php://input"), true);

        $email_usu = $input['email_usu'] ?? $_POST['email_usu'] ?? null;
        $contra_usu = $input['contra_usu'] ?? $_POST['contra_usu'] ?? null;

        if ($email_usu && $contra_usu) {
            $stmt = $conexion->prepare("INSERT INTO seguridad (email_usu, contra_usu) VALUES (?, ?)");
            $stmt->bind_param("ss", $email_usu, $contra_usu);
            $exec = $stmt->execute();

            echo json_encode(["success" => $exec]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Faltan email o contraseña"]);
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents("php://input"), true);

        $id = $input['id_seguridad'] ?? null;
        $email_usu = $input['email_usu'] ?? null;
        $contra_usu = $input['contra_usu'] ?? null;

        if ($id && $email_usu && $contra_usu) {
            $stmt = $conexion->prepare("UPDATE seguridad SET email_usu = ?, contra_usu = ? WHERE id_seguridad = ?");
            $stmt->bind_param("ssi", $email_usu, $contra_usu, $id);
            $exec = $stmt->execute();

            echo json_encode(["success" => $exec]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos para actualizar"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id) {
            $stmt = $conexion->prepare("DELETE FROM seguridad WHERE id_seguridad = ?");
            $stmt->bind_param("i", $id);
            $exec = $stmt->execute();

            echo json_encode(["success" => $exec]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Falta el ID para eliminar"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}
$conexion->close();
