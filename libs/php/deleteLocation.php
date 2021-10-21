<?php
$executionStartTime = microtime(true);

include("./static/config.php");
include("./static/response.php");

header('Content-Type: application/json; charset=UTF-8');

$location = $_REQUEST["location"];


$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

$query = "
    SELECT COUNT(*) FROM personnel p
    LEFT JOIN department d ON (d.id = p.departmentID) 
    LEFT JOIN location l ON (l.id = d.locationID) 
    WHERE l.name='{$location}';
";

$result = $conn->query($query);

$row = mysqli_fetch_assoc($result);

if (intval($row["COUNT(*)"]) !== 0) {
    response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", false);
} else {
    $query = "
        DELETE FROM location l
        WHERE 
            l.name='{$location}' 

    ";

    $result = $conn->query($query);


    if (!$result) {
        response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
        exit;
    }

    response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", true);
}
