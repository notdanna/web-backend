<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../api/tools/connect.php';

// Consultar todas las peticiones junto con los datos de los usuarios que las realizaron
$query_solicitudes = "SELECT p.*, 
                             u.nombre, 
                             u.primer_ap, 
                             u.segundo_ap, 
                             u.numero_empleado
                      FROM peticiones p
                      JOIN usuarios u ON p.curp_peticion = u.curp";

$stmt_solicitudes = $conn->prepare($query_solicitudes);
$stmt_solicitudes->execute();
$result_solicitudes = $stmt_solicitudes->get_result();

$solicitudes = [];
while ($row = $result_solicitudes->fetch_assoc()) {
    // Convertir cada campo al formato UTF-8 para asegurar la compatibilidad con multibyte
    foreach ($row as $key => $value) {
        $row[$key] = mb_convert_encoding($value, 'UTF-8', 'auto');
    }
    $solicitudes[] = $row;
}

// Responder con los datos encontrados en formato UTF-8
echo json_encode(['status' => 'success', 'data' => $solicitudes], JSON_UNESCAPED_UNICODE);
?>
