<?php

define("raumlisteURL", "http://www-app.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/raumliste");

//Fetch the raumliste.csv from the UR server and save it locally
$fileContent = file_get_contents(raumlisteURL);
echo getcwd();
file_put_contents('raumliste.csv', $fileContent);

//Enter this in bash to run the roomlistUpdater.php once a day using crontab
//0 0 * * * /usr/local/bin/php /home/roomlistUpdater.php

?
