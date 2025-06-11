<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'destinix';
$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Conexión fallida: " . $conn->connect_error]);
    exit();
}

class EstadoModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getEstados() {
        // CORRECCIÓN: Sin alias, devolver desc_estado tal como espera el frontend
        $sql = "SELECT id_estado, desc_estado FROM estado ORDER BY id_estado ASC";
        return $this->conn->query($sql);
    }

    public function insertEstado($desc_estado) {
        $stmt = $this->conn->prepare("INSERT INTO estado (desc_estado) VALUES (?)");
        if (!$stmt) {
            return false;
        }
        $stmt->bind_param("s", $desc_estado);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }

    public function updateEstado($id, $desc_estado) {
        $stmt = $this->conn->prepare("UPDATE estado SET desc_estado = ? WHERE id_estado = ?");
        if (!$stmt) {
            return false;
        }
        $stmt->bind_param("si", $desc_estado, $id);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }

    public function deleteEstado($id) {
        $stmt = $this->conn->prepare("DELETE FROM estado WHERE id_estado = ?");
        if (!$stmt) {
            return false;
        }
        $stmt->bind_param("i", $id);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }
}

$model = new EstadoModel($conn);

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $result = $model->getEstados();
            if (!$result) {
                throw new Exception("Error al obtener estados");
            }
            
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }

            echo json_encode($data);
            break;

        case 'POST':
            $rawInput = file_get_contents("php://input");
            error_log("POST Input recibido: " . $rawInput); // Para debug
            
            $data = json_decode($rawInput, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(["error" => "JSON inválido: " . json_last_error_msg()]);
                exit();
            }

            if (!is_array($data)) {
                http_response_code(400);
                echo json_encode(["error" => "Datos no válidos"]);
                exit();
            }

            $desc_estado = trim($data['desc_estado'] ?? '');

            if (empty($desc_estado)) {
                http_response_code(400);
                echo json_encode(["error" => "Descripción no proporcionada o vacía"]);
                exit();
            }

            $result = $model->insertEstado($desc_estado);
            if ($result) {
                echo json_encode([
                    "success" => true, 
                    "message" => "Estado agregado correctamente",
                    "id" => $conn->insert_id
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "error" => "Error al insertar estado: " . $conn->error
                ]);
            }
            break;

        case 'PUT':
            $rawInput = file_get_contents("php://input");
            $data = json_decode($rawInput, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(["error" => "JSON inválido: " . json_last_error_msg()]);
                exit();
            }

            $id = $data['id_estado'] ?? null;
            $desc_estado = trim($data['desc_estado'] ?? '');

            if (!$id || empty($desc_estado)) {
                http_response_code(400);
                echo json_encode(["error" => "ID o descripción faltantes"]);
                exit();
            }

            $result = $model->updateEstado($id, $desc_estado);
            if ($result) {
                echo json_encode([
                    "success" => true, 
                    "message" => "Estado actualizado correctamente"
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "error" => "Error al actualizar estado: " . $conn->error
                ]);
            }
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;

            if ($id === null || $id === '') {
                http_response_code(400);
                echo json_encode(["error" => "ID no proporcionado"]);
                exit();
            }

            $result = $model->deleteEstado($id);
            if ($result) {
                echo json_encode([
                    "success" => true, 
                    "message" => "Estado eliminado correctamente"
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "error" => "Error al eliminar estado: " . $conn->error
                ]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Método no permitido"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error del servidor: " . $e->getMessage()]);
} finally {
    $conn->close();
}

?>