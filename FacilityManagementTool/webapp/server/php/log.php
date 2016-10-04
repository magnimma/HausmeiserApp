<?php

//Save the given log data

//Save the given parameters
$logData = json_decode($_POST['logData'], true);
$timestamp = $_POST['timestamp'];

//Save the data locally
$fp = fopen('logs/' . $timestamp . '.csv', 'w');

foreach ($logData as $fields) {
    fputcsv($fp, $fields);
}

fclose($fp);

//PLACEHOLDER return example values
echo json_encode($logData);

?>