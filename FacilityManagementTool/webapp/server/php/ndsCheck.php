<?php

define("ldapURL", "http://www-app.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/count");

//Check whether a given nds account is valid

//Save the given parameter
$postVar = $_POST['userNDS'];
//Check whether its a valid nds account of the UR using a ldap request

//PLACEHOLDER return example values
echo json_encode(array($postVar, "Bob Bambus","true", "1234", "PT"));

?>