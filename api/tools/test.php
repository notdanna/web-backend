<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/lib/fpdf.php';

$pdf = new FPDF();
$pdf->AddPage();

// Registrar la fuente personalizada
$pdf->AddFont('Winter', '', 'WinterSong-owRGB.php');

// Usar la fuente
$pdf->SetFont('Winter', '', 20);
$pdf->Cell(0, 10, 'Mike es pendejo', 0, 1);

$pdf->SetFont('Arial', 'B', 14);
$pdf->Cell(0, 10, 'Este texto usa la fuente Arial en negrita.', 0, 1);

$pdf->Output();