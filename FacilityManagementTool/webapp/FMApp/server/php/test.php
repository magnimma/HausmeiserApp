<?php
define("buildingRegex", "/^(?![:punct:]{2,})([A-Za-z0-9_,;. +-ß*\/()]{1,200})$/");
define("buildingRegex", "/.+?(?=..\/)/");
if(preg_match(buildingRegex, "s")){
	echo "match";
}else{
	echo "not match";
}
?>