<?php
session_start();
require('../../../../lib/fpdf.php');
include_once '../../../../api/tools/connect.php';

// Verificar si el usuario tiene sesión activa y un rol válido
if (empty($_SESSION['user_id']) || !in_array($_SESSION['rol'], [1, 2, 3, 4])) {
    echo json_encode(['status' => 'error', 'message' => 'No tiene permisos para realizar esta acción']);
    exit;
}

$id_peticion = $_GET['id_peticion'] ?? null;
if (!$id_peticion) {
    die("Falta el ID de la petición");
}

// Obtener rol y CURP del usuario
$rol = $_SESSION['rol'];
$curp_usuario = $_SESSION['user_id'];

// Construir consulta SQL condicional
$query = "
SELECT 
    p.curp_peticion, 
    p.id_tramite, 
    p.fecha_creacion, 
    p.link_pdf, 
    p.fecha_incidencia, 
    p.descripcion_incidencia, 
    p.horas_faltantes, 
    u.nombre AS nombre_empleado, 
    u.primer_ap AS apellido_paterno, 
    u.segundo_ap AS apellido_materno, 
    u.numero_empleado, 
    a.id_academia AS id_academia, 
    a.nombre_academia AS nombre_academia, 
    p.id_etapa AS etapa, 
    CONCAT(ujefe.nombre, ' ', ujefe.primer_ap, ' ', ujefe.segundo_ap) AS nombre_completo_jefe_academico, 
    ujefe.nombre AS nombre_simple_academico
FROM peticiones p
JOIN usuarios u ON p.curp_peticion = u.curp
LEFT JOIN docentes d ON u.curp = d.curp_docente
LEFT JOIN academia a ON d.id_academia = a.id_academia
LEFT JOIN jefes_academia ja ON d.id_academia = ja.id_academia
LEFT JOIN usuarios ujefe ON ja.curp_jef = ujefe.curp
WHERE p.id_peticion = ?
";

// Si el rol es 3 (Jefe de Academia), limitar la consulta a su academia
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
    http_response_code(403); 
    echo json_encode([
        'status' => 'error',
        'message' => 'No se encontraron datos para la peticion'
    ]);
    exit;
}


$data = $result->fetch_assoc();



// Verificar si la etapa está aprobada
$etapa = $data['etapa']; // Obtener el estado de la etapa
$nombre_simple_academico = ($etapa == 3 || $etapa == 5) ? $data['nombre_simple_academico'] : ''; // Solo asigna el nombre si está aprobado


// Extraer datos de la petición
$curp = $data['curp_peticion'];
$nombre_empleado = $data['nombre_empleado'] . ' ' . $data['apellido_paterno'] . ' ' . $data['apellido_materno'];
$numero_empleado = $data['numero_empleado'];
$fecha_creacion = date('d-m-Y', strtotime($data['fecha_creacion']));
$fecha_incidencia = date('d-m-Y', strtotime($data['fecha_incidencia']));
$descripcion_incidencia = $data['descripcion_incidencia'];
$horas_faltantes = $data['horas_faltantes'];

// Consultar los horarios de reposición relacionados con la petición
$query_horarios = "SELECT dia, hora_inicio, hora_fin, horas_cubiertas FROM horarios_reposicion WHERE id_peticion = ?";
$stmt_horarios = $conn->prepare($query_horarios);
$stmt_horarios->bind_param("i", $id_peticion);
$stmt_horarios->execute();
$result_horarios = $stmt_horarios->get_result();

$dias_horarios = [];
while ($row = $result_horarios->fetch_assoc()) {
    $dias_horarios[] = [
        'dia' => date('d-m-Y', strtotime($row['dia'])),
        'hora_inicio' => $row['hora_inicio'],
        'hora_fin' => $row['hora_fin'],
        'observacion' => '+' . $row['horas_cubiertas']
    ];
}

// Agregar la fila de horas faltantes como negativa al inicio
array_unshift($dias_horarios, [
    'dia' => $fecha_incidencia,
    'hora_inicio' => '',
    'hora_fin' => '',
    'observacion' => '-' . $horas_faltantes
]);

// Crear PDF
class PDF extends FPDF
{
    // Encabezado
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

