<?php
// Configuración inicial
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que se haya proporcionado el CURP
if (empty($data['curp'])) {
    echo json_encode(['status' => 'error', 'message' => 'Falta el CURP del usuario a actualizar']);
    exit;
}

// Escapar o sanitizar los datos
$curp = $conn->real_escape_string($data['curp']);
$rol = isset($data['rol']) ? $data['rol'] : null;

// Validar el rol
if (!$rol) {
    echo json_encode(['status' => 'error', 'message' => 'Falta el rol del usuario']);
    exit;
}

// Actualizar según el rol
$conn->begin_transaction();

try {
    if ($rol == 3 && isset($data['id_academia'])) { // Jefe de academia
        $id_academia = $conn->real_escape_string($data['id_academia']);
        $query_jefe = "UPDATE jefes_academia SET id_academia = ? WHERE curp_jef = ?";
        $stmt_jefe = $conn->prepare($query_jefe);
        $stmt_jefe->bind_param("ss", $id_academia, $curp);
        $stmt_jefe->execute();
    } elseif ($rol == 4 && isset($data['id_academia'], $data['curp_jef'])) { // Docente
        $id_academia = $conn->real_escape_string($data['id_academia']);
        $curp_jef = $conn->real_escape_string($data['curp_jef']);
        $query_docente = "UPDATE docentes SET id_academia = ?, curp_jef = ? WHERE curp_docente = ?";
        $stmt_docente = $conn->prepare($query_docente);
        $stmt_docente->bind_param("sss", $id_academia, $curp_jef, $curp);
        $stmt_docente->execute();
    }

    // Actualizar los campos generales del usuario
    $fields_to_update = [];
    if (isset($data['nombre'])) $fields_to_update[] = "nombre = '{$conn->real_escape_string($data['nombre'])}'";
    if (isset($data['primer_ap'])) $fields_to_update[] = "primer_ap = '{$conn->real_escape_string($data['primer_ap'])}'";
    if (isset($data['segundo_ap'])) $fields_to_update[] = "segundo_ap = '{$conn->real_escape_string($data['segundo_ap'])}'";
    if (isset($data['contrasena'])) $fields_to_update[] = "contrasena = '" . password_hash($data['contrasena'], PASSWORD_DEFAULT) . "'";
    if (!empty($fields_to_update)) {
        $fields_to_update_str = implode(", ", $fields_to_update);
        $query_user = "UPDATE usuarios SET $fields_to_update_str WHERE curp = ?";
        $stmt_user = $conn->prepare($query_user);
        $stmt_user->bind_param("s", $curp);
        $stmt_user->execute();
    }

    $conn->commit();
    echo json_encode(['status' => 'success', 'message' => 'Usuario y registros relacionados actualizados correctamente']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el usuario', 'error' => $e->getMessage()]);
}

// Cerrar conexión
$conn->close();
?>
