<?php

// Conexión a la base de datos
$host = 'localhost';
$username = 'root';
$password = ''; // Contraseña de MySQL
$database = 'sapj_web';

$conn = new mysqli($host, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Error al conectar con la base de datos']);
    exit;
}