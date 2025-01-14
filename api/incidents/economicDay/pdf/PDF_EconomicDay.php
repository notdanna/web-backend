<?php
session_start();
require_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/lib/fpdf.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ob_start(); // Iniciar buffer de salida para evitar problemas con la salida previa

// Verificar si el usuario tiene sesión activa y un rol válido
if (empty($_SESSION['user_id']) || !in_array($_SESSION['rol'], [1, 2, 3, 4])) {
    die("No tiene permisos para realizar esta acción");
}

$id_peticion = $_GET['id_peticion'] ?? null;
if (!$id_peticion) {
    die("Falta el ID de la petición");
}

// Obtener el rol y CURP del usuario
$rol = $_SESSION['rol'];
$curp_usuario = $_SESSION['user_id'];

// Construir la consulta SQL con condición según el rol
$query = "
SELECT 
    CONCAT(u.nombre, ' ', u.primer_ap, ' ', u.segundo_ap) AS nombre_completo_docente,
    SUBSTRING_INDEX(u.nombre, ' ', 1) AS nombre_simple_docente,
    u.numero_empleado AS numero_empleado,
    a.nombre_academia AS area_adscripcion,
    p.fecha_incidencia AS fecha_incidencia,
    CONCAT(ujefe.nombre, ' ', ujefe.primer_ap, ' ', ujefe.segundo_ap) AS nombre_completo_jefe_academico,
    SUBSTRING_INDEX(ujefe.nombre, ' ', 1) AS nombre_simple_jefe,
    p.id_etapa AS etapa -- Verificar la etapa de la petición
FROM peticiones p
LEFT JOIN usuarios u ON p.curp_peticion = u.curp
LEFT JOIN docentes d ON u.curp = d.curp_docente
LEFT JOIN academia a ON d.id_academia = a.id_academia
LEFT JOIN jefes_academia ja ON d.id_academia = ja.id_academia
LEFT JOIN usuarios ujefe ON ja.curp_jef = ujefe.curp
WHERE p.id_peticion = ?
";

// Agregar restricción si el rol es 3 (Jefe de Academia)
if ($rol == 3) {
    $query .= " AND a.id_academia = (SELECT id_academia FROM jefes_academia WHERE curp_jef = ?)";
}

$stmt = $conn->prepare($query);
if ($rol == 3) {
    $stmt->bind_param("is", $id_peticion, $curp_usuario);
} else {
    $stmt->bind_param("i", $id_peticion);
}

$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("No se encontraron datos para la petición o no tiene permisos para verla");
}

$data = $result->fetch_assoc();

// Verificar si la etapa está aprobada
$etapa = $data['etapa'];
$nombre_simple_docente = $data['nombre_simple_docente']; // Asignar si aprobado
$nombre_simple_jefe = ($etapa == 3 || $etapa == 5) ? $data['nombre_simple_jefe'] : ''; // Asignar si aprobado
$nombre_capital = ($etapa == 5 || $etapa == 3 ) ? 'Sofia' : 'Jefe de Academia'; // Asignar si aprobado

// Crear el PDF
class PDF extends FPDF {
    function Header() {
        // Imágenes
        $this->Image('../../../../public/ipn.png', 10, 10, 20); // Logotipo IPN
        $this->Image('../../../../public/escom.png', 250, 10, 40); // Logotipo ESCOM

        // Título
        $this->SetFont('Arial', 'B', 14);
        $this->SetTextColor(128, 0, 0); // Color granate
        $this->Cell(0, 10, mb_convert_encoding('INSTITUTO POLITÉCNICO NACIONAL', 'ISO-8859-1', 'UTF-8'), 0, 1, 'C');
        $this->SetTextColor(0, 0, 0); // Color negro
        $this->SetFont('Arial', '', 12);
        $this->Cell(0, 6, mb_convert_encoding('ESCUELA SUPERIOR DE CÓMPUTO', 'ISO-8859-1', 'UTF-8'), 0, 1, 'C');
        $this->SetTextColor(0, 51, 102); // Color azul oscuro
        $this->Cell(0, 6, mb_convert_encoding('SUBDIRECCIÓN ACADÉMICA', 'ISO-8859-1', 'UTF-8'), 0, 1, 'C');
        $this->Ln(10);
    }

