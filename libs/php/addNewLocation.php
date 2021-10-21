<?php
$executionStartTime = microtime(true);

include("../php/static/config.php");
include("../php/static/response.php");

$location = $_REQUEST["location"];

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

function checkLocationValue()
{
    global $conn, $executionStartTime, $location;


    $query = "
        SELECT name
        FROM location   
    ";


    $result = $conn->query($query);

    if (!$result) {
        response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
        exit;
    }

    $state = true;

    while ($row = mysqli_fetch_assoc($result)) {
        if ($row["name"] === $location) {
            $state = false;
        }
    }

    if ($state === true) {
        addLocation();
    } else {
        response($conn, "409", "Conflict", "fail", (microtime(true) - $executionStartTime) / 1000 . " ms", false);
    }
}

function addLocation()
{
    global $conn, $executionStartTime, $location;

    $newLocationID = getNextID("location;");

    $query = "
        INSERT INTO location (id, name)
        VALUES (
            '$newLocationID',
            '$location'
        );
    ";

    $conn->query($query);

    response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", true);
}

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

checkLocationValue();
