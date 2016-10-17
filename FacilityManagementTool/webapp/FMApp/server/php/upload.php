<?php

/*-----------------------
http://www.w3schools.com/php/php_file_upload.asp
-----------------------*/

//Upload image files to the server

//The id of the disturbance report the uploaded files are related to
$disturbanceId = preg_replace("/[^0-9]/","",$_GET["distId"]);

//Number of attachements for a particular disturbance
$attachCount = 1;

//Target directory to save the files on the server
$target_dir = "../../../Anhangsverzeichnis/Bilder/";
$temp = explode(".", $_FILES["fileToUpload"]["name"]);

//Rename the image file according to the current disturbance id of the UR server
$newfilename = $disturbanceId . "(" . $attachCount . ")." . end($temp);
$target_file = $target_dir . $newfilename;

//Set the variable which checks whether the file is allowed to be saved to true
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

// Check if image file is an actual image or fake image
if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }
}

// Check if file already exists and rename it if necessary
while (file_exists($target_file)) {
    $attachCount = $attachCount + 1;
    $newfilename = $disturbanceId . "(" . $attachCount . ")." . end($temp);
    $target_file = $target_dir . $newfilename;
}

 // Check file size
if ($_FILES["fileToUpload"]["size"] > 5000000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}

// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
    echo "Sorry, only JPG, JPEG & PNG files are allowed.";
    $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}

?>