    function Footer() {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(0, 10, mb_convert_encoding('Página ', 'ISO-8859-1', 'UTF-8') . $this->PageNo(), 0, 0, 'C');
    }
}

// Cambiar a orientación horizontal
$pdf = new PDF('L', 'mm', 'A4');
$pdf->AddPage();
$pdf->SetFont('Arial', '', 12);

// Encabezado del documento
$pdf->SetFont('Arial', 'B', 16);
$pdf->Cell(0, 10, mb_convert_encoding('JUSTIFICACIÓN DE INCIDENCIA', 'ISO-8859-1', 'UTF-8'), 0, 1, 'C');
$pdf->Ln(10);

// Detalles del encabezado
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 10, mb_convert_encoding("Sofia Lopez Martinez", 'ISO-8859-1', 'UTF-8'), 0, 1);
$pdf->Cell(0, 10, mb_convert_encoding("JEFE DEL DEPARTAMENTO DE CAPITAL HUMANO", 'ISO-8859-1', 'UTF-8'), 0, 1);
$pdf->Ln(5);
$pdf->Cell(0, 10, mb_convert_encoding("PRESENTE", 'ISO-8859-1', 'UTF-8'), 0, 1);

// Fecha
setlocale(LC_TIME, "es_ES.UTF-8");
$fecha_actual = strftime("%d de %B de %Y");
$pdf->Cell(0, 10, mb_convert_encoding("Ciudad de México a $fecha_actual", 'ISO-8859-1', 'UTF-8'), 0, 1);

// Información del docente
$pdf->Ln(5);
$pdf->SetFont('Arial', '', 12);
$pdf->MultiCell(0, 10, mb_convert_encoding("El trabajador {$data['nombre_completo_docente']} con Tarjeta de Asistencia {$data['numero_empleado']} del área {$data['area_adscripcion']}, solicita lo siguiente:", 'ISO-8859-1', 'UTF-8'));

// Fecha de incidencia
$pdf->Ln(5);
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 10, mb_convert_encoding("Fecha de Incidencia: {$data['fecha_incidencia']}", 'ISO-8859-1', 'UTF-8'), 0, 1);

// Detalles de solicitud
$pdf->SetFont('Arial', '', 12);
$pdf->Cell(0, 10, mb_convert_encoding("( X ) Permiso Económico", 'ISO-8859-1', 'UTF-8'), 0, 1);

// Firmas
$pdf->Ln(15);
$pdf->AddFont('Winter', '', 'WinterSong-owRGB.php');
$pdf->SetFont('Winter', '', 30);

// Firmas condicionales según etapa
$pdf->Cell(80, 10, mb_convert_encoding("$nombre_simple_docente", 'ISO-8859-1', 'UTF-8'), 0, 0, 'C');
if (!empty($nombre_simple_jefe)) {
    $pdf->Cell(80, 10, mb_convert_encoding("$nombre_simple_jefe", 'ISO-8859-1', 'UTF-8'), 0, 0, 'C');
    $pdf->Cell(80, 10, mb_convert_encoding("$nombre_capital", 'ISO-8859-1', 'UTF-8'), 0, 0, 'C');
    $pdf->Ln(10);
}

$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(80, 10, mb_convert_encoding("________________________", 'ISO-8859-1', 'UTF-8'), 0, 0, 'C');
$pdf->Cell(80, 10, mb_convert_encoding("________________________", 'ISO-8859-1', 'UTF-8'), 0, 0, 'C');
$pdf->Cell(80, 10, mb_convert_encoding("________________________", 'ISO-8859-1', 'UTF-8'), 0, 0, 'C');
$pdf->Ln(5);
$pdf->Cell(80, 10, mb_convert_encoding("INTERESADO", 'ISO-8859-1', 'UTF-8'), 0, 0, 'C');
$pdf->Cell(80, 10, mb_convert_encoding("JEFE INMEDIATO", 'ISO-8859-1', 'UTF-8'), 0, 0, 'C');
$pdf->Cell(80, 10, mb_convert_encoding("JEFE DE CAPITAL HUMANO", 'ISO-8859-1', 'UTF-8'), 0, 0, 'C');

// Salida del PDF
ob_end_clean(); // Limpiar buffer de salida
$pdf->Output('I', "DiaEconomico_{$id_peticion}.pdf");
?>
