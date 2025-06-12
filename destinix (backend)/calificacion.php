<?php
// Encabezados para CORS y tipo de contenido
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Preflight para solicitudes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexión a la base de datos
include "conexion.php";

// Clase del modelo
class CalificacionModel {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    public function getCalificaciones() {
        $sql = "SELECT * FROM calificacion";
        return $this->conexion->query($sql);
    }

    public function insertCalificacion($puntuacion) {
        $stmt = $this->conexion->prepare("INSERT INTO calificacion (puntuacion) VALUES (?)");
        $stmt->bind_param("d", $puntuacion); 
        return $stmt->execute();
    }

    public function updateCalificacion($id, $puntuacion) {
        $stmt = $this->conexion->prepare("UPDATE calificacion SET puntuacion = ? WHERE id_calificacion = ?");
        $stmt->bind_param("di", $puntuacion, $id); 
        return $stmt->execute();
    }

    public function deleteCalificacion($id) {
        $stmt = $this->conexion->prepare("DELETE FROM calificacion WHERE id_calificacion = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}

// Instanciar modelo
$model = new CalificacionModel($conexion);

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Manejo de peticiones
switch ($method) {
    case 'GET':
        $result = $model->getCalificaciones();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;

    case 'POST':
        $puntuacion = $_POST['puntuacion'] ?? null;

        if ($puntuacion !== null) {
            $result = $model->insertCalificacion($puntuacion);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Puntuación no proporcionada"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id_calificacion'] ?? null;
        $puntuacion = $data['puntuacion'] ?? null;

        if ($id && $puntuacion !== null) {
            $result = $model->updateCalificacion($id, $puntuacion);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "Datos incompletos"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($id !== null) {
            $result = $model->deleteCalificacion($id);
            echo json_encode(["success" => $result]);
        } else {
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}

// Cerrar conexión
$conexion->close();
?>
