<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../api/tools/connect.php';

// Verificar si el usuario tiene sesión válida
if (empty($_SESSION['user_id']) || !in_array($_SESSION['rol'], [3, 2, 1])) {
    echo json_encode(['status' => 'error', 'message' => 'No tiene permisos para realizar esta acción']);
    exit;
}

// Leer datos del cuerpo de la solicitud
$input_raw = file_get_contents('php://input');
if (empty($input_raw)) {
    echo json_encode(['status' => 'error', 'message' => 'El cuerpo de la solicitud está vacío']);
    exit;
}

// Decodificar el JSON recibido
$input = json_decode($input_raw, true);

// Validar errores en la decodificación del JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al decodificar el JSON',
        'error' => json_last_error_msg()
    ]);
    exit;
}

// Validar CURP en el JSON decodificado
if (empty($input['curp'])) {
    echo json_encode(['status' => 'error', 'message' => 'El CURP es obligatorio']);
    exit;
}

$curp = $input['curp'];

try {
    // Obtener todas las peticiones del CURP especificado
    $query_peticiones = "
        SELECT p.id_peticion, p.curp_peticion, p.id_tramite, t.nombre_tramite, p.id_etapa, e.nombre_etapa, p.fecha_creacion
        FROM peticiones p
        INNER JOIN tramite t ON p.id_tramite = t.id_tramite
        INNER JOIN etapas e ON p.id_etapa = e.id_etapa
        WHERE p.curp_peticion = ?";
    $stmt_peticiones = $conn->prepare($query_peticiones);
    $stmt_peticiones->bind_param("s", $curp);
    $stmt_peticiones->execute();
    $result_peticiones = $stmt_peticiones->get_result();

    $peticiones = [];
    while ($row = $result_peticiones->fetch_assoc()) {
        // Convertir cada valor de la fila a UTF-8
        $peticiones[] = array_map(function ($value) {
            return mb_convert_encoding($value, 'UTF-8', 'auto');
        }, $row);
    }

    // Obtener el número de peticiones del CURP especificado
    $query_total = "SELECT COUNT(*) AS total_peticiones FROM peticiones WHERE curp_peticion = ?";
    $stmt_total = $conn->prepare($query_total);
    $stmt_total->bind_param("s", $curp);
    $stmt_total->execute();
    $result_total = $stmt_total->get_result();

    $total_peticiones = $result_total->fetch_assoc();
    $total_peticiones = mb_convert_encoding($total_peticiones['total_peticiones'], 'UTF-8', 'auto');

    // Preparar la respuesta
    $response = [
        'status' => 'success',
        'data' => [
            'peticiones' => $peticiones,
            'total_peticiones' => $total_peticiones
        ]
    ];

    // Codificar el JSON
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al procesar la solicitud',
        'error' => mb_convert_encoding($e->getMessage(), 'UTF-8', 'auto')
    ]);
    exit;
}
?>
