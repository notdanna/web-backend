<?php
// Configuración inicial
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Cambia * a tu dominio en producción
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar datos requeridos
if (
    empty($data['curp']) || 
    empty($data['contrasena']) || 
    empty($data['nombre']) || 
    empty($data['primer_ap']) || 
    empty($data['numero_empleado'])
) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos']);
    exit;
}

// Escapar entradas para evitar inyecciones SQL
$curp = $conn->real_escape_string($data['curp']);
$contrasena = $data['contrasena'];
$nombre = $conn->real_escape_string($data['nombre']);
$primer_ap = $conn->real_escape_string($data['primer_ap']);
$numero_empleado = (int) $data['numero_empleado'];

// Consultar la base de datos
$query = "SELECT curp, contrasena, nombre, primer_ap, segundo_ap, numero_empleado, id_rol FROM usuarios WHERE curp = ? AND numero_empleado = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("si", $curp, $numero_empleado);
$stmt->execute();
$result = $stmt->get_result();

// Validar si el usuario existe
if ($result && $result->num_rows === 1) {
    $userData = $result->fetch_assoc();

    // Verificar si el nombre y el primer apellido coinciden
    if (
        strcasecmp($userData['nombre'], $nombre) !== 0 || 
        strcasecmp($userData['primer_ap'], $primer_ap) !== 0
    ) {
        echo json_encode(['status' => 'error', 'message' => 'Nombre o apellido incorrecto']);
        exit;
    }

    // Verificar si el usuario ya tiene una contraseña
    if (!empty($userData['contrasena'])) {
        // Validar la contraseña ingresada
        if (password_verify($contrasena, $userData['contrasena'])) {
            $_SESSION['user_id'] = $userData['curp'];
            $_SESSION['nombre'] = $userData['nombre'] . ' ' . $userData['primer_ap'] . ' ' . $userData['segundo_ap'];
            $_SESSION['rol'] = $userData['id_rol'];

            echo json_encode([
                'status' => 'success',
                'message' => 'Login exitoso',
                'user' => [
                    'curp' => $userData['curp'],
                    'nombre' => $_SESSION['nombre'],
                    'rol' => $userData['id_rol']
                ]
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Contraseña incorrecta']);
        }
    } else {
        // Asignar nueva contraseña
        $hashed_password = password_hash($contrasena, PASSWORD_DEFAULT);
        $updateQuery = "UPDATE usuarios SET contrasena = ? WHERE curp = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("ss", $hashed_password, $curp);

        if ($updateStmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Contraseña asignada correctamente']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al asignar la contraseña']);
        }
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
}

// Cerrar conexión
$conn->close();
?>
