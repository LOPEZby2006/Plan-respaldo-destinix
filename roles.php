<?php

// Habilitar reporte de errores para debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers para CORS y JSON
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Responder a preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexión a la base de datos
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

// Clase del modelo Rol
class RolModel {
    private $conn;

    public function __construct($conexion) {
        $this->conn = $conexion;
    }

    public function getRoles() {
        $sql = "SELECT * FROM rol";
        return $this->conn->query($sql);
    }

    public function insertRol($tipo_rol) {
        $stmt = $this->conn->prepare("INSERT INTO rol (Tipo_Rol) VALUES (?)");
        if (!$stmt) {
            return false;
        }
        $stmt->bind_param("s", $tipo_rol);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }

    public function updateRol($id, $tipo_rol) {
        $stmt = $this->conn->prepare("UPDATE rol SET Tipo_Rol = ? WHERE idRol = ?");
        if (!$stmt) {
            return false;
        }
        $stmt->bind_param("si", $tipo_rol, $id);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }

    public function deleteRol($id) {
        $stmt = $this->conn->prepare("DELETE FROM rol WHERE idRol = ?");
        if (!$stmt) {
            return false;
        }
        $stmt->bind_param("i", $id);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }
}

// Instanciar modelo
$model = new RolModel($conn);

// Manejo de métodos HTTP
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $result = $model->getRoles();
            if (!$result) {
                throw new Exception("Error al obtener roles");
            }
            
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
            break;

        case 'POST':
            // CORRECCIÓN: Manejar tanto FormData como JSON
            $tipo_rol = null;
            
            // Verificar si es JSON
            $rawInput = file_get_contents("php://input");
            if (!empty($rawInput)) {
                $jsonData = json_decode($rawInput, true);
                if (json_last_error() === JSON_ERROR_NONE && isset($jsonData['Tipo_Rol'])) {
                    $tipo_rol = trim($jsonData['Tipo_Rol']);
                    error_log("POST JSON recibido: " . $rawInput);
                }
            }
            
            // Si no es JSON, verificar FormData
            if ($tipo_rol === null && isset($_POST['Tipo_Rol'])) {
                $tipo_rol = trim($_POST['Tipo_Rol']);
                error_log("POST FormData recibido: " . print_r($_POST, true));
            }

            if (empty($tipo_rol)) {
                http_response_code(400);
                echo json_encode(["error" => "Tipo de rol no proporcionado o vacío"]);
                exit();
            }

            $result = $model->insertRol($tipo_rol);
            if ($result) {
                echo json_encode([
                    "success" => true,
                    "message" => "Rol agregado correctamente",
                    "id" => $conn->insert_id
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "error" => "Error al insertar rol: " . $conn->error
                ]);
            }
            break;

        case 'PUT':
            $rawInput = file_get_contents("php://input");
            error_log("PUT Input recibido: " . $rawInput);
            
            $data = json_decode($rawInput, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(["error" => "JSON inválido: " . json_last_error_msg()]);
                exit();
            }

            $id = $data['idRol'] ?? null;
            $tipo_rol = trim($data['Tipo_Rol'] ?? '');

            if (!$id || empty($tipo_rol)) {
                http_response_code(400);
                echo json_encode([
                    "error" => "ID o tipo de rol faltantes",
                    "received" => $data
                ]);
                exit();
            }

            $result = $model->updateRol($id, $tipo_rol);
            if ($result) {
                echo json_encode([
                    "success" => true,
                    "message" => "Rol actualizado correctamente"
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "error" => "Error al actualizar rol: " . $conn->error
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

            $result = $model->deleteRol($id);
            if ($result) {
                echo json_encode([
                    "success" => true,
                    "message" => "Rol eliminado correctamente"
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "error" => "Error al eliminar rol: " . $conn->error
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