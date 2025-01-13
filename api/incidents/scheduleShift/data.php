<?php
session_start(); // Iniciar la sesión
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../api/tools/connect.php';

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'Error en el formato del JSON']);
    exit;
}

// Validar datos requeridos
if (
    empty($data['curp_peticion']) || 
    empty($data['rol_origen']) || 
    empty($data['rol_destino']) || 
    empty($data['id_tramite']) || 
    empty($data['horario']) || 
    empty($data['descripcion_incidencia'])
) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos obligatorios']);
    exit;
}

$curp_peticion = $conn->real_escape_string($data['curp_peticion']);
$rol_origen = (int)$data['rol_origen'];
$rol_destino = (int)$data['rol_destino'];
$id_tramite = (int)$data['id_tramite'];
$horario = $data['horario'];
$dia = $conn->real_escape_string($horario['dia']);
$hora_inicio = $conn->real_escape_string($horario['hora_inicio']);
$hora_fin = $conn->real_escape_string($horario['hora_fin']);
$descripcion_incidencia = $conn->real_escape_string($data['descripcion_incidencia']);
$horas_faltantes = 0; // Asignar 0 porque se cubrirán en el mismo día
$link_pdf = ''; // Se generará después

// Insertar la petición en la base de datos
$query = "INSERT INTO peticiones (curp_peticion, rol_origen, rol_destino, id_tramite, link_pdf, fecha_incidencia, descripcion_incidencia, horas_faltantes, id_etapa, fecha_creacion) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())";

$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la consulta', 'error' => $conn->error]);
    exit;
}

$stmt->bind_param("siissssi", $curp_peticion, $rol_origen, $rol_destino, $id_tramite, $link_pdf, $dia, $descripcion_incidencia, $horas_faltantes);

if ($stmt->execute()) {
    $id_peticion = $stmt->insert_id;

    // Generar el link del PDF
    $base_url = "http://localhost/web-backend/api/incidents/scheduleShift/pdf/PDF_Schedule.php";
    $link_pdf = $base_url . "?id_peticion=" . $id_peticion;

    // Actualizar el link del PDF en la base de datos
    $update_query = "UPDATE peticiones SET link_pdf = ? WHERE id_peticion = ?";
    $update_stmt = $conn->prepare($update_query);

    if (!$update_stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la actualización del link', 'error' => $conn->error]);
        exit;
    }

    $update_stmt->bind_param("si", $link_pdf, $id_peticion);
    $update_stmt->execute();

    // Guardar los datos en sesión
    $_SESSION['corrimiento'] = [
        'id_peticion' => $id_peticion,
        'horario' => [
            'dia' => $dia,
            'hora_inicio' => $hora_inicio,
            'hora_fin' => $hora_fin,
        ],
        'descripcion_incidencia' => $descripcion_incidencia
    ];

    echo json_encode([
        'status' => 'success',
        'message' => 'Petición creada correctamente',
        'id_peticion' => $id_peticion,
        'link_pdf' => $link_pdf
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al crear la petición', 'error' => $stmt->error]);
}

$conn->close();
?>
