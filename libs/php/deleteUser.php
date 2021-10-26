<?php
// remove next two lines for production
// http://localhost/libs/php/deleteUser.php?firstName=Mihai&lastName=Allsup&email=lallsupo@goo.ne.jp

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("./static/config.php");
include("./static/response.php");

header('Content-Type: application/json; charset=UTF-8');

$id = $_REQUEST["id"];

// CONNECT TO DB
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

// $_REQUEST used for development / debugging. Remember to cange to $_POST for production

// QUERY DB
$query = "
    DELETE FROM personnel 
    WHERE 
        id='{$id}' 
";

// EXECUTE DELETION 
$result = $conn->query($query);


if (!$result) {
    response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

// OUTPUT RESULT 
response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", []);
