<?php
session_start();

header("Access-Control-Allow-Origin: http://ambitious-forest-0ecbd371e.6.azurestaticapps.net");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "conexion.php";

$method = $_SERVER['REQUEST_METHOD'];

if (!isset($_SESSION['id_persona'])) {
    echo json_encode(["error" => "Sesión no válida"]);
    exit;
}

$id_persona = $_SESSION['id_persona'];

if ($method === "GET") {
    $query = "
        SELECT p.*, 
               e.nombre_emp, e.direccion_emp, e.correo_empresa, e.telefono_empresa, e.id_categoria,
               c.nombre_cate
        FROM persona p
        LEFT JOIN empresa e ON p.id_persona = e.persona_id_persona
        LEFT JOIN categoria c ON e.id_categoria = c.id_categoria
        WHERE p.id_persona = '$id_persona'";
    
    $result = $conexion->query($query);
    $data = $result->fetch_assoc();

    if (!empty($data['foto_perfil'])) {
        $data['foto_perfil'] = "http://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/imagenes/" . $data['foto_perfil'];
    }

    echo json_encode($data);
    exit;
}

if ($method === "POST") {
    $nombre = $_POST['nombre_usu'] ?? '';
    $apellido = $_POST['apellido_usu'] ?? '';
    $email = $_POST['email_usu'] ?? '';
    $telefono = $_POST['telefono_usu'] ?? '';
    $localidad = $_POST['localidad'] ?? '';
    $foto_perfil = null;

    $nombre_emp = $_POST['nombre_emp'] ?? '';
    $direccion_emp = $_POST['direccion_emp'] ?? '';
    $correo_emp = $_POST['correo_empresa'] ?? '';
    $telefono_emp = $_POST['telefono_empresa'] ?? '';
    $id_categoria = $_POST['id_categoria'] ?? '';

    // Datos para soporte de pago
    $restaurante_id = $_POST['restaurante_id'] ?? null;
    $sitio_id = $_POST['sitio_id'] ?? null;
    $hotel_id = $_POST['hotel_id'] ?? null;
    $estado_id = $_POST['estado_id'] ?? null;
    $empresa_id = $_POST['empresa_id'] ?? null;
    $imagen_soporte = null;

    if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/imagenes/';
        $fileName = uniqid() . '_' . basename($_FILES['foto_perfil']['name']);
        $uploadFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['foto_perfil']['tmp_name'], $uploadFile)) {
            $foto_perfil = $fileName;
        } else {
            echo json_encode(["error" => "Error subiendo imagen de perfil"]);
            exit;
        }
    }

    if (isset($_FILES['imagen_soporte']) && $_FILES['imagen_soporte']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/imagenes/';
        $fileNameSoporte = uniqid() . '_' . basename($_FILES['imagen_soporte']['name']);
        $uploadFileSoporte = $uploadDir . $fileNameSoporte;

        if (move_uploaded_file($_FILES['imagen_soporte']['tmp_name'], $uploadFileSoporte)) {
            $imagen_soporte = $fileNameSoporte;
        } else {
            echo json_encode(["error" => "Error subiendo imagen de soporte de pago"]);
            exit;
        }
    }

    $conexion->begin_transaction();

    try {
        // Actualización de persona
        $sqlPersona = $foto_perfil ?
            "UPDATE persona SET nombre_usu='$nombre', apellido_usu='$apellido', email_usu='$email', telefono_usu='$telefono', localidad='$localidad', foto_perfil='$foto_perfil' WHERE id_persona='$id_persona'" :
            "UPDATE persona SET nombre_usu='$nombre', apellido_usu='$apellido', email_usu='$email', telefono_usu='$telefono', localidad='$localidad' WHERE id_persona='$id_persona'";
        
        $conexion->query($sqlPersona);

        // Actualización de empresa
        $sqlEmpresa = "
            UPDATE empresa SET 
                nombre_emp='$nombre_emp', direccion_emp='$direccion_emp', 
                correo_empresa='$correo_emp', telefono_empresa='$telefono_emp', 
                id_categoria='$id_categoria' 
            WHERE persona_id_persona='$id_persona'
        ";

        $conexion->query($sqlEmpresa);

        // Inserción en soporte_pagos (si se subió un soporte)
        if ($imagen_soporte) {
            $stmt = $conexion->prepare("
                INSERT INTO soporte_pagos (
                    imagen_soporte, id_empresa, id_persona, 
                    restaurante_id, sitio_id, hotel_id, estado_id, empresa_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->bind_param(
                "siiiiiii",
                $imagen_soporte,
                $empresa_id,
                $id_persona,
                $restaurante_id,
                $sitio_id,
                $hotel_id,
                $estado_id,
                $empresa_id // Puedes omitir esta si ya está en id_empresa
            );

            $stmt->execute();
            $stmt->close();
        }

        $conexion->commit();

        echo json_encode([
            "success" => true,
            "foto_perfil" => $foto_perfil ? "http://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/imagenes/$foto_perfil" : null,
            "imagen_soporte" => $imagen_soporte ? "http://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/imagenes/$imagen_soporte" : null
        ]);
    } catch (Exception $e) {
        $conexion->rollback();
        echo json_encode(["error" => "Error actualizando datos: " . $e->getMessage()]);
    }
}
?>
