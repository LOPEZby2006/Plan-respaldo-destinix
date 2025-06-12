<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

session_start();
include "conexion.php";

// ⚙️ Ruta para guardar imágenes
$rutaImagenes = "soportes/";

// ✅ OBTENER (GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM soporte_pagos";
    $result = $conexion->query($sql);

    $soportes = [];
    while ($row = $result->fetch_assoc()) {
        $soportes[] = $row;
    }
    echo json_encode($soportes);
    exit;
}

// ✅ INSERTAR o ELIMINAR (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Eliminar
    $postData = json_decode(file_get_contents("php://input"), true);
    if (isset($postData['accion']) && $postData['accion'] === 'eliminar') {
        $id = intval($postData['id_soporte']);
        $stmt = $conexion->prepare("DELETE FROM soporte_pagos WHERE id_soporte = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["success" => $stmt->affected_rows > 0]);
        exit;
    }

    // Insertar
    if (isset($_POST['accion']) && $_POST['accion'] === 'insertar') {
        // 🧠 Simulando sesión (ajusta esto con tus datos reales)
        $_SESSION['id_empresa'] = 1;
        $_SESSION['id_persona'] = 2;

        $id_empresa = $_SESSION['id_empresa'];
        $id_persona = $_SESSION['id_persona'];
        $estado_id = 4;

        $restaurante_id = !empty($_POST['restaurante_id']) ? $_POST['restaurante_id'] : null;
        $hotel_id = !empty($_POST['hotel_id']) ? $_POST['hotel_id'] : null;
        $sitio_id = !empty($_POST['sitio_id']) ? $_POST['sitio_id'] : null;

        if (isset($_FILES['imagen_soporte'])) {
            $nombre = basename($_FILES["imagen_soporte"]["name"]);
            $rutaFinal = $rutaImagenes . $nombre;

            if (move_uploaded_file($_FILES["imagen_soporte"]["tmp_name"], $rutaFinal)) {
                $stmt = $conexion->prepare("INSERT INTO soporte_pagos (imagen_soporte, id_empresa, id_persona, restaurante_id, hotel_id, sitio_id, estado_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("siiiiii", $nombre, $id_empresa, $id_persona, $restaurante_id, $hotel_id, $sitio_id, $estado_id);

                if ($stmt->execute()) {
                    echo json_encode(["success" => true]);
                } else {
                    echo json_encode(["success" => false, "error" => "Error al insertar"]);
                }
                exit;
            } else {
                echo json_encode(["success" => false, "error" => "No se pudo mover la imagen"]);
                exit;
            }
        } else {
            echo json_encode(["success" => false, "error" => "No se recibió imagen"]);
            exit;
        }
    }

    echo json_encode(["success" => false, "error" => "Acción no válida"]);
    exit;
}

$conexion->close();
?>
