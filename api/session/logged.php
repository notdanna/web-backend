<?php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Cambia por el origen del frontend
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Sesión no activa']);
    exit;
}

// Si la sesión está activa, responder con los datos del usuario
echo json_encode([
    'status' => 'success',
    'message' => 'Sesión activa',
    'user' => [
        'id' => $_SESSION['user_id'],
        'nombre' => $_SESSION['nombre'],
        'rol' => $_SESSION['rol']
    ]
]);

/*
const checkSession = async () => {
    try {
        const response = await fetch("http://localhost/proyecto-backend/check_session.php");
        const data = await response.json();
        
        if (data.status === "success") {
            console.log("Sesión activa:", data.user);
        } else {
            console.log("No hay sesión activa.");
            // React maneja la redirección
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Error al verificar la sesión:", error);
    }
};

checkSession();

*/




?>



