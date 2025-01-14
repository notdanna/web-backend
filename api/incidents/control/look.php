<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../api/tools/connect.php';

// Verificar si el usuario tiene sesión activa
// if (empty($_SESSION['user_id'])) {
//     echo json_encode(['status' => 'error', 'message' => 'Sesión no iniciada']);
//     exit;
// }

// Leer el cuerpo de la solicitud
$input = json_decode(file_get_contents('php://input'), true);

// Validar que se proporcione el CURP
if (empty($input['curp'])) {
    echo json_encode(['status' => 'error', 'message' => 'CURP no proporcionado']);
    exit;
}

$curp_jef = $input['curp'];

// Obtener la academia asociada al CURP del jefe
$query_academia = "SELECT id_academia FROM jefes_academia WHERE curp_jef = ?";
$stmt_academia = $conn->prepare($query_academia);
$stmt_academia->bind_param("s", $curp_jef);
$stmt_academia->execute();
$result_academia = $stmt_academia->get_result();

// Validar si se encontró la academia
if ($result_academia->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'No se encontró una academia para el CURP proporcionado']);
    exit;
}

$data_academia = $result_academia->fetch_assoc();
$id_academia = $data_academia['id_academia'];

// Consultar las solicitudes de los docentes de la academia
$query_solicitudes = "SELECT p.*, 
                             u.nombre, 
                             u.primer_ap, 
                             u.segundo_ap, 
                             u.numero_empleado
                      FROM peticiones p
                      JOIN usuarios u ON p.curp_peticion = u.curp
                      JOIN docentes d ON u.curp = d.curp_docente
                      WHERE d.id_academia = ?";

$stmt_solicitudes = $conn->prepare($query_solicitudes);
$stmt_solicitudes->bind_param("s", $id_academia);
$stmt_solicitudes->execute();
$result_solicitudes = $stmt_solicitudes->get_result();

$solicitudes = [];
while ($row = $result_solicitudes->fetch_assoc()) {
    $solicitudes[] = $row;
}

// Responder con los datos encontrados
echo json_encode(['status' => 'success', 'data' => $solicitudes]);
?>
