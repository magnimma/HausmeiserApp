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
      
      //Variables containing the user name, phone and mail
      userName = "",
      userPhone = "",
      userMail = "",

      //Regular expressions used to validate user content
      phoneRegex = /^[0-9]{1,20}$/,
      mailRegex = /\S+@\S+\.\S+/,
      ndsRegex = new RegExp("^[a-z]{3}[0-9]{5}$"),

      //Variables containing input form fields
      button,
      inputField,
      activeSelectField,

      //Variable containing the nds account that the user entered
      ndsUserInput,

      //Variable containing the result of the NDS account ldap request of the webserver
      result;

  //Initiate the loginController
  function init(){
    _setupUIListener();
    _setUserData();
    console.log("login");
  }

  //Setup the UI element listener
  function _setupUIListener(){
    //Add click listener to the logout buttons
    $(".menu-item-user-logout")[0].addEventListener("click", _logout, false);
    $(".menu-item-user-logout")[1].addEventListener("click", _logout, false);
    //Add change listener to the user input fields
    $(".name-input")[0].addEventListener("change", _checkUserName, false);
    $(".mail-input")[0].addEventListener("change", _checkUserMail, false);
    $(".phone-input")[0].addEventListener("change", _checkUserPhone, false);
    $(".phone-input")[1].addEventListener("change", _checkUserPhone, false);
    //Add click listener to the login buttons
    $(".login-button")[0].addEventListener("click", _checkUserInfo, false);
    $(".login-button")[1].addEventListener("click", _checkUserInfo, false);
  }

  //Check whether user data(name, mail, phone) is already saved locally and show it
  //If no user data is saved show available data of the ldap webserver request according to the NDS account that the user entered to login
  function _setUserData(){
    if(localStorage.getItem("userName")){
      $(".name-input")[0].value = localStorage.getItem("userName");
    }else if(result["name"] != undefined){
      $(".name-input")[0].value = result["name"];
    }
    if(localStorage.getItem("userMail")){
      $(".mail-input")[0].value = localStorage.getItem("userMail");
    }else if(result["email"] != undefined){
      $(".mail-input")[0].value = result["email"];
    }
    if(localStorage.getItem("userPhone")){
      $(".phone-input")[0].value = localStorage.getItem("userPhone");
      $(".phone-input")[1].value = localStorage.getItem("userPhone");    
    }else if(result["tel"] != undefined){
      $(".phone-input")[0].value = result["tel"];
      $(".phone-input")[1].value = result["tel"];
    }
  }
  
  //Move on to login.html when the user entered a correct NDS account
  //or show an error alert when the NDS account is wrong
  function checkUserNDS(){
    if(document.documentElement.lang == "de"){
      ndsUserInput = $(".login-input")[1].value;
      if(_checkStringFormat(ndsUserInput)){
        _pyCheckNDS(ndsUserInput)
      }
    }else{
      ndsUserInput = $(".login-input")[0].value;
      if(_checkStringFormat(ndsUserInput)){
        _pyCheckNDS(ndsUserInput)
      }
    }
  }

  //Check whether the user entered an exiting NDS account
  //Send it to the responsible python webserver which checks the NDS account
  function _pyCheckNDS(userAcc){
    $.ajax({
      type: "POST",
      url: "http://localhost:8080/",
      data: { param: userAcc}
    }).done(function(serverResponse) {
      //Parse the received JSONString and get a JSONObject
      result = JSON.parse(serverResponse);
      console.log(result);
      //CHeck whether the success value of the json object is true or false
      if(result['success'] === "true"){
        _NDSInputSuccess();
      }else{
        _showNDSErrorMessage();
      }
    });
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
    if(document.documentElement.lang == "de"){
      UtilityController.measureStep("NDS Login");
      mainView.router.loadPage(loginUrl);
    }else{
      UtilityController.measureStep("NDS Login");
      mainView.router.loadPage(loginUrl);
    }
  } 

  //Move on to login.html when the user is already logged in
  function checkLoginStatus(){
    if(localStorage.getItem("NDS-Account") !== null){
      console.log(localStorage.getItem("NDS-Account"));
      if(document.documentElement.lang == "de"){
        if(_checkStringFormat(localStorage.getItem("NDS-Account"))){
          UtilityController.measureStep("NDS Login");
          mainView.router.loadPage(loginUrl);
        }else{
          alert("Kein gültiger NDS-Account. Bitte versuchen Sie es erneut.");
        }
      }else{
        if(_checkStringFormat(localStorage.getItem("NDS-Account"))){
          UtilityController.measureStep("NDS Login");
          mainView.router.loadPage(loginUrl);
        }else{
          alert("Not a correct NDS-account. Please try again.");
        }
      }
    }
  }

  //Move on to estimation.html when the user entered a name, phone number and email address
  //and show the user name in the left settings panel 
  //otherwise show an error alert
  function _checkUserInfo(){
    if($(".name-input")[0].value !== "" &&
       _validateEmail($(".mail-input")[0].value) &&
       _checkLangUserPhone()){
      _saveUserData();
      _enableSettingsUI();
      UtilityController.measureStep("User-Info Login");
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
      $(".login-input")[1].value = localStorage.getItem("NDS-Account");
    }else{
      $(".login-input")[0].value = localStorage.getItem("NDS-Account");
    }
  }

  //Check the user name after input and show proper feedback(green/red font color)
  function _checkUserName(){
    if($(".name-input")[0].value !== ""){
      $(".name-input").css("color", "green");
    }else{
      $(".name-input").css("color", "red");
    }
  }

  //Check the user email after input and show proper feedback(green/red font color)
  function _checkUserMail(){
    if(_validateEmail($(".mail-input")[0].value)){
      $(".mail-input").css("color", "green");
    }else{
      $(".mail-input").css("color", "red");
    }
  }

  //Check the user phone number after input and show proper feedback(green/red font color)
  function _checkUserPhone(){
    console.log("phone");
    if(_validatePhone($(".phone-input")[0].value) || _validatePhone($(".phone-input")[1].value)){
      $(".phone-input").css("color", "green");
    }else{
      $(".phone-input").css("color", "red");
    }
  }

  //Logout the user, update the settings UI elements and reaload index.html
  function _logout(){
    localStorage.removeItem("NDS-Account");
    localStorage.removeItem("userName");
    localStorage.removeItem("userMail");
    localStorage.removeItem("userPhone");
    _disableSettingsUI();
    document.location.href = indexURL;
  }

  //Enable the logout button and show the user NDS-Account in the settings
  function _enableSettingsUI(){
    $(".menu-item-user-name")[0].innerHTML = localStorage.getItem("NDS-Account");
    $(".menu-item-user-name")[1].innerHTML = localStorage.getItem("NDS-Account");
    $(".menu-item-user-logout")[0].disabled = false;
    $(".menu-item-user-logout")[1].disabled = false;
  }

  //Disable the logout button and show the user NDS-Account in the settings
  function _disableSettingsUI(){
    $(".menu-item-user-name")[0].innerHTML = localStorage.getItem("NDS-Account");
    $(".menu-item-user-name")[1].innerHTML = localStorage.getItem("NDS-Account");
    $(".menu-item-user-logout")[0].disabled = true;
    $(".menu-item-user-logout")[1].disabled = true;
  }

  //Save the user data(NDS account, name, mail, phone) if the data was valid
  function _saveUserData(){
    localStorage.setItem("NDS-Account", ndsUserInput);
    userName = $(".name-input")[0].value;
    localStorage.setItem("userName", userName);
    userMail = $(".mail-input")[0].value;
    localStorage.setItem("userMail", userMail);
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

  //Check whether the user entered a valid mail address using regex
  function _validateEmail(email){
    return mailRegex.test(email);
  } 

  //Check whether the user entered a valid phone number using regex
  function _validatePhone(phone){
    return phoneRegex.test(phone);
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
