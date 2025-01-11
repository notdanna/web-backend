<?php
// Configuración inicial
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Cambia * a tu dominio en producción
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/auth.php';

// Verificar si hay un CURP específico
$curp = isset($_GET['curp']) ? $conn->real_escape_string($_GET['curp']) : null;

// Consulta para obtener todos los usuarios o un usuario específico
if ($curp) {
    $query = "SELECT curp, numero_empleado, nombre, primer_ap, segundo_ap, id_rol FROM usuarios WHERE curp = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $curp);
} else {
    $query = "SELECT curp, numero_empleado, nombre, primer_ap, segundo_ap, id_rol FROM usuarios";
    $stmt = $conn->prepare($query);
}

// Ejecutar la consulta
$stmt->execute();
$result = $stmt->get_result();

// Verificar si hay resultados
if ($result && $result->num_rows > 0) {
    $usuarios = [];
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }

    echo json_encode(['status' => 'success', 'data' => $usuarios]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se encontraron registros']);
}

// Cerrar conexión
$conn->close();
?>
