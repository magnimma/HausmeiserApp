<?php

define("placeHolder", "http://www-app.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/count");
define("submitUrl", "http://www-app.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/auswertenstoerungcsv.php");

//Submit the given disturbance report using the webformular

//Save the given parameters
$userNDS = $_POST['userNDS'];
$userName = $_POST['userName'];
$userMail = $_POST['userMail'];
$userPhone = $_POST['userPhone'];
$description = $_POST['description'];
$building = $_POST['building'];
$floor = $_POST['floor'];
$room = $_POST['room'];
$specialGroup = $_POST['specialGroup'];
$sendValue = "Abschicken";

//Set the POST-Request parameters
$data = array('nds_eintrag' => $userNDS, 'Name' => $userName, 'eMail' => $userMail, 'Telefon' => $userPhone, 'Gebaeude' => $building, 'Etage' => $floor, 'Raum' => $room, 'fachgruppe' => $specialGroup, 'Nachricht' => $description, 'Send' => $sendValue);

//Submit the disturbance report
/* METHODE 1
$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($submitUrl, false, $context);
if ($result === FALSE) {
	echo $result;
}

var_dump($result);

METHODE 2
// Build Http query using params
$query = http_build_query ($data);
 
// Create Http context details
$contextData = array ( 
                'method' => 'POST',
                'header' => "Connection: close\r\n".
                            "Content-Length: ".strlen($query)."\r\n",
                'content'=> $query );
 
// Create context resource for our request
$context = stream_context_create (array ( 'http' => $contextData ));
 
// Read page rendered as result of your POST request
$result =  file_get_contents (
                  submitUrl,
                  false,
                  $context);
*/

//PLACEHOLDER return example values
echo json_encode($data);

?>