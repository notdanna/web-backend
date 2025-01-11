<?php
require('../../../../lib/fpdf.php');
include_once '../../../../api/tools/connect.php';

// Obtener el ID de la petición de la URL o entrada
if (empty($_GET['id_peticion'])) {
    echo json_encode(['status' => 'error', 'message' => 'Falta el ID de la petición']);
    exit;
}

$id_peticion = (int)$_GET['id_peticion'];

// Consultar la información principal de la petición
$query = "SELECT p.curp_peticion, p.id_tramite, p.fecha_creacion, p.link_pdf, p.fecha_incidencia, 
                 p.descripcion_incidencia, p.horas_faltantes, 
                 u.nombre, u.primer_ap, u.segundo_ap, u.numero_empleado
          FROM peticiones p
          JOIN usuarios u ON p.curp_peticion = u.curp
          WHERE p.id_peticion = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id_peticion);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Petición no encontrada']);
    exit;
}

$data = $result->fetch_assoc();

// Extraer datos de la petición
$curp = $data['curp_peticion'];
$nombre_empleado = $data['nombre'] . ' ' . $data['primer_ap'] . ' ' . $data['segundo_ap'];
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
    function Header()
    {
        $this->Image('../../../../public/ipn.png', 8, 8, 25); // Ajusta la ruta y dimensiones
        $this->SetFont('Arial', 'B', 12);
        $this->Cell(0, 6, utf8_decode('INSTITUTO POLITÉCNICO NACIONAL'), 0, 1, 'C');
        $this->Cell(0, 6, utf8_decode('ESCUELA SUPERIOR DE CÓMPUTO'), 0, 1, 'C');
        $this->Cell(0, 6, utf8_decode('SUBDIRECCIÓN ACADÉMICA'), 0, 1, 'C');
        $this->Ln(20); // Salto de línea
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
$pdf->SetFont('Arial', '', 11);

// Título del memorándum
$pdf->Cell(0, 6, utf8_decode('MEMORANDUM'), 0, 1, 'C');
$pdf->Ln(5);

// Datos del memorándum
$id_memorandum = 'MEMO/DEP-ACAD/' . $id_peticion . '/' . date('Y');
$pdf->MultiCell(0, 6, utf8_decode("Fecha: $fecha_creacion\nMemorándum: $id_memorandum\n\nDE: Jefe de Departamento Académico\nPARA: Jefe del Departamento de Capital Humano\nASUNTO: Justificación de Incidencia"), 0, 'L');
$pdf->Ln(5);

// Agregar fecha y descripción de la incidencia
$pdf->MultiCell(0, 6, utf8_decode("Fecha de incidencia: $fecha_incidencia\nDescripción de la incidencia: $descripcion_incidencia"), 0, 'L');
$pdf->Ln(5);

// Descripción del problema
$pdf->MultiCell(0, 6, utf8_decode("Por medio de la presente solicito a usted tenga a bien considerar que $nombre_empleado con tarjeta $numero_empleado, ha solicitado reponer horas de trabajo conforme al siguiente detalle:"), 0, 'L');
$pdf->Ln(5);

// Tabla de horarios
$pdf->Cell(40, 6, 'Fecha', 1, 0, 'C');
$pdf->Cell(40, 6, 'Entrada', 1, 0, 'C');
$pdf->Cell(40, 6, 'Salida', 1, 0, 'C');
$pdf->Cell(40, 6, utf8_decode('Observación'), 1, 1, 'C');

foreach ($dias_horarios as $fila) {
    $pdf->Cell(40, 6, $fila['dia'], 1, 0, 'C');
    $pdf->Cell(40, 6, $fila['hora_inicio'], 1, 0, 'C');
    $pdf->Cell(40, 6, $fila['hora_fin'], 1, 0, 'C');
    $pdf->Cell(40, 6, $fila['observacion'], 1, 1, 'C');
}

$pdf->Ln(10);

// Firma
$pdf->MultiCell(0, 6, utf8_decode("Quedo a sus órdenes para cualquier duda al respecto y aprovecho para enviarle un cordial saludo.\n\nATENTAMENTE,\n\n\n\n________________________\nJefe de Departamento Académico"), 0, 'L');

// Salida del PDF
$pdf->Output('I', "Memorandum_$id_peticion.pdf");
?>
