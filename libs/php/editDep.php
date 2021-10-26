<?php

// http://localhost/libs/php/editDep.php?department=Human%20Resources&newDepartment=IT
// ini_set('display_errors', 'On');
// error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("./static/config.php");
include("./static/response.php");

$id = $_REQUEST["id"];
$newDepartment = $_REQUEST["newDepartment"];
$newLocation = $_REQUEST["newLocation"];

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

$query = "
    UPDATE department 
        SET 
            name='{$newDepartment}',
            locationID='{$newLocation}'
        WHERE 
            id='{$id}'         
";

$result = $conn->query($query);

if (!$result) {
    response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", true);
    exit;
}

response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", []);
