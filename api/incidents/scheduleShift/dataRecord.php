<?php
session_start(); // Reanudar la sesión
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../api/tools/connect.php';

// Verificar si los datos de sesión están disponibles
if (empty($_SESSION['corrimiento'])) {
    echo json_encode(['status' => 'error', 'message' => 'No hay datos de sesión disponibles']);
    exit;
}

$data_sesion = $_SESSION['corrimiento'];
$id_peticion = $data_sesion['id_peticion'];
$horario = $data_sesion['horario'];

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id_peticion']) || empty($data['horarios'])) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos obligatorios']);
    exit;
}

// Verificar que el ID de la petición coincida con el de la sesión
if ($data['id_peticion'] != $id_peticion) {
    echo json_encode(['status' => 'error', 'message' => 'El ID de la petición no coincide con los datos de sesión']);
    exit;
}

$horarios = $data['horarios'];

// Insertar los nuevos horarios en la base de datos
$query_horarios = "INSERT INTO horarios_reposicion (id_peticion, dia, hora_inicio, hora_fin, horas_cubiertas) VALUES (?, ?, ?, ?, ?)";
$stmt_horarios = $conn->prepare($query_horarios);

foreach ($horarios as $horario) {
    $dia = $horario['dia'];
    $hora_inicio = $horario['hora_inicio'];
    $hora_fin = $horario['hora_fin'];
    $horas_cubiertas = 0; // Establecer horas cubiertas en 0
    $stmt_horarios->bind_param("isssi", $id_peticion, $dia, $hora_inicio, $hora_fin, $horas_cubiertas);
    $stmt_horarios->execute();
}

echo json_encode(['status' => 'success', 'message' => 'Horarios registrados correctamente']);
$conn->close();
?>
