<?php
$executionStartTime = microtime(true);

include("./static/config.php");
include("./static/response.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
	response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
	exit;
}

$query = 'SELECT * from personnel WHERE id =' . $_POST['id'];

$result = $conn->query($query);

if (!$result) {
	response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
	exit;
}

while ($row = mysqli_fetch_assoc($result)) {
	$personnel[] = $row;
}

$query = 'SELECT id, name from department ORDER BY id';

$result = $conn->query($query);

if (!$result) {
	response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
	exit;
}

while ($row = mysqli_fetch_assoc($result)) {
	$department[] = $row;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['personnel'] = $personnel;
$output['data']['department'] = $department;

mysqli_close($conn);

echo json_encode($output);
