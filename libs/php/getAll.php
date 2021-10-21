<?php
$executionStartTime = microtime(true);

include("./static/config.php");
include("./static/response.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port);

if (mysqli_connect_errno()) {
	response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
	exit;
}

$query = '
SELECT p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, d.id as departmentID, l.name as location 
FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) 
LEFT JOIN location l ON (l.id = d.locationID) 
ORDER BY p.lastName, p.firstName, d.name, l.name';

$result = $conn->query($query);

if (!$result) {
	response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
	exit;
}

while ($row = mysqli_fetch_assoc($result)) {
	$data[] = $row;
}

response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", $data);
