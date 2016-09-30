<?php
// basic sequence with LDAP is connect, bind, search, interpret search
// result, close connection

$nds_account = $_POST["nds"];
//$nds_account = $_GET["nds"];

//echo "<h3>LDAP query test</h3>";
//echo "test";
//echo "Connecting ...";
$ds=ldap_connect("ldaps://ldap.ur.de:636");  // must be a valid LDAP server!
//echo "connect result is " . $ds . "<br />";
if ($ds) { 
    //echo "Binding ..."; 
    $r=ldap_bind($ds);     // this is an "anonymous" bind, typically
                           // read-only access
    //echo "Bind result is " . $r . "<br />";

    //echo "Searching for " .$nds_account . " ...";
    // Search surname entry
    $sr=ldap_search($ds, "o=uni-regensburg,c=de", "cn=" . $nds_account);  
    //echo "Search result is " . $sr . "<br />";

    //echo "Number of entries returned is " . ldap_count_entries($ds, $sr) . "<br />";

    //echo "Getting entries ...<p>";
    $info = ldap_get_entries($ds, $sr);
    //echo "Data for " . $info["count"] . " items returned:<p>";
    //print_r($info);

/*
    for ($i=0; $i<$info["count"]; $i++) {
        //echo "dn is: " . $info[$i]["dn"] . "<br />";
        echo "first cn entry is: " . $info[$i]["cn"][0] . "<br />";
        echo "first email entry is: " . $info[$i]["mail"][0] . "<br />";
    }
*/
    //Detailarray Ausgabe
    //echo '<pre>'; print_r($info); echo '<pre/>';

    $nds = $info[0]["cn"][0];
    $mail = $info[0]["mail"][0];
    $phone = $info[0]["telephonenumber"][0];
    $fullname = $info[0]["fullname"][0];
    if($nds != null){
        echo json_encode(array("true", $nds, $mail, $phone, $fullname));
    }else{
    echo json_encode(array("false"));
    }
    //echo "Closing connection";
    ldap_close($ds);
}
?>
