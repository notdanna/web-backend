<?php
// Configuración inicial
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Cambia * a tu dominio en producción
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Content-Type');

include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que los datos necesarios estén presentes
if (empty($data['curp'])) {
    echo json_encode(['status' => 'error', 'message' => 'Falta el CURP del usuario a actualizar']);
    include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/auth.php';
    exit;
}

// Escapar o sanitizar los datos
$curp = $conn->real_escape_string($data['curp']);
$numero_empleado = isset($data['numero_empleado']) ? $conn->real_escape_string($data['numero_empleado']) : null;
$nombre = isset($data['nombre']) ? $conn->real_escape_string($data['nombre']) : null;
$primer_ap = isset($data['primer_ap']) ? $conn->real_escape_string($data['primer_ap']) : null;
$segundo_ap = isset($data['segundo_ap']) ? $conn->real_escape_string($data['segundo_ap']) : null;
$contrasena = isset($data['contrasena']) ? password_hash($data['contrasena'], PASSWORD_DEFAULT) : null;
$id_rol = isset($data['id_rol']) ? $conn->real_escape_string($data['id_rol']) : null;

// Construir consulta dinámica para actualizar solo los campos proporcionados
$fields_to_update = [];
if ($numero_empleado !== null) $fields_to_update[] = "numero_empleado = '$numero_empleado'";
if ($nombre !== null) $fields_to_update[] = "nombre = '$nombre'";
if ($primer_ap !== null) $fields_to_update[] = "primer_ap = '$primer_ap'";
if ($segundo_ap !== null) $fields_to_update[] = "segundo_ap = '$segundo_ap'";
if ($contrasena !== null) $fields_to_update[] = "contrasena = '$contrasena'";
if ($id_rol !== null) $fields_to_update[] = "id_rol = '$id_rol'";

if (empty($fields_to_update)) {
    echo json_encode(['status' => 'error', 'message' => 'No se proporcionaron campos para actualizar']);
    exit;
}

$fields_to_update_str = implode(", ", $fields_to_update);
$query = "UPDATE usuarios SET $fields_to_update_str WHERE curp = ?";

// Preparar y ejecutar la consulta
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $curp);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Usuario actualizado correctamente']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se realizaron cambios en el usuario']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el usuario', 'error' => $stmt->error]);
}

// Cerrar conexión
$conn->close();
?>
