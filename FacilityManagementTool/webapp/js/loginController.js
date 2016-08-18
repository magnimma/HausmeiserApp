
LoginController = (function() {

  var loginUrl = "login.html",
      estimateURL = "estimation.html",
      userName,
      userPhone,
      userMail;

  //Move on to login.html when the user entered a correct NDS-account
  //or show an error alert when the NDS-account is wrong
  var checkUserNDS = function(){
    if(document.documentElement.lang == 'de'){
      if(_checkingStringFormat(document.getElementsByClassName('login-input')[1].value)){
        mainView.router.loadPage(loginUrl);
      }else{
        alert("Kein gültiger NDS-Account. Bitte versuchen Sie es erneut.");
      }
    }else{
      if(_checkingStringFormat(document.getElementsByClassName('login-input')[0].value)){
        mainView.router.loadPage(loginUrl);
      }else{
        alert("Not a correct NDS-account. Please try again.");
      }
    }
  }

  //Move on to estimation.html when the user entered a name, phone number and email address
  //otherwise show an error alert
  var checkUserInfo = function(){
    if(document.getElementsByClassName('name-input')[0].value != '' &&
       _validateEmail(document.getElementsByClassName('mail-input')[0].value) &&
       _checkLangUserPhone()){
      _saveUserData();
      mainView.router.loadPage(estimateURL);
    }else if (document.documentElement.lang == 'de'){
      alert("Bitte füllen Sie alle Felder aus.");
    }else{
      alert("Please fill all fields.");      
    }
  }

  //Check the user's name after input
  function checkUserName(){
    if(document.getElementsByClassName('name-input')[0].value != ''){
      $('.name-input').css("color", "green");
    }else{
      $(".name-input").css("color", "red");
    }
  }

  //Check the user's email after input
  function checkUserMail(){
    if(_validateEmail(document.getElementsByClassName('mail-input')[0].value)){
      $('.mail-input').css("color", "green");
    }else{
      $(".mail-input").css("color", "red");
    }
  }

  //Check the user's name after input
  function checkUserPhone(){
    if(document.getElementsByClassName('phone-input')[0].value != '' || document.getElementsByClassName('phone-input')[1].value != ''){
      $('.phone-input').css("color", "green");
    }else{
      $(".phone-input").css("color", "red");
    }
  }

  //Return the user data
  function getUserData(){
    var userData = [userName, userMail, userPhone];
    return userData;
  }

  //Save the user data(name, mail, phone) if the data was valid
  function _saveUserData(){
    userName = document.getElementsByClassName('name-input')[0].value;
    userMail = document.getElementsByClassName('mail-input')[0].value;
    if(document.documentElement.lang == 'de'){
      userPhone = document.getElementsByClassName('phone-input')[1].value;
    }else{
      userPhone = document.getElementsByClassName('phone-input')[0].value;
    }
  }

  //Check whether the user entered a phone number in the right language phone input field
  function _checkLangUserPhone(){
    if(document.documentElement.lang == 'de'){
      if(document.getElementsByClassName('phone-input')[1].value != ''){
        return true;
      }else{
        return false;
      }
    }else{
      if(document.getElementsByClassName('phone-input')[0].value != ''){
        return true;
      }else{
        return false;
      }
    }
  }

  //Check whether the user entered a valid mail address using regex
  function _validateEmail(email){
    var regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  } 

  //check whether the entered user NDS-Account has the correct format 
  function _checkingStringFormat(inputString) {
    var regex = new RegExp("^[a-z]{3}[0-9]{5}$");
    var searchText = inputString;
    if ((searchText.length > 0) && regex.test(searchText)) {
        return true;
    }else{
      return false;
    }
}

  return {
    checkUserNDS: checkUserNDS,
    checkUserInfo: checkUserInfo,
    checkUserMail: checkUserMail,
    checkUserName: checkUserName,
    checkUserPhone: checkUserPhone,
    getUserData: getUserData
  };
  
})();
