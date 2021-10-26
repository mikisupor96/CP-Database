<?php
// example use from browser
// http://localhost/libs/php/addNewUser.php?firstName=Mihai&lastName=Pascaru&email=mihainstein@gmail.com&department=Training

// ini_set('display_errors', 'On');
// error_reporting(E_ALL);

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

// Checks user`s name and email
function checkNameAndEmail()
{
    global $conn, $executionStartTime, $firstName, $lastName, $email;


    $query = "
        SELECT count(id) pc
        FROM personnel  
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

    if($row["pc"] === "0"){
        addUserToDatabase();
        response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", true);
    }else {
        response($conn, "409", "Conflict", "fail", (microtime(true) - $executionStartTime) / 1000 . " ms", false);

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

// Adds new user to current or new department
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
