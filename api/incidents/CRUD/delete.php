<?php
// Configuración inicial
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Cambia * a tu dominio en producción
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/auth.php';

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que se haya proporcionado el CURP
if (empty($data['curp'])) {
    echo json_encode(['status' => 'error', 'message' => 'Falta el CURP del usuario a eliminar']);
    exit;
}

// Escapar o sanitizar los datos
$curp = $conn->real_escape_string($data['curp']);

// Consulta para eliminar el usuario
$query = "DELETE FROM peticiones WHERE curp_peticion = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $curp);

// Ejecutar la consulta
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Usuario eliminado correctamente']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se encontró un usuario con ese CURP']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el usuario', 'error' => $stmt->error]);
}

// Cerrar conexión
$conn->close();
?>
