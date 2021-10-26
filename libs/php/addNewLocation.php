<?php
// example use from browser
// http://localhost/libs/php/addNewLocation.php?location=Singapore

// ini_set('display_errors', 'On');
// error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("../php/static/config.php");
include("../php/static/response.php");

$location = $_REQUEST["location"];

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

// Adds new user department
$newLocationID = getNextID("location;");

// Department insert
$query = "
    INSERT INTO location (id, name)
    VALUES (
        '$newLocationID',
        '$location'
    );
";

$conn->query($query);

response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", true);

function getNextID($table)
{
    global $conn, $executionStartTime;

    $query = "
        SELECT MAX(id)
        FROM {$table}
    ";

    $result = $conn->query($query);
    if (!$result) {
        response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
        exit;
    }

    $data = mysqli_fetch_assoc($result);

    return $data["MAX(id)"] + 1;
}
