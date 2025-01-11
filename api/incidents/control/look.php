<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../api/tools/connect.php';

// Verificar si el usuario tiene sesión y es jefe de academia
if (empty($_SESSION['user_id']) || $_SESSION['rol'] != 3) {
    // Responder con error, mostrar el rol actual del usuario
    echo json_encode(['status' => 'error', 'message' => 'No tiene permisos para realizar esta acción', 'rol' => $_SESSION['rol']]);
    exit;
}

$curp_jef = $_SESSION['user_id'];

// Obtener la academia del jefe
$query_academia = "SELECT id_academia FROM jefes_academia WHERE curp_jef = ?";
$stmt_academia = $conn->prepare($query_academia);
$stmt_academia->bind_param("s", $curp_jef);
$stmt_academia->execute();
$result_academia = $stmt_academia->get_result();

if ($result_academia->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'No se encontró la academia del jefe']);
    exit;
}

$data_academia = $result_academia->fetch_assoc();
$id_academia = $data_academia['id_academia'];

// Consultar las solicitudes de los docentes de la academia
$query_solicitudes = "SELECT p.*, u.nombre, u.primer_ap, u.segundo_ap
                      FROM peticiones p
                      JOIN usuarios u ON p.curp_peticion = u.curp
                      JOIN docentes d ON u.curp = d.curp_docente
                      WHERE d.id_academia = ? "; // WHERE d.id_academia = ? AND p.id_etapa = 1"; 

$stmt_solicitudes = $conn->prepare($query_solicitudes);
$stmt_solicitudes->bind_param("s", $id_academia);
$stmt_solicitudes->execute();
$result_solicitudes = $stmt_solicitudes->get_result();

$solicitudes = [];
while ($row = $result_solicitudes->fetch_assoc()) {
    $solicitudes[] = $row;
}

echo json_encode(['status' => 'success', 'data' => $solicitudes]);
?>
