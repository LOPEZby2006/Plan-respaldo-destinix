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

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "GET":
        // Obtener todos los registros
        $query = "SELECT * FROM persona";
        $resultado = $conexion->query($query);
        $data = [];

        $host = $_SERVER['HTTP_HOST'];

        if ($resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                if (!empty($fila["foto_perfil"])) {
                    $fila["foto_perfil"] = "http://$host/destinix/imagenes/" . $fila["foto_perfil"];
                }
                $data[] = $fila;
            }
        }

        echo json_encode($data);
        break;

    case "POST":
        // Crear nuevo registro
        $nombre = $_POST['nombre_usu'] ?? '';
        $apellido = $_POST['apellido_usu'] ?? '';
        $email = $_POST['email_usu'] ?? '';
        $localidad = $_POST['localidad'] ?? '';
        $numero = $_POST['telefono_usu'] ?? '';
        $foto_perfil = null;

        // Validación de campos obligatorios
        if (empty($nombre) || empty($apellido) || empty($email)) {
            echo json_encode(["error" => "Faltan campos obligatorios."]);
            exit;
        }

        if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
            $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            $maxSize = 2 * 1024 * 1024; // 2MB

            if (!in_array($_FILES['foto_perfil']['type'], $allowedTypes)) {
                echo json_encode(["error" => "Formato de imagen no permitido. Solo JPG, JPEG o PNG."]);
                exit;
            }

            if ($_FILES['foto_perfil']['size'] > $maxSize) {
                echo json_encode(["error" => "La imagen excede el tamaño máximo de 2MB."]);
                exit;
            }

            $uploadDir = __DIR__ . '/imagenes/';
            $fileName = uniqid() . '_' . basename($_FILES['foto_perfil']['name']);
            $uploadFile = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['foto_perfil']['tmp_name'], $uploadFile)) {
                $foto_perfil = $fileName;
            } else {
                echo json_encode(["error" => "Error subiendo la imagen."]);
                exit;
            }
        }

        $stmt = $conexion->prepare("INSERT INTO persona (nombre_usu, apellido_usu, email_usu, localidad, telefono_usu, foto_perfil) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $nombre, $apellido, $email, $localidad, $numero, $foto_perfil);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["error" => "Error insertando datos: " . $stmt->error]);
        }

        $stmt->close();
        break;

    case "PUT":
        // Actualizar registro existente (se espera JSON)
        $datos = json_decode(file_get_contents("php://input"), true);

        if (!isset($datos['id_persona'])) {
            echo json_encode(["error" => "ID requerido para actualizar."]);
            exit;
        }

        $id = $datos['id_persona'];
        $nombre = $datos['nombre_usu'] ?? '';
        $apellido = $datos['apellido_usu'] ?? '';
        $email = $datos['email_usu'] ?? '';
        $localidad = $datos['localidad'] ?? '';
        $numero = $datos['telefono_usu'] ?? '';

        if (empty($nombre) || empty($apellido) || empty($email)) {
            echo json_encode(["error" => "Faltan campos obligatorios."]);
            exit;
        }

        $stmt = $conexion->prepare("UPDATE persona SET nombre_usu=?, apellido_usu=?, email_usu=?, localidad=?, telefono_usu=? WHERE id_persona=?");
        $stmt->bind_param("sssssi", $nombre, $apellido, $email, $localidad, $numero, $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["error" => "Error actualizando datos: " . $stmt->error]);
        }

        $stmt->close();
        break;

    case "DELETE":
        // Eliminar registro (se espera JSON)
        $datos = json_decode(file_get_contents("php://input"), true);

        if (!isset($datos['id_persona'])) {
            echo json_encode(["error" => "ID requerido para eliminar."]);
            exit;
        }

        $id = $datos['id_persona'];

        $stmt = $conexion->prepare("DELETE FROM persona WHERE id_persona = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["error" => "Error eliminando datos: " . $stmt->error]);
        }

        $stmt->close();
        break;

    default:
        echo json_encode(["error" => "Método no soportado"]);
        break;
}

$conexion->close();
?>
