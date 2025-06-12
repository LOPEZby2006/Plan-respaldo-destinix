<?php

// Cabeceras para CORS y tipo de contenido
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Respuesta inmediata para preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexión a la base de datos
include "./conexion.php";

// MODELO
class EmpresaModel {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    public function getEmpresas() {
        $sql = "SELECT * FROM empresa";
        return $this->conexion->query($sql);
    }

    public function insertEmpresa($nombre, $direccion, $correo, $telefono, $persona_id, $id_categoria) {
        $stmt = $this->conexion->prepare("INSERT INTO empresa (nombre_emp, direccion_emp, correo_empresa, telefono_empresa, persona_id_persona, id_categoria) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssii", $nombre, $direccion, $correo, $telefono, $persona_id, $id_categoria);
        return $stmt->execute();
    }

    public function updateEmpresa($id, $nombre, $direccion, $correo, $telefono, $persona_id, $id_categoria) {
        $stmt = $this->conexion->prepare("UPDATE empresa SET nombre_emp = ?, direccion_emp = ?, correo_empresa = ?, telefono_empresa = ?, persona_id_persona = ?, id_categoria = ? WHERE id_empresa = ?");
        $stmt->bind_param("ssssiii", $nombre, $direccion, $correo, $telefono, $persona_id, $id_categoria, $id);
        return $stmt->execute();
    }

    public function deleteEmpresa($id) {
        $stmt = $this->conexion->prepare("DELETE FROM empresa WHERE id_empresa = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function getEmpresasIdNombre() {
        $sql = "SELECT id_empresa, nombre_emp AS nombre_empresa FROM empresa";
        return $this->conexion->query($sql);
    }
}

// CONTROLADOR
$model = new EmpresaModel($conexion);
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Detectar si se quiere acceder a ID y NOMBRE solamente
if ($method === 'GET' && strpos($uri, 'id-nombre') !== false) {
    $result = $model->getEmpresasIdNombre();
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit();
}

switch ($method) {
    case 'GET':
        $result = $model->getEmpresas();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;

    case 'POST':
        $nombre = $_POST['nombre_emp'] ?? null;
        $direccion = $_POST['direccion_emp'] ?? null;
        $correo = $_POST['correo_empresa'] ?? null;
        $telefono = $_POST['telefono_empresa'] ?? null;
        $persona_id = $_POST['persona_id_persona'] ?? null;
        $id_categoria = $_POST['id_categoria'] ?? null;

        if ($nombre && $direccion && $correo && $telefono && $persona_id && $id_categoria) {
            $result = $model->insertEmpresa($nombre, $direccion, $correo, $telefono, $persona_id, $id_categoria);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Datos incompletos"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id_empresa'] ?? null;
        $nombre = $data['nombre_emp'] ?? null;
        $direccion = $data['direccion_emp'] ?? null;
        $correo = $data['correo_empresa'] ?? null;
        $telefono = $data['telefono_empresa'] ?? null;
        $persona_id = $data['persona_id_persona'] ?? null;
        $id_categoria = $data['id_categoria'] ?? null;

        if ($id && $nombre && $direccion && $correo && $telefono && $persona_id && $id_categoria) {
            $result = $model->updateEmpresa($id, $nombre, $direccion, $correo, $telefono, $persona_id, $id_categoria);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Datos incompletos"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id !== null) {
            $result = $model->deleteEmpresa($id);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}