    // Pie de página
    function Footer()
    {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(0, 6, utf8_decode('Página ') . $this->PageNo(), 0, 0, 'C');
    }
}

$pdf = new PDF();
$pdf->AddPage();

$pdf->SetFont('Arial', '', 12);

// Fecha de elaboración
$fecha_actual = date('d-m-Y');
$anio_actual = date('Y');

$memo_identificador = "MEMO/{$data['id_academia']}/$anio_actual";

// Encabezado del Memorándum
$pdf->SetFont('Arial', 'B', 12);
$pdf->MultiCell(0, 6, mb_convert_encoding("MEMORANDUM\n\n", 'ISO-8859-1', 'UTF-8'), 0, 'C');
$pdf->SetFont('Arial', '', 12);



// Datos del memorándum
$id_memorandum = 'MEMO/' . $data['id_academia'] . '/' . $id_peticion . '/' . date('Y');
$pdf->MultiCell(0, 6, utf8_decode("Fecha: $fecha_creacion\nMemorándum: $id_memorandum\n\nDE: {$data['nombre_completo_jefe_academico']}\nJEFE DE {$data['nombre_academia']}\n\nPARA: Sofia Lopez Martinez\nASUNTO: Justificación de Incidencia"), 0, 'L');
$pdf->Ln(5);

// Agregar fecha y descripción de la incidencia
$pdf->MultiCell(0, 6, utf8_decode("Fecha de incidencia: $fecha_incidencia\nDescripción de la incidencia: $descripcion_incidencia"), 0, 'L');
$pdf->Ln(5);

// Descripción del problema
$pdf->MultiCell(0, 6, utf8_decode("Por medio de la presente solicito a usted tenga a bien considerar que $nombre_empleado con tarjeta $numero_empleado, ha solicitado reponer horas de trabajo conforme al siguiente detalle:"), 0, 'L');
$pdf->Ln(5);

// Centrando la tabla
$tableWidth = 160; // Ancho total de la tabla
$xPosition = ($pdf->GetPageWidth() - $tableWidth) / 2; // Calcular posición inicial
$pdf->SetX($xPosition);

// Primera fila con fondo negro y letras blancas
$pdf->SetFillColor(0, 0, 0); // Fondo negro
$pdf->SetTextColor(255, 255, 255); // Texto blanco
$pdf->Cell(40, 6, 'Fecha', 1, 0, 'C', true);
$pdf->Cell(40, 6, 'Entrada', 1, 0, 'C', true);
$pdf->Cell(40, 6, 'Salida', 1, 0, 'C', true);
$pdf->Cell(40, 6, utf8_decode('Observación'), 1, 1, 'C', true);

// Resto de las filas con fondo blanco y texto negro
$pdf->SetFillColor(255, 255, 255); // Fondo blanco
$pdf->SetTextColor(0, 0, 0); // Texto negro
foreach ($dias_horarios as $fila) {
    $pdf->SetX($xPosition); // Centrar cada fila
    $pdf->Cell(40, 6, $fila['dia'], 1, 0, 'C', true);
    $pdf->Cell(40, 6, $fila['hora_inicio'], 1, 0, 'C', true);
    $pdf->Cell(40, 6, $fila['hora_fin'], 1, 0, 'C', true);
    $pdf->Cell(40, 6, $fila['observacion'], 1, 1, 'C');
}

$pdf->Ln(10);

$pdf->MultiCell(0, 6, utf8_decode("Quedo a sus órdenes para cualquier duda al respecto y aprovecho para enviarle un cordial saludo.\n\nATENTAMENTE"), 0, 'C');

$pdf->Ln(10); // Espacio para la firma
$pdf->AddFont('Winter', '', 'WinterSong-owRGB.php');
$pdf->SetFont('Winter', '', 30);
$pdf->Cell(0, 6, utf8_decode("$nombre_simple_academico"), 0, 1, 'C'); // Nombre del jefe académico en la firma (vacío si no está aprobado)
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(0, 6, '________________________', 0, 1, 'C'); // Línea de la firma

$pdf->Cell(0, 6, utf8_decode("Jefe de Departamento Académico"), 0, 1, 'C'); // Título debajo del nombre


// Salida del PDF
$pdf->Output('I', "Memorandum_$id_peticion.pdf");

?>
