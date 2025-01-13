<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';
// include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/auth.php';

try {
    // Leer datos de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);

    // Verificar que los datos básicos estén presentes
    $requiredFields = ['curp', 'numero_empleado', 'nombre', 'primer_ap', 'contrasena', 'id_rol'];
    $missingFields = array_diff($requiredFields, array_keys($data));

    if (!empty($missingFields)) {
        throw new Exception('Faltan los siguientes datos: ' . implode(', ', $missingFields));
    }

    // Escapar y sanitizar los datos
    $curp = $conn->real_escape_string($data['curp']);
    $numero_empleado = $conn->real_escape_string($data['numero_empleado']);
    $nombre = $conn->real_escape_string($data['nombre']);
    $primer_ap = $conn->real_escape_string($data['primer_ap']);
    $segundo_ap = !empty($data['segundo_ap']) ? $conn->real_escape_string($data['segundo_ap']) : null;
    $contrasena = password_hash($data['contrasena'], PASSWORD_DEFAULT);
    $id_rol = $conn->real_escape_string($data['id_rol']);

    // Iniciar transacción
    $conn->begin_transaction();

    // Insertar en `usuarios`
    $query_user = "INSERT INTO usuarios (curp, numero_empleado, nombre, primer_ap, segundo_ap, contrasena, id_rol) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt_user = $conn->prepare($query_user);
    $stmt_user->bind_param("sissssi", $curp, $numero_empleado, $nombre, $primer_ap, $segundo_ap, $contrasena, $id_rol);

    if (!$stmt_user->execute()) {
        throw new Exception("Error al crear el usuario: " . $stmt_user->error);
    }

    // Si el rol es `docente`, insertar también en `docentes`
    if ($id_rol == 4) {
        $requiredDocenteFields = ['curp_jef', 'id_academia', 'permisos_anuales'];
        $missingDocenteFields = array_diff($requiredDocenteFields, array_keys($data));

        if (!empty($missingDocenteFields)) {
            throw new Exception('Faltan los siguientes datos para crear un docente: ' . implode(', ', $missingDocenteFields));
        }

        // Escapar los datos adicionales para docentes
        $curp_jef = $conn->real_escape_string($data['curp_jef']);
        $id_academia = $conn->real_escape_string($data['id_academia']);
        $permisos_anuales = $conn->real_escape_string($data['permisos_anuales']);

        // Insertar en `docentes`
        $query_docente = "INSERT INTO docentes (curp_docente, curp_jef, id_academia, permisos_anuales) 
                          VALUES (?, ?, ?, ?)";
        $stmt_docente = $conn->prepare($query_docente);
        $stmt_docente->bind_param("sssi", $curp, $curp_jef, $id_academia, $permisos_anuales);

        if (!$stmt_docente->execute()) {
            throw new Exception("Error al crear el docente: " . $stmt_docente->error);
        }
    }

    if ($id_rol == 3) {
        // Verificar los campos requeridos
        $requiredJefeFields = ['id_academia', 'permisos_anuales'];
        $missingJefeFields = array_diff($requiredJefeFields, array_keys($data));
    
        if (!empty($missingJefeFields)) {
            throw new Exception('Faltan los siguientes datos para crear un jefe de academia: ' . implode(', ', $missingJefeFields));
        }
    
        // Escapar los datos adicionales para jefes de academia
        $curp_jef = $curp; // Usamos el curp del usuario que se está creando
        $id_academia = $conn->real_escape_string($data['id_academia']);
        $permisos_anuales = $conn->real_escape_string($data['permisos_anuales']);
    
        // Insertar en `jefes_academia`
        $query_jefe = "INSERT INTO jefes_academia (curp_jef, id_academia, permisos_anuales) 
                       VALUES (?, ?, ?)";
        $stmt_jefe = $conn->prepare($query_jefe);
        $stmt_jefe->bind_param("ssi", $curp_jef, $id_academia, $permisos_anuales);
    
        if (!$stmt_jefe->execute()) {
            throw new Exception("Error al crear el jefe de academia: " . $stmt_jefe->error);
        }
    }
    

    // Confirmar transacción
    $conn->commit();

    // Respuesta exitosa
    echo json_encode(['status' => 'success', 'message' => 'Usuario creado correctamente']);
} catch (Exception $e) {
    // Revertir transacción en caso de error
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    // Cerrar conexiones
    $stmt_user->close();
    if (isset($stmt_docente)) {
        $stmt_docente->close();
    }
    $conn->close();
}
?>
