<?php
// Configuración inicial
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que se haya proporcionado el CURP
if (empty($data['curp'])) {
    echo json_encode(['status' => 'error', 'message' => 'Falta el CURP']);
    exit;
}

// Escapar o sanitizar los datos
$curp = $conn->real_escape_string($data['curp']);

// Consultar el rol del usuario
$query = "SELECT id_rol FROM usuarios WHERE curp = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $curp);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode(['status' => 'success', 'rol' => $user['id_rol']]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
}

// Cerrar conexión
$conn->close();
?>
