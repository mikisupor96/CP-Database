<?php
$executionStartTime = microtime(true);

include("./static/config.php");
include("./static/response.php");

$department = $_REQUEST["department"];
$newDepartment = $_REQUEST["newDepartment"];

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

$query = "
    UPDATE department d
        SET d.name='{$newDepartment}'
        WHERE 
            d.name='{$department}' 
            
";

$result = $conn->query($query);

if (!$result) {
    response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", true);
    exit;
}

response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", []);
