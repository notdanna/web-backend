<?php

// Conexión a la base de datos
include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';

// Datos del usuario
$curp = '696969';
$numero_empleado = 2042;
$nombre = 'Fredericka';
$primer_ap = 'Daniel';
$segundo_ap = 'Barlow';
$contrasena = '12345Segura!';
$id_rol = 3;

// Encriptar la contraseña
$contrasena_encriptada = password_hash($contrasena, PASSWORD_DEFAULT);

// Consulta para insertar datos
$query = "INSERT INTO usuarios (curp, numero_empleado, nombre, primer_ap, segundo_ap, contrasena, id_rol) 
VALUES ('$curp', $numero_empleado, '$nombre', '$primer_ap', '$segundo_ap', '$contrasena_encriptada', $id_rol)";

// Ejecutar la consulta
if ($conn->query($query)) {
    echo "Usuario insertado correctamente.";
} else {
    echo "Error al insertar usuario: " . $conn->error;
}

// Cerrar conexión
$conn->close();
?>
