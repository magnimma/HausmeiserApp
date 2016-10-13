<?php

define("placeHolder", "http://www-app.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/count");
define("submitUrl", "http://www-app.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/auswertenstoerungcsv.php");
define("ndsRegex", "/^[a-z]{3}[0-9]{5}$/");
define("nameRegex", "/^[a-z,A-Z +]{3,40}$/");
define("mailRegex", "/\S+@\S+\.\S+/");
define("phoneRegex", "/^[0-9 +]{1,20}$/");
define("descRegex", "/^[A-Za-z0-9_,;. +-ß]{1,76}$/");
define("buildingRegex", "/^[A-Za-z0-9_,;. +-ß*\/()]{1,200}$/");
define("floorRegex", "/^[A-Za-z0-9_,;. +-ß*]{1,40}$/");
define("roomRegex", "/^[A-Za-z0-9_,;. +-ß*\/()]{1,150}$/");
define("spGrRegex", "/^[A-Za-z0-9\/äü]{3,30}$/");

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

//Check whether the given disturbance data is valid using the regular expresses
if(preg_match(ndsRegex, $userNDS) && preg_match(nameRegex, $userName) && preg_match(mailRegex, $userMail) && preg_match(phoneRegex, $userPhone) && preg_match(descRegex, $description) && preg_match(buildingRegex, $building) && preg_match(floorRegex, $floor) && preg_match(roomRegex, $room) && preg_match(spGrRegex, $specialGroup)){

  //Set the POST-Request parameter
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
  echo json_encode(array(false,"Störung wurde erfolgreich übermittelt"));

}else{
    echo json_encode(array(true,"Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."));
}

?>