<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/connect.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/web-backend/api/tools/auth.php';

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

