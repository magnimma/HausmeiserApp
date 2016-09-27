<?php

define("countURL", "http://www-app.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/count");

//Fetch content of count.txt from the UR server

/*
//Method 1
echo "Method 1<br>";
$myfile = fopen(countURL . ".txt", "r") or die("Unable to open file!");
//Read the first line of the file
echo fgets($myfile);
fclose($myfile);

//Method 2
echo "<br>Method 2<br>";
*/
$fileContent = file_get_contents(countURL);
echo json_encode($fileContent);

?>