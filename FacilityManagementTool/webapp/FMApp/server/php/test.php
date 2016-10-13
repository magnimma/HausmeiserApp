<?php

define("ndsRegex", "/^[a-z]{3}[0-9]{5}$/");

if(preg_match(ndsRegex, $userNDS)){
	echo "True";
}else{
	echo "False";
}

?>