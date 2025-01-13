<?php
// Iniciar la sesión
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['curp']) || empty($data['contrasena'])) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos']);
    exit;
}

// Escapar entradas para evitar inyecciones SQL
$curp = $conn->real_escape_string($data['curp']);
$contrasena = $data['contrasena'];

// Consultar la base de datos
$query = "SELECT curp, contrasena, nombre, primer_ap, segundo_ap, id_rol FROM usuarios WHERE curp = '$curp'";
$result = $conn->query($query);

// Verificar si el usuario existe
if ($result && $result->num_rows > 0) {
    $userData = $result->fetch_assoc();

    // Verificar si el usuario tiene una contraseña establecidas
    if (!empty($userData['contrasena'])) {
        // Validar contraseña cifrada
        if (password_verify($contrasena, $userData['contrasena'])) {
            // Crear la sesión
            $_SESSION['user_id'] = $userData['curp'];
            $_SESSION['nombre'] = $userData['nombre'] . ' ' . $userData['primer_ap'] . ' ' . $userData['segundo_ap'];
            $_SESSION['rol'] = $userData['id_rol'];

            // Responder con éxito1
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
        echo json_encode(['status' => 'error', 'message' => 'El usuario no tiene una cuenta activa']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
}

// Cerrar conexión
$conn->close();
?>