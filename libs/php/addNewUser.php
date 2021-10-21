<?php
$executionStartTime = microtime(true);

include("../php/static/config.php");
include("../php/static/response.php");

$firstName = $_REQUEST["firstName"];
$lastName = $_REQUEST["lastName"];
$email = $_REQUEST["email"];
$department = $_REQUEST["department"];

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

function checkNameAndEmail()
{
    global $conn, $executionStartTime, $firstName, $lastName, $email;


    $query = "
        SELECT p.lastName, p.firstName, p.email
        FROM personnel p 
        WHERE 
            firstName='{$firstName}' AND 
            lastName='{$lastName}' AND
            email='{$email}'   
    ";

    $result = $conn->query($query);
    if (!$result) {
        response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
        exit;
    }

    $row = mysqli_fetch_assoc($result);

    if ($row) {
        response($conn, "409", "Conflict", "fail", (microtime(true) - $executionStartTime) / 1000 . " ms", false);
    } else {
        addUserToDatabase();
        response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", true);
    }
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

function addUserToDatabase()
{
    global $conn, $executionStartTime, $firstName, $lastName, $email, $department;

    $personnelID = getNextID("personnel");

    $query = "
                INSERT INTO personnel (id, firstName, lastName, jobTitle, email, departmentID)
                VALUES (
                    '$personnelID',
                    '$firstName',
                    '$lastName',
                    '',
                    '$email',
                    '$department'
                )
            ";

    $result = $conn->query($query);

    if (!$result) {
        response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
        exit;
    }
}

checkNameAndEmail();
