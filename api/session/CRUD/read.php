<?php
header('Content-Type: application/json');
include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';

// Asegurar que la conexión use UTF-8
$conn->set_charset("utf8mb4");

// Verificar si hay un CURP específico
$curp = isset($_GET['curp']) ? $conn->real_escape_string($_GET['curp']) : null;

if ($curp) {
    // Consulta para un usuario específico
    $query = "SELECT curp, numero_empleado, nombre, primer_ap, segundo_ap, id_rol FROM usuarios WHERE curp = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $curp);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $usuario = $result->fetch_assoc();

        // Convertir los datos a UTF-8
        foreach ($usuario as $key => $value) {
            $usuario[$key] = mb_convert_encoding($value, 'UTF-8', 'auto');
        }

        echo json_encode(['status' => 'success', 'data' => $usuario]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se encontró el usuario especificado']);
    }
} else {
    // Consulta para obtener todos los usuarios
    $query = "SELECT curp, numero_empleado, nombre, primer_ap, segundo_ap, id_rol FROM usuarios";
    $result = $conn->query($query);

    if ($result && $result->num_rows > 0) {
        $usuarios = [];

        while ($row = $result->fetch_assoc()) {
            // Convertir cada valor a UTF-8
            foreach ($row as $key => $value) {
                $row[$key] = mb_convert_encoding($value, 'UTF-8', 'auto');
            }
            $usuarios[] = $row;
        }

        echo json_encode(['status' => 'success', 'data' => $usuarios]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se encontraron registros']);
    }
}

$conn->close();
?>
