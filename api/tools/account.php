<?php

// Verificar si el usuario tiene una contraseña, en caso de que si, tiene una cuenta activa, en caso de que no, no tiene una cuenta activa
// y debe de registrarse

include_once 'connect.php';

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Validar datos requeridos
if (empty($data['user_id']) || empty($data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos obligatorios']);
    exit;
}

$user_id = $conn->real_escape_string($data['user_id']);
$password = $conn->real_escape_string($data['password']);

// Verificar si el usuario ya tiene una contraseña
$query = "SELECT * FROM usuarios WHERE curp = ? AND password IS NOT NULL";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'El usuario no tiene una cuenta activa']);
    exit;
}

