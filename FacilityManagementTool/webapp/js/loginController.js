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

      //regular expressions
      mailRegex = /\S+@\S+\.\S+/,
      ndsRegex = new RegExp("^[a-z]{3}[0-9]{5}$"),

      //Variables containing input form fields
      button,
      inputField,
      activeSelectField;

  //Initiate the loginController
  function init(){
    _setupUIListener();
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

  //Move on to login.html when the user entered a correct NDS-account
  //or show an error alert when the NDS-account is wrong
  function checkUserNDS(){
    if(document.documentElement.lang == "de"){
      if(_checkStringFormat($(".login-input")[1].value)){
        localStorage.setItem("NDS-Account", $(".login-input")[1].value);
        mainView.router.loadPage(loginUrl);
      }else{
        alert("Kein gültiger NDS-Account. Bitte versuchen Sie es erneut.");
      }
    }else{
      if(_checkStringFormat($(".login-input")[0].value)){
        localStorage.setItem("NDS-Account", $(".login-input")[0].value);
        mainView.router.loadPage(loginUrl);
      }else{
        alert("Not a correct NDS-account. Please try again.");
      }
    }
  }

  //Move on to login.html when the user is already logged in
  function checkLoginStatus(){
    if(localStorage.getItem("NDS-Account") !== null){
      console.log(localStorage.getItem("NDS-Account"));
      if(document.documentElement.lang == "de"){
        if(_checkStringFormat(localStorage.getItem("NDS-Account"))){
          mainView.router.loadPage(loginUrl);
        }else{
          alert("Kein gültiger NDS-Account. Bitte versuchen Sie es erneut.");
        }
      }else{
        if(_checkStringFormat(localStorage.getItem("NDS-Account"))){
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
      mainView.router.loadPage(estimateURL);
    }else if (document.documentElement.lang == "de"){
      alert("Bitte füllen Sie alle Felder aus.");
    }else{
      alert("Please fill all fields.");      
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

  //Check the user name after input and show proper feedback(green/red font color)
  function _checkUserPhone(){
    if($(".phone-input")[0].value !== "" || $(".phone-input")[1].value !== ""){
      $(".phone-input").css("color", "green");
    }else{
      $(".phone-input").css("color", "red");
    }
  }

  //Logout the user, update the settings UI elements and reaload index.html
  function _logout(){
    localStorage.removeItem("NDS-Account");
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

  //Save the user data(name, mail, phone) if the data was valid
  function _saveUserData(){
    userName = $(".name-input")[0].value;
    sessionStorage.setItem("userName", userName);
    userMail = $(".mail-input")[0].value;
    sessionStorage.setItem("userMail", userMail);
    if(document.documentElement.lang == "de"){
      userPhone = $(".phone-input")[1].value;
      sessionStorage.setItem("userPhone", userPhone);
    }else{
      userPhone = $(".phone-input")[0].value;
      sessionStorage.setItem("userPhone", userPhone);
    }
  }

  //Check whether the user entered a phone number in the right language phone input field
  function _checkLangUserPhone(){
    if(document.documentElement.lang == "de"){
      if($(".phone-input")[1].value !== ""){
        return true;
      }else{
        return false;
      }
    }else{
      if($(".phone-input")[0].value !== ""){
        return true;
      }else{
        return false;
      }
    }
  }

  //Check whether the user entered a valid mail address using regex
  function _validateEmail(email){
    return mailRegex.test(email);
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
