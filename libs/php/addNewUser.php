<?php
$executionStartTime = microtime(true);

include("./static/config.php");
include("./static/response.php");

$firstName = $_POST["firstName"];
$lastName = $_POST["lastName"];
$email = $_POST["email"];
$department = $_POST["department"];
$locationID = $_POST["locationID"];

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

function checkNameAndEmail()
{
    global $conn, $executionStartTime, $firstName, $lastName, $email;

    $data = [
        "firstNameExist" => true,
        "lastNameExist" => true,
        "emailExist" => true
    ];

    $query = "
        SELECT p.lastName, p.firstName, p.email
        FROM personnel p 
        WHERE 
            firstName='{$firstName}' OR
            lastName='{$lastName}' OR
            email='{$email}' 
    ";

    $result = $conn->query($query);
    if (!$result) {
        response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
        exit;
    }

    $row = mysqli_fetch_assoc($result);

    if ($row["firstName"] === $firstName) {
        $data["firstNameExist"] = false;
    }
    if ($row["lastName"] === $lastName) {
        $data["lastNameExist"] = false;
    }
    if ($row["email"] === $email) {
        $data["emailExist"] = false;
    }

    if (!$data["firstNameExist"] || !$data["lastNameExist"] || !$data["emailExist"]) {
        response($conn, "409", "Conflict", "fail", (microtime(true) - $executionStartTime) / 1000 . " ms", $data);
    } else {
        addUserToDatabase();
        response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", $data);
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
    global $conn, $executionStartTime, $firstName, $lastName, $email, $department, $locationID;

    $query = "
        SELECT d.name, p.departmentID
        FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) 
        WHERE d.name='{$department}'
        GROUP BY p.departmentID
    ";

    $result = $conn->query($query);
    if (!$result) {
        response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
        exit;
    }

    $result = mysqli_fetch_assoc($result);

    $departmentID = $result["departmentID"];
    $personnelID = getNextID("personnel");

    if ($departmentID) {

        $query = "
                INSERT INTO personnel (id, firstName, lastName, jobTitle, email, departmentID)
                VALUES (
                    '$personnelID',
                    '$firstName',
                    '$lastName',
                    '',
                    '$email',
                    '$departmentID'
                )
            ";

        $result = $conn->query($query);
        if (!$result) {
            response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
            exit;
        }
    } else {
        $newDepartmentID = getNextID("department;");

        $conn->autocommit(FALSE);

        $conn->query("
                INSERT INTO personnel (id, firstName, lastName, jobTitle, email, departmentID)
                VALUES (
                    '$personnelID',
                    '$firstName',
                    '$lastName',
                    '',
                    '$email',
                    '$newDepartmentID'
                );
            ");

        $conn->query("
                INSERT INTO department (id, name, locationID)
                VALUES (
                    '$newDepartmentID',
                    '$department',
                    '$locationID'
                );
            ");

        $conn->commit();
    }
}

checkNameAndEmail();
