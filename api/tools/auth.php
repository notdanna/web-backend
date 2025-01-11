<?php
session_start();

// Verificar si el usuario está autenticado
if (!isset($_SESSION['rol'])) {
    echo json_encode(['status' => 'error', 'message' => 'Acceso no autorizado']);
    exit;
}

// Verificar si la sesión ha expirado
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) { // 30 minutos
    session_unset(); // Eliminar todas las variables de sesión
    session_destroy(); // Destruir la sesión actual
    echo json_encode(['status' => 'error', 'message' => 'Sesión expirada']);
    exit;
}
$_SESSION['last_activity'] = time(); // Actualizar el tiempo de actividad

// Verificar si el usuario tiene el rol de administrador (rol 1)
if ($_SESSION['rol'] != 1) {
    echo json_encode(['status' => 'error', 'message' => 'Permisos insuficientes']);
    exit;
}
?>
