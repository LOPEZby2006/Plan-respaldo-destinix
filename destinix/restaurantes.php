<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: https://ambitious-forest-0ecbd371e.6.azurestaticapps.net");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Manejo de preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

$conexion = include "conexion.php"; // ⚠️ IMPORTANTE: DEBE retornar $conexion

if (!$conexion) {
    echo json_encode(["error" => "Error al conectar con la base de datos"]);
    exit;
}

$method = $_SERVER["REQUEST_METHOD"];
$inputData = json_decode(file_get_contents("php://input"), true);

// 📌 1. GET - Obtener todos los restaurantes
if ($method === "GET") {
    $query = "SELECT * FROM restaurantes";
    $resultado = $conexion->query($query);
    $data = [];

    if ($resultado && $resultado->num_rows > 0) {
        while ($row = $resultado->fetch_assoc()) {
            if (!empty($row["img"])) {
                $row["img"] = "https://destinixweb-h7cxddbtb0duddbv.brazilsouth-01.azurewebsites.net/destinix/imagenes/" . $row["img"];
            }
            $data[] = $row;
        }
    }

    echo json_encode($data);
    exit;
}

// 📌 2. POST - Crear nuevo restaurante con imagen
if ($method === "POST") {
    if (!isset($_FILES["img"])) {
        echo json_encode(["error" => "No se recibió ninguna imagen"]);
        exit;
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
        echo json_encode(["error" => "Formato de imagen no permitido (jpg, jpeg, png, gif)"]);
        exit;
    }

    $newFileName = uniqid() . "." . $fileType;
    $destPath = $uploadDir . $newFileName;

    if (!move_uploaded_file($fileTmpPath, $destPath)) {
        echo json_encode(["error" => "Error al guardar la imagen"]);
        exit;
    }

    $titulo = $_POST["titulo_restaurante"];
    $descripcion = $_POST["desc_restaurantes"];
    $estado = $_POST["estado_id_estado"];
    $empresa = $_POST["empresa_id_empresa"];

    $query = "INSERT INTO restaurantes (titulo_restaurante, img, desc_restaurantes, estado_id_estado, empresa_id_empresa)
              VALUES ('$titulo', '$newFileName', '$descripcion', '$estado', '$empresa')";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Restaurante agregado con éxito", "img" => $newFileName]);
    } else {
        echo json_encode(["error" => "Error al guardar en la base de datos: " . $conexion->error]);
    }
    exit;
}

// 📌 3. PUT - Actualizar restaurante (sin imagen)
if ($method === "PUT") {
    if (!$inputData || !isset($inputData["id_restaurante"])) {
        echo json_encode(["error" => "Datos incompletos para actualizar."]);
        exit;
    }

    $id = $inputData["id_restaurante"];
    $titulo = $inputData["titulo_restaurante"];
    $descripcion = $inputData["desc_restaurantes"];
    $estado = $inputData["estado_id_estado"];
    $empresa = $inputData["empresa_id_empresa"];

    $query = "UPDATE restaurantes SET 
                titulo_restaurante='$titulo',
                desc_restaurantes='$descripcion', 
                estado_id_estado='$estado', 
                empresa_id_empresa='$empresa'
              WHERE id_restaurante=$id";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Restaurante actualizado exitosamente."]);
    } else {
        echo json_encode(["error" => "Error al actualizar: " . $conexion->error]);
    }
    exit;
}

// 📌 4. DELETE - Eliminar restaurante por ID
if ($method === "DELETE") {
    if (!$inputData || !isset($inputData["id_restaurante"])) {
        echo json_encode(["error" => "ID no proporcionado para eliminar."]);
        exit;
    }

    $id = $inputData["id_restaurante"];
    $query = "DELETE FROM restaurantes WHERE id_restaurante=$id";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Restaurante eliminado exitosamente."]);
    } else {
        echo json_encode(["error" => "Error al eliminar: " . $conexion->error]);
    }
    exit;
}

// 🚫 Si el método no es válido
echo json_encode(["error" => "Método no permitido"]);
$conexion->close();
?>
