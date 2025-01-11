<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/auth.php';

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que los datos necesarios estén presentes
if (empty($data['curp']) || empty($data['numero_empleado']) || empty($data['nombre']) || empty($data['primer_ap']) || empty($data['contrasena']) || empty($data['id_rol'])) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos necesarios']);
    exit;
}

// Escapar o sanitizar los datos
$curp = $conn->real_escape_string($data['curp']);
$numero_empleado = $conn->real_escape_string($data['numero_empleado']);
$nombre = $conn->real_escape_string($data['nombre']);
$primer_ap = $conn->real_escape_string($data['primer_ap']);
$segundo_ap = !empty($data['segundo_ap']) ? $conn->real_escape_string($data['segundo_ap']) : null; // Campo opcional
$contrasena = password_hash($data['contrasena'], PASSWORD_DEFAULT); // Cifrar la contraseña
$id_rol = $conn->real_escape_string($data['id_rol']);

// Crear consulta preparada
$query = "INSERT INTO usuarios (curp, numero_empleado, nombre, primer_ap, segundo_ap, contrasena, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("sissssi", $curp, $numero_empleado, $nombre, $primer_ap, $segundo_ap, $contrasena, $id_rol);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Usuario creado correctamente']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al crear el usuario', 'error' => $stmt->error]);
}

// Cerrar conexión
$conn->close();
?>