<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://ambitious-forest-0ecbd371e.6.azurestaticapps.net");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

include "conexion.php";

$method = $_SERVER["REQUEST_METHOD"];
$inputData = json_decode(file_get_contents("php://input"), true);

// 📌 1. GET - Obtener todos los hoteles
if ($method === "GET") {
    $query = "SELECT * FROM hoteles";
    $resultado = $conexion->query($query);
    $data = [];

    if ($resultado->num_rows > 0) {
        while ($row = $resultado->fetch_assoc()) {
            // Construir la URL completa para la imagen
            if (!empty($row["img"])) {
                $row["img"] = "http://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/imagenes/" . $row["img"];
            }
            $data[] = $row;
        }
    }

    echo json_encode($data);
    exit;
}

// 📌 2. POST - Crear nuevo hotel con imagen
if ($method === "POST") {
    if (!isset($_FILES["img"])) {
        die(json_encode(["error" => "No se recibió ninguna imagen"]));
    }

    $uploadDir = "imagenes/";
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $fileTmpPath = $_FILES["img"]["tmp_name"];
    $fileName = basename($_FILES["img"]["name"]);
    $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedTypes = ["jpg", "jpeg", "png", "gif"];

    if (!in_array($fileType, $allowedTypes)) {
        die(json_encode(["error" => "Formato de imagen no permitido (jpg, jpeg, png, gif)"]));
    }

    $newFileName = uniqid() . "." . $fileType;
    $destPath = $uploadDir . $newFileName;

    if (!move_uploaded_file($fileTmpPath, $destPath)) {
        die(json_encode(["error" => "Error al guardar la imagen"]));
    }

    $titulo = $_POST["titulo_hotel"];
    $descripcion = $_POST["descripcion_hotel"];
    $estado = $_POST["estado_id_estado"];
    $empresa = $_POST["empresa_id_empresa"];


    $query = "INSERT INTO hoteles (titulo_hotel, img, descripcion_hotel, estado_id_estado, empresa_id_empresa)
              VALUES ('$titulo', '$newFileName', '$descripcion', '$estado', '$empresa')";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Hotel agregado con éxito", "img" => $newFileName]);
    } else {
        echo json_encode(["error" => "Error al guardar en la base de datos: " . $conexion->error]);
    }
    exit;
}

// 📌 3. PUT - Actualizar hotel (sin imagen)
if ($method === "PUT") {
    if (!$inputData || !isset($inputData["id_hoteles"])) {
        echo json_encode(["error" => "Datos incompletos para actualizar."]);
        exit;
    }

    $id = $inputData["id_hoteles"];
    $titulo = $inputData["titulo_hotel"];
    $descripcion = $inputData["descripcion_hotel"];
    $estado = $inputData["estado_id_estado"];
    $empresa = $inputData["empresa_id_empresa"];

    $query = "UPDATE hoteles SET 
                titulo_hotel='$titulo',
                descripcion_hotel='$descripcion', 
                estado_id_estado='$estado', 
                empresa_id_empresa='$empresa'
              WHERE id_hoteles=$id";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Hotel actualizado exitosamente."]);
    } else {
        echo json_encode(["error" => "Error al actualizar: " . $conexion->error]);
    }
    exit;
}

// 📌 4. DELETE - Eliminar hotel por ID
if ($method === "DELETE") {
    if (!$inputData || !isset($inputData["id_hoteles"])) {
        echo json_encode(["error" => "ID no proporcionado para eliminar."]);
        exit;
    }

    $id = $inputData["id_hoteles"];
    $query = "DELETE FROM hoteles WHERE id_hoteles=$id";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Hotel eliminado exitosamente."]);
    } else {
        echo json_encode(["error" => "Error al eliminar: " . $conexion->error]);
    }
    exit;
}

$conexion->close();
