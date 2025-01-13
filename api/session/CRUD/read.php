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

        // Verificar el rol y realizar consultas adicionales
        if ($usuario['id_rol'] == 4) {
            // Consulta para obtener datos adicionales de `docentes`
            $query_docente = "SELECT id_academia, curp_jef, permisos_anuales FROM docentes WHERE curp_docente = ?";
            $stmt_docente = $conn->prepare($query_docente);
            $stmt_docente->bind_param("s", $curp);
            $stmt_docente->execute();
            $result_docente = $stmt_docente->get_result();

            if ($result_docente && $result_docente->num_rows > 0) {
                $docente_data = $result_docente->fetch_assoc();
                $usuario['docente_data'] = $docente_data;
            } else {
                $usuario['docente_data'] = null;
            }
        } elseif ($usuario['id_rol'] == 3) {
            // Consulta para obtener datos adicionales de `jefes_academia`
            $query_jefe = "SELECT id_academia, permisos_anuales FROM jefes_academia WHERE curp_jef = ?";
            $stmt_jefe = $conn->prepare($query_jefe);
            $stmt_jefe->bind_param("s", $curp);
            $stmt_jefe->execute();
            $result_jefe = $stmt_jefe->get_result();

            if ($result_jefe && $result_jefe->num_rows > 0) {
                $jefe_data = $result_jefe->fetch_assoc();
                $usuario['jefe_data'] = $jefe_data;
            } else {
                $usuario['jefe_data'] = null;
            }
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

            // Verificar el rol y realizar consultas adicionales
            if ($row['id_rol'] == 4) {
                // Obtener datos adicionales de `docentes`
                $query_docente = "SELECT id_academia, curp_jef, permisos_anuales FROM docentes WHERE curp_docente = ?";
                $stmt_docente = $conn->prepare($query_docente);
                $stmt_docente->bind_param("s", $row['curp']);
                $stmt_docente->execute();
                $result_docente = $stmt_docente->get_result();

                if ($result_docente && $result_docente->num_rows > 0) {
                    $docente_data = $result_docente->fetch_assoc();
                    $row['docente_data'] = $docente_data;
                } else {
                    $row['docente_data'] = null;
                }
            } elseif ($row['id_rol'] == 3) {
                // Obtener datos adicionales de `jefes_academia`
                $query_jefe = "SELECT id_academia, permisos_anuales FROM jefes_academia WHERE curp_jef = ?";
                $stmt_jefe = $conn->prepare($query_jefe);
                $stmt_jefe->bind_param("s", $row['curp']);
                $stmt_jefe->execute();
                $result_jefe = $stmt_jefe->get_result();

                if ($result_jefe && $result_jefe->num_rows > 0) {
                    $jefe_data = $result_jefe->fetch_assoc();
                    $row['jefe_data'] = $jefe_data;
                } else {
                    $row['jefe_data'] = null;
                }
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
