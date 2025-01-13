<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/lib/fpdf.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ob_start(); // Iniciar buffer de salida

// Obtener el ID de la petición
$id_peticion = $_GET['id_peticion'] ?? null;
if (!$id_peticion) {
    die("Falta el ID de la petición");
}

// Consulta SQL para recuperar los datos
$query = "
SELECT 
    CONCAT(u.nombre, ' ', u.primer_ap, ' ', u.segundo_ap) AS nombre_completo_docente,
    u.numero_empleado AS numero_empleado,
    p.fecha_incidencia AS fecha_incidencia,
    hr.hora_inicio AS hora_inicio,
    hr.hora_fin AS hora_fin,
    a.nombre_academia AS departamento_academico,
    a.id_academia AS id_academia, -- Recuperar el ID de la academia
    p.id_etapa AS etapa, -- Recuperar la etapa de la petición
    CONCAT(ujefe.nombre, ' ', ujefe.primer_ap, ' ', ujefe.segundo_ap) AS nombre_completo_jefe_academico,
    SUBSTRING_INDEX(ujefe.nombre, ' ', 1) AS nombre_jefe -- Recuperar solo el primer nombre del jefe
FROM peticiones p
LEFT JOIN usuarios u ON p.curp_peticion = u.curp
LEFT JOIN horarios_reposicion hr ON hr.id_peticion = p.id_peticion
LEFT JOIN docentes d ON u.curp = d.curp_docente
LEFT JOIN academia a ON d.id_academia = a.id_academia
LEFT JOIN jefes_academia ja ON d.curp_jef = ja.curp_jef
LEFT JOIN usuarios ujefe ON ja.curp_jef = ujefe.curp
WHERE p.id_peticion = ?
LIMIT 1";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id_peticion);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("No se encontraron datos para la petición");
}

$data = $result->fetch_assoc();

// Verificar si la etapa está aprobada
$etapa = $data['etapa'];
$nombre_jefe_firma = ($etapa == 3 || $etapa == 5) ? $data['nombre_jefe'] : ''; // Solo asignar nombre si está aprobado

// Crear el PDF
class PDF extends FPDF {
    function Header() {
        // Imágenes
        $this->Image('../../../../public/ipn.png', 10, 10, 20); // Logotipo IPN
        $this->Image('../../../../public/escom.png', 160, 10, 40); // Logotipo ESCOM

        // Título
        $this->SetFont('Arial', 'B', 14);
        $this->SetTextColor(128, 0, 0); // Color granate
        $this->Cell(0, 10, mb_convert_encoding('INSTITUTO POLITÉCNICO NACIONAL', 'ISO-8859-1', 'UTF-8'), 0, 1, 'C');
        $this->SetTextColor(0, 0, 0); // Color negro
        $this->SetFont('Arial', '', 12);
        $this->Cell(0, 6, mb_convert_encoding('ESCUELA SUPERIOR DE CÓMPUTO', 'ISO-8859-1', 'UTF-8'), 0, 1, 'C');
        $this->SetTextColor(0, 51, 102); // Color azul oscuro
        $this->Cell(0, 6, mb_convert_encoding('SUBDIRECCIÓN ACADÉMICA', 'ISO-8859-1', 'UTF-8'), 0, 1, 'C');
        $this->Ln(20);
    }

    function Footer() {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(0, 10, mb_convert_encoding('Página ', 'ISO-8859-1', 'UTF-8') . $this->PageNo(), 0, 0, 'C');
    }
}

$pdf = new PDF();
$pdf->AddPage();
$pdf->SetFont('Arial', '', 12);

// Fecha de elaboración
$fecha_actual = date('d-m-Y');
$anio_actual = date('Y');

$memo_identificador = "MEMO/{$data['id_academia']}/[CONSECUTIVO]/$anio_actual";

// Encabezado del Memorándum
$pdf->SetFont('Arial', 'B', 12);
$pdf->MultiCell(0, 6, mb_convert_encoding("{$data['departamento_academico']}\n\nMEMORANDUM\n\n", 'ISO-8859-1', 'UTF-8'), 0, 'C');
$pdf->SetFont('Arial', '', 12);
$pdf->MultiCell(0, 6, mb_convert_encoding(
    "$fecha_actual\n\n" .
    "$memo_identificador\n\n", 
    'ISO-8859-1', 'UTF-8'), 0, 'C');

// Información de "DE" y "PARA"
$pdf->SetFont('Arial', 'B', 12);
$pdf->MultiCell(0, 6, mb_convert_encoding(
    "DE: {$data['nombre_completo_jefe_academico']}\n" .
    "JEFE DE {$data['departamento_academico']}\n\n" .
    "PARA: [NOMBRE JEFE DCH]\n" .
    "JEFE DEL DEPARTAMENTO DE CAPITAL HUMANO\n\n", 
    'ISO-8859-1', 'UTF-8'), 0, 'L');

// Cuerpo del Memorándum
$pdf->SetFont('Arial', '', 12);
$pdf->MultiCell(0, 6, mb_convert_encoding(
    "Por medio de la presente solicito a usted tenga a bien considerar que\n" .
    "{$data['nombre_completo_docente']} con tarjeta {$data['numero_empleado']} laborará, por necesidades de esta unidad, el día {$data['fecha_incidencia']} en un horario de {$data['hora_inicio']} a {$data['hora_fin']} horas.\n\n", 
    'ISO-8859-1', 'UTF-8'), 0, 'L');

// Firma: Texto general
$pdf->MultiCell(0, 6, mb_convert_encoding(
    "Quedo a sus órdenes para cualquier duda al respecto y aprovecho para\n" .
    "enviarle un cordial saludo.\n\n\n\n\nATENTAMENTE\n\n", 
    'ISO-8859-1', 'UTF-8'), 0, 'C');

// Firma personalizada con el primer nombre del jefe si está aprobado
$pdf->AddFont('Winter', '', 'WinterSong-owRGB.php');
$pdf->SetFont('Winter', '', 30);
$pdf->Cell(0, 6, mb_convert_encoding("$nombre_jefe_firma\n", 'ISO-8859-1', 'UTF-8'), 0, 1, 'C');

// Línea de firma
$pdf->SetFont('Arial', '', 12);
$pdf->MultiCell(0, 6, mb_convert_encoding("________________________", 'ISO-8859-1', 'UTF-8'), 0, 'C');

// Salida del PDF
ob_end_clean(); // Limpiar el buffer de salida
$pdf->Output('I', "CorrimientoHorario_{$id_peticion}.pdf");
?>
