<?php
// Configuración inicial
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Cambia * a tu dominio en producción
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';
// include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/auth.php';

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que se haya proporcionado el CURP
if (empty($data['curp'])) {
    echo json_encode(['status' => 'error', 'message' => 'Falta el CURP del usuario a eliminar']);
    exit;
}

// Escapar o sanitizar los datos
$curp = $conn->real_escape_string($data['curp']);

// Obtener el rol del usuario
$query = "SELECT id_rol FROM usuarios WHERE curp = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $curp);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'No se encontró un usuario con ese CURP']);
    exit;
}

$user = $result->fetch_assoc();
$rol = $user['id_rol'];

// Eliminar registros relacionados según el rol
$conn->begin_transaction();

try {
    if ($rol == 3) { // Jefe de academia
        $deleteJefe = $conn->prepare("DELETE FROM jefes_academia WHERE curp_jef = ?");
        $deleteJefe->bind_param("s", $curp);
        $deleteJefe->execute();
    } elseif ($rol == 4) { // Docente
        $deleteDocente = $conn->prepare("DELETE FROM docentes WHERE curp_docente = ?");
        $deleteDocente->bind_param("s", $curp);
        $deleteDocente->execute();
    }

    // Eliminar el usuario principal
    $deleteUser = $conn->prepare("DELETE FROM usuarios WHERE curp = ?");
    $deleteUser->bind_param("s", $curp);
    $deleteUser->execute();

    if ($deleteUser->affected_rows > 0) {
        $conn->commit();
        echo json_encode(['status' => 'success', 'message' => 'Usuario y registros relacionados eliminados correctamente']);
    } else {
        $conn->rollback();
        echo json_encode(['status' => 'error', 'message' => 'No se pudo eliminar el usuario principal']);
    }
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el usuario', 'error' => $e->getMessage()]);
}

// Cerrar conexión
$conn->close();
?>
