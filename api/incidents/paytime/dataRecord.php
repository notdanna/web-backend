<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../api/tools/connect.php';

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Validar datos requeridos
if (
    empty($data['id_peticion']) || 
    empty($data['horarios'])
) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos obligatorios']);
    exit;
}

$id_peticion = (int)$data['id_peticion'];
$horarios = $data['horarios'];

// Verificar horas totales de reposición
$total_horas = 0;
foreach ($horarios as $horario) {
    $hora_inicio = strtotime($horario['hora_inicio']);
    $hora_fin = strtotime($horario['hora_fin']);
    $horas = ($hora_fin - $hora_inicio) / 3600;
    if ($horas <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'Horas inválidas en los horarios']);
        exit;
    }
    $total_horas += $horas;
}

// Consultar las horas faltantes de la petición
$query = "SELECT horas_faltantes FROM peticiones WHERE id_peticion = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id_peticion);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Petición no encontrada']);
    exit;
}

$data_peticion = $result->fetch_assoc();
$horas_faltantes = $data_peticion['horas_faltantes'];

if ($total_horas != $horas_faltantes) {
    echo json_encode(['status' => 'error', 'message' => 'Las horas propuestas no coinciden con las horas faltantes']);
    exit;
}

// Insertar los horarios
$query_horarios = "INSERT INTO horarios_reposicion (id_peticion, dia, hora_inicio, hora_fin, horas_cubiertas) VALUES (?, ?, ?, ?, ?)";
$stmt_horarios = $conn->prepare($query_horarios);

foreach ($horarios as $horario) {
    $dia = $horario['dia'];
    $hora_inicio = $horario['hora_inicio'];
    $hora_fin = $horario['hora_fin'];
    $horas_cubiertas = (strtotime($hora_fin) - strtotime($hora_inicio)) / 3600;
    $stmt_horarios->bind_param("isssi", $id_peticion, $dia, $hora_inicio, $hora_fin, $horas_cubiertas);
    $stmt_horarios->execute();
}

echo json_encode(['status' => 'success', 'message' => 'Horarios registrados correctamente']);
$conn->close();
?>
