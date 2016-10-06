//The loginController handles the login functionality of the app
//It asks for the user's NDS account, name, phone and mail data,
//validates the provided information and saves correct data
//Finally it redirects the user to the estimation.html page,
// where the user starts to provide the disturbance information
var LoginController = (function() {

  //Links to subsequent sites
  var indexURL = "index.html",
      loginUrl = "login.html",
      estimateURL = "estimation.html",
      serverURL = "http://192.168.178.43:8080/",
      srvPhpURL = 'http://192.168.178.43/FMApp/server/php/',
      urSrvURL = 'http://oa.mi.ur.de/~gog59212/FMApp/server/php/',
      offlineURL = "offline.html",
      
      //Variables containing the user name, phone and mail
      userName = "",
      userPhone = "",
      //TODO:löschen userMail = "",

      //Regular expressions used to validate user content
      phoneRegex = /^[0-9 +]{1,20}$/,
      nameRegex = /^[a-z,A-Z +]{3,20}$/,
      //ndsRegex = new RegExp("^[a-z]{3}[0-9]{5}$"),
      ndsRegex = /^[a-z]{3}[0-9]{5}$/,

      //Variables containing input form fields
      button,
      inputField,
      activeSelectField,

      //Variable containing the nds account that the user entered
      ndsUserInput,

      //Variable containing the roomcode that the user provided by starting the app per QR code
      roomCode,

      //Variable containing the result of the NDS account ldap request of the webserver
      result;

  //Initiate the loginController
  function init(){
    _setupUIListener();
    _setUserData();
    _checkForRoomcode();
    console.log("login");
  }

  //Check whether the user provided a roomcode e.g. 
  //by entering the app per QR code
  function _checkForRoomcode(){
    roomCode = location.search.split("&").toString();
    if(roomCode.length > 0){
      roomCode = roomCode.substring(1);
      sessionStorage.setItem("qrCode", roomCode);
    }
  }

  //Setup the UI element listener
  function _setupUIListener(){
    //Add click listener to the logout buttons
    $(".menu-item-user-logout")[0].addEventListener("click", _logout, false);
    $(".menu-item-user-logout")[1].addEventListener("click", _logout, false);
    //Add change listener to the user input fields
    $(".name-input")[0].addEventListener("change", _checkUserName, false);
    //TODO:löschen $(".mail-input")[0].addEventListener("change", _checkUserMail, false);
    $(".phone-input")[0].addEventListener("change", _checkUserPhone, false);
    $(".phone-input")[1].addEventListener("change", _checkUserPhone, false);
    //Add click listener to the login buttons
    $(".login-button")[0].addEventListener("click", _checkUserInfo, false);
    $(".login-button")[1].addEventListener("click", _checkUserInfo, false);
  }

  //Check whether user data(name, phone) is already saved locally and show it
  //If no user data is saved show available data of the ldap webserver request according to the NDS account that the user entered to login
  function _setUserData(){
    if(localStorage.getItem("userName")){
      $(".name-input")[0].value = localStorage.getItem("userName");
    }else if(result[1] != undefined){
      $(".name-input")[0].value = result[4];
    }
    if(localStorage.getItem("userPhone")){
      $(".phone-input")[0].value = localStorage.getItem("userPhone");
      $(".phone-input")[1].value = localStorage.getItem("userPhone");    
    }else if(result[3] != null){
      $(".phone-input")[0].value = result[3];
      $(".phone-input")[1].value = result[3];
    }
  }
  
  //Move on to login.html when the user entered a correct NDS account
  //or show an error alert when the NDS account is wrong
  function checkUserNDS(){
    if(document.documentElement.lang == "de"){
      ndsUserInput = $(".login-input")[1].value;
      if(_checkStringFormat(ndsUserInput)){
        _pyCheckNDS(ndsUserInput)
      }else{
        alert("Kein valider NDS-Account. (z.B.: abc12345)");
      }
    }else{
      ndsUserInput = $(".login-input")[0].value;
      if(_checkStringFormat(ndsUserInput)){
        _pyCheckNDS(ndsUserInput)
      }else{
        alert("Not a valid nds account. (e.g.: abc12345)");
      }
    }
  }

  //Check whether the user entered an existing NDS account
  //Send it to the responsible python webserver which checks the NDS account
  function _pyCheckNDS(userAcc){
    if(UtilityController.checkOnlineStatus() == "true"){
     	$.ajax({
        url: urSrvURL + "ldap.php",
        type: "POST",
        dataType: 'json',
        data: ({ "nds": userAcc}),
        success: function(data) {
          result = data;
          console.log(result);
          //CHeck whether the success value of the json object is true or false
          if(result[0] === "true"){
            _NDSInputSuccess();
          }else{
            _showNDSErrorMessage();
          }
        }
      }); 
    }else{
      mainView.router.loadPage(offlineURL);
    }
  }

  //Show an error message when the entered NDS account doesnt exist
  function _showNDSErrorMessage(){
    if(document.documentElement.lang == "de"){
      alert("Kein gültiger NDS-Account. Bitte versuchen Sie es erneut.");
    }else{
      alert("Not a correct NDS-account. Please try again.");
    }
  }

  //When the user NDS account was valid and exists redirect the user
  function _NDSInputSuccess(){
    console.log("LOG: Correct NDS Login");
    UtilityController.measureStep("Correct NDS Login", 0);
    mainView.router.loadPage(loginUrl);
  } 

  //Move on to login.html when the user is already logged in
  function checkLoginStatus(){
    console.log(localStorage.getItem("ndsAccount"));
    console.log(localStorage.getItem("userPhone"));
    console.log(localStorage.getItem("userName"));
    if(localStorage.getItem("ndsAccount") != "undefined" && localStorage.getItem("ndsAccount") != null){
      if(document.documentElement.lang == "de"){
        if(_checkStringFormat(localStorage.getItem("ndsAccount"))){
          console.log("LOG: Correct NDS Login");
          UtilityController.measureStep("Correct NDS Login", 0);
          mainView.router.loadPage(loginUrl);
        }else{
          alert("Kein gültiger NDS-Account. Bitte versuchen Sie es erneut.");
        }
      }else{
        if(_checkStringFormat(localStorage.getItem("ndsAccount"))){
          console.log("LOG: Correct NDS Login");
          UtilityController.measureStep("Correct NDS Login", 0);
          mainView.router.loadPage(loginUrl);
        }else{
          alert("Not a correct NDS-account. Please try again.");
        }
      }
    }
  }

  //Move on to estimation.html when the user entered a name and a phone number
  //and show the user name in the left settings panel 
  //otherwise show an error alert
  function _checkUserInfo(){
    if(_validateName($(".name-input")[0].value) && _checkLangUserPhone()){
      _saveUserData();
      _enableSettingsUI();
      console.log("LOG: Valid User Info entered");
      UtilityController.measureStep("Valid User Info entered", 1);
      mainView.router.loadPage(estimateURL);
    }else if (document.documentElement.lang == "de"){
      alert("Bitte füllen Sie alle Felder korrekt aus.");
    }else{
      alert("Please fill all fields correctly.");      
    }
  }

  //Set the user NDS-Account when he returns back to index.html
  function setNDSAccount(){
    if (document.documentElement.lang == "de"){
      $(".login-input")[1].value = localStorage.getItem("ndsAccount");
    }else{
      $(".login-input")[0].value = localStorage.getItem("ndsAccount");
    }
  }

  //Check the user name after input and show proper feedback(green/red font color)
  function _checkUserName(){
    if(_validateName($(".name-input")[0].value)){
      $(".name-input").css("color", "green");
    }else{
      $(".name-input").css("color", "red");
    }
  }

  /*TODO:löschen
  //Check the user email after input and show proper feedback(green/red font color)
  function _checkUserMail(){
    if(_validateEmail($(".mail-input")[0].value)){
      $(".mail-input").css("color", "green");
    }else{
      $(".mail-input").css("color", "red");
    }
  }
  TODO:löschen*/

  //Check the user phone number after input and show proper feedback(green/red font color)
  function _checkUserPhone(){
    if (document.documentElement.lang == "de"){
      if(_validatePhone($(".phone-input")[1].value)){
        $(".phone-input:eq( 1 )").css("color", "green");
      }else{
        $(".phone-input:eq( 1 )").css("color", "red");
      }
    }else{
      if(_validatePhone($(".phone-input")[0].value)){
        $(".phone-input:eq( 0 )").css("color", "green");
      }else{
        $(".phone-input:eq( 0 )").css("color", "red");
      }
    }
      
  }

  //Logout the user, update the settings UI elements and reaload index.html
  function _logout(){
    localStorage.removeItem("ndsAccount");
    localStorage.removeItem("userName");
    //TODO:löschen localStorage.removeItem("userMail");
    localStorage.removeItem("userPhone");
    _disableSettingsUI();
    document.location.href = indexURL;
  }

  //Enable the logout button and show the user NDS-Account in the settings
  function _enableSettingsUI(){
    $(".menu-item-user-name")[0].innerHTML = localStorage.getItem("ndsAccount");
    $(".menu-item-user-name")[1].innerHTML = localStorage.getItem("ndsAccount");
    $(".menu-item-user-logout")[0].disabled = false;
    $(".menu-item-user-logout")[1].disabled = false;
  }

  //Disable the logout button and show the user NDS-Account in the settings
  function _disableSettingsUI(){
    $(".menu-item-user-name")[0].innerHTML = localStorage.getItem("ndsAccount");
    $(".menu-item-user-name")[1].innerHTML = localStorage.getItem("ndsAccount");
    $(".menu-item-user-logout")[0].disabled = true;
    $(".menu-item-user-logout")[1].disabled = true;
  }

  //Save the user data(NDS account, name, phone) if the data was valid
  function _saveUserData(){
    console.log("Saved: " + ndsUserInput);
    if(ndsUserInput != undefined){
      localStorage.setItem("ndsAccount", ndsUserInput);
    }
    userName = $(".name-input")[0].value;
    localStorage.setItem("userName", userName);
    //TODO:löschen userMail = $(".mail-input")[0].value;
    //TODO:löschen localStorage.setItem("userMail", userMail);
    if(document.documentElement.lang == "de"){
      userPhone = $(".phone-input")[1].value;
      localStorage.setItem("userPhone", userPhone);
    }else{
      userPhone = $(".phone-input")[0].value;
      localStorage.setItem("userPhone", userPhone);
    }
  }

  //Check whether the user entered a phone number in the right language phone input field
  function _checkLangUserPhone(){
    if(document.documentElement.lang == "de"){
      return _validatePhone($(".phone-input")[1].value);
    }else{
      return _validatePhone($(".phone-input")[0].value);
    }
  }

  /*TODO:löschen
  //Check whether the user entered a valid mail address using regex
  function _validateEmail(email){
    return mailRegex.test(email);
  } 
  */

  //Check whether the user entered a valid phone number using regex
  function _validatePhone(phone){
    return phoneRegex.test(phone);
  }

  //Check whether the user entered a valid name using regex
  function _validateName(name){
    return nameRegex.test(name);
  }  

  //check whether the entered user NDS-Account has the correct format 
  function _checkStringFormat(inputString) {
    if ((inputString.length > 0) && ndsRegex.test(inputString)) {
        return true;
    }else{
      return false;
    }
}

  return {
    init: init,
    checkUserNDS: checkUserNDS,
//    checkUserInfo: checkUserInfo,
    checkLoginStatus:checkLoginStatus,
    setNDSAccount: setNDSAccount
  };
  
})();
