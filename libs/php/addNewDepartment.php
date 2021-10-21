<?php
$executionStartTime = microtime(true);

include("../php/static/config.php");
include("../php/static/response.php");

$department = $_REQUEST["department"];
$locationID = $_REQUEST["locationID"];

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

function checkDepartmentValue()
{
    global $conn, $executionStartTime, $department;


    $query = "
        SELECT name
        FROM department   
    ";


    $result = $conn->query($query);

    if (!$result) {
        response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
        exit;
    }

    $state = true;

    while ($row = mysqli_fetch_assoc($result)) {
        if ($row["name"] === $department) {
            $state = false;
        }
    }

    if ($state === true) {
        addDepartment();
    } else {
        response($conn, "409", "Conflict", "fail", (microtime(true) - $executionStartTime) / 1000 . " ms", false);
    }
}

function addDepartment()
{
    global $conn, $executionStartTime, $department, $locationID;

    $newDepartmentID = getNextID("department;");

    $query = "
        INSERT INTO department (id, name, locationID)
        VALUES (
            '$newDepartmentID',
            '$department',
            '$locationID'
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

checkDepartmentValue();
