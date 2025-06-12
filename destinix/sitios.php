<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ⚠️ CORS headers: cambiar * por el dominio permitido si se requiere
$allowedOrigin = "https://ambitious-forest-0ecbd371e.6.azurestaticapps.net";

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $allowedOrigin) {
    header("Access-Control-Allow-Origin: $allowedOrigin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// 🔁 Manejar preflight OPTIONS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204); // No Content
    exit;
}

$conexion = include "conexion.php";

$method = $_SERVER["REQUEST_METHOD"];
$inputData = json_decode(file_get_contents("php://input"), true);

// 📌 GET - Obtener todos los sitios turísticos
if ($method === "GET") {
    $query = "SELECT * FROM sitio_turistico";
    $resultado = $conexion->query($query);
    $data = [];

    if ($resultado && $resultado->num_rows > 0) {
        while ($row = $resultado->fetch_assoc()) {
            if (!empty($row["img_sitio"])) {
                $row["img_sitio"] = "https://destinixweb-h7cxddbtb0duddbv.brazilsouth-01.azurewebsites.net/destinix/imagenes/" . $row["img_sitio"];
            }
            $data[] = $row;
        }
    }

    echo json_encode($data);
    exit;
}

// 📌 POST - Crear nuevo sitio turístico con imagen
if ($method === "POST") {
    if (!isset($_FILES["img_sitio"])) {
        echo json_encode(["error" => "No se recibió ninguna imagen."]);
        exit;
    }

    $uploadDir = "imagenes/";
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $fileTmpPath = $_FILES["img_sitio"]["tmp_name"];
    $fileName = basename($_FILES["img_sitio"]["name"]);
    $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedTypes = ["jpg", "jpeg", "png", "gif"];

    if (!in_array($fileType, $allowedTypes)) {
        echo json_encode(["error" => "Formato de imagen no permitido."]);
        exit;
    }

    $newFileName = uniqid() . "." . $fileType;
    $destPath = $uploadDir . $newFileName;

    if (!move_uploaded_file($fileTmpPath, $destPath)) {
        echo json_encode(["error" => "Error al guardar la imagen."]);
        exit;
    }

    $nombre = $_POST["nombre_sitio"];
    $ubicacion = $_POST["ubicacion_sitio"];
    $descripcion = $_POST["desc_sitio"];
    $persona = $_POST["persona_id_persona"];
    $estado = $_POST["estado_id_estado"];

    $query = "INSERT INTO sitio_turistico (nombre_sitio, img_sitio, ubicacion_sitio, desc_sitio, persona_id_persona, estado_id_estado)
              VALUES ('$nombre', '$newFileName', '$ubicacion', '$descripcion', '$persona', '$estado')";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Sitio turístico agregado con éxito", "img" => $newFileName]);
    } else {
        echo json_encode(["error" => "Error al guardar en la base de datos: " . $conexion->error]);
    }
    exit;
}

// 📌 PUT - Actualizar sitio turístico (sin imagen)
if ($method === "PUT") {
    if (!$inputData || !isset($inputData["id_sitio"])) {
        echo json_encode(["error" => "Datos incompletos para actualizar."]);
        exit;
    }

    $id = $inputData["id_sitio"];
    $nombre = $inputData["nombre_sitio"];
    $ubicacion = $inputData["ubicacion_sitio"];
    $descripcion = $inputData["desc_sitio"];
    $persona = $inputData["persona_id_persona"];
    $estado = $inputData["estado_id_estado"];

    $query = "UPDATE sitio_turistico SET 
                nombre_sitio='$nombre',
                ubicacion_sitio='$ubicacion', 
                desc_sitio='$descripcion', 
                persona_id_persona='$persona', 
                estado_id_estado='$estado'
              WHERE id_sitio=$id";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Sitio turístico actualizado exitosamente."]);
    } else {
        echo json_encode(["error" => "Error al actualizar: " . $conexion->error]);
    }
    exit;
}

// 📌 DELETE - Eliminar sitio turístico por ID
if ($method === "DELETE") {
    if (!$inputData || !isset($inputData["id_sitio"])) {
        echo json_encode(["error" => "ID no proporcionado para eliminar."]);
        exit;
    }

    $id = $inputData["id_sitio"];
    $query = "DELETE FROM sitio_turistico WHERE id_sitio=$id";

    if ($conexion->query($query) === TRUE) {
        echo json_encode(["mensaje" => "Sitio turístico eliminado exitosamente."]);
    } else {
        echo json_encode(["error" => "Error al eliminar: " . $conexion->error]);
    }
    exit;
}

$conexion->close();
?>
