<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../api/tools/connect.php';

// Verificar si el usuario tiene sesión y rol autorizado
if (empty($_SESSION['user_id']) || !in_array($_SESSION['rol'], [3, 2, 1])) { // Jefe de academia (3) o Capital Humano (2) o Administrador (1)
    echo json_encode(['status' => 'error', 'message' => 'Acceso no autorizado']);
    exit;
}

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id_peticion']) || empty($data['accion'])) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos obligatorios']);
    exit;
}

$id_peticion = (int)$data['id_peticion'];
$accion = $data['accion']; // "pendiente", "aprobar_jefe", "rechazar_jefe", "aprobar_capital", "rechazar_capital"

// Validar la acción
$acciones_permitidas = ['pendiente', 'aprobar_jefe', 'rechazar_jefe', 'aprobar_capital', 'rechazar_capital'];
if (!in_array($accion, $acciones_permitidas)) {
    echo json_encode(['status' => 'error', 'message' => 'Acción no permitida']);
    exit;
}

// Determinar el nuevo estado basado en la acción
$nuevo_estado = null;
switch ($accion) {
    case 'pendiente':
        $nuevo_estado = 2; // Cambiar a "Pendiente"
        break;
    case 'aprobar_jefe':
        $nuevo_estado = 3; // Cambiar a "Aprobado por Jefe Academia"
        break;
    case 'rechazar_jefe':
        $nuevo_estado = 4; // Cambiar a "Rechazado por Jefe Academia"
        break;
    case 'aprobar_capital':
        $nuevo_estado = 5; // Cambiar a "Aprobado por Capital Humano"
        break;
    case 'rechazar_capital':
        $nuevo_estado = 6; // Cambiar a "Rechazado por Capital Humano"
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Acción no válida']);
        exit;
}

// Actualizar el estado de la solicitud
$query_update = "UPDATE peticiones SET id_etapa = ? WHERE id_peticion = ?";
$stmt_update = $conn->prepare($query_update);
$stmt_update->bind_param("ii", $nuevo_estado, $id_peticion);

if ($stmt_update->execute()) {
    $mensaje = '';
    switch ($nuevo_estado) {
        case 2:
            $mensaje = 'Solicitud marcada como Pendiente';
            break;
        case 3:
            $mensaje = 'Solicitud aprobada por Jefe de Academia';
            break;
        case 4:
            $mensaje = 'Solicitud rechazada por Jefe de Academia';
            break;
        case 5:
            $mensaje = 'Solicitud aprobada por Capital Humano';
            break;
        case 6:
            $mensaje = 'Solicitud rechazada por Capital Humano';
            break;
    }
    echo json_encode(['status' => 'success', 'message' => $mensaje]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar la solicitud']);
}

$conn->close();
?>
