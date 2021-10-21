<?php
$executionStartTime = microtime(true);

include("./static/config.php");
include("./static/response.php");

$firstName = $_REQUEST["firstName"];
$lastName = $_REQUEST["lastName"];
$email = $_REQUEST["email"];
$newFirstName = $_REQUEST["newFirstName"];
$newLastName = $_REQUEST["newLastName"];
$newEmail = $_REQUEST["newEmail"];
$newDepartment = $_REQUEST["newDepartment"];

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

//* Update department id
$query = "
    UPDATE personnel p
        SET p.firstName='{$newFirstName}',
            p.lastName='{$newLastName}',
            p.email='{$newEmail}',
            p.departmentID='{$newDepartment}'
        WHERE 
            p.firstName='{$firstName}' AND
            p.lastName='{$lastName}' AND
            p.email='{$email}' 
            
";

$result = $conn->query($query);

if (!$result) {
    response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", true);
    exit;
}

response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", []);
