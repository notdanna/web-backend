<?php


// Cabezeras para evitar problemas de CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");



session_start();
session_destroy();
echo json_encode(['status' => 'success', 'message' => 'Sesion cerrada']);
