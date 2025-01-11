<?php
session_start();

// Verificar si el usuario está autenticado
if (!isset($_SESSION['rol'])) {
    echo json_encode(['status' => 'error', 'message' => 'Acceso no autorizado']);
    exit;
}

// Verificar si el usuario tiene el rol de administrador (rol 1)
if ($_SESSION['rol'] != 1) {
    echo json_encode(['status' => 'error', 'message' => 'Permisos insuficientes']);
    exit;
}
?>
