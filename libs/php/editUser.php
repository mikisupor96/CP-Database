<?php
$executionStartTime = microtime(true);

include("./static/config.php");
include("./static/response.php");

$firstName = $_POST["firstName"];
$lastName = $_POST["lastName"];
$email = $_POST["email"];
$newFirstName = $_POST["newFirstName"];
$newLastName = $_POST["newLastName"];
$newEmail = $_POST["newEmail"];

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

$query = "
    UPDATE personnel p
        SET p.firstName='{$newFirstName}',
            p.lastName='{$newLastName}',
            p.email='{$newEmail}'
        WHERE 
            p.firstName='{$firstName}' OR
            p.lastName='{$lastName}' OR
            p.email='{$email}'
";

$result = $conn->query($query);

if (!$result) {
    response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", []);
