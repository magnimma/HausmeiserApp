<?php

define("placeHolder", "http://www-app.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/count");

//Submit the given disturbance report using the webformular

//Save the given parameters
$userNDS = $_POST['userNDS'];
$userName = $_POST['userName'];
$userPhone = $_POST['userPhone'];
$description = $_POST['description'];
$building = $_POST['building'];
$floor = $_POST['floor'];
$room = $_POST['room'];
$specialGroup = $_POST['specialGroup'];

//Submit the disturbance report

//PLACEHOLDER return example values
echo json_encode(array($userNDS, $userName, $userPhone, $description, $building, $floor, $room, $specialGroup));

?>