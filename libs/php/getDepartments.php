<?php

// remove next two lines for production

// ini_set('display_errors', 'On');
// error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("./static/config.php");
include("./static/response.php");

header('Content-Type: application/json; charset=UTF-8');

$value = $_REQUEST["value"];

// CONNECT TO DB
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

if ($value) {
    $query = "
        SELECT * FROM department 
        WHERE 
            name='{$value}'
        ORDER BY name
    ";
} else {
    $query = "
        SELECT * FROM department
    ";
}

// QUERY DB
$result = $conn->query($query);

if (!$result) {
    response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

// FETCH DATA FROM QUERY
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

// OUTPUT RESULT 
response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", $data);
