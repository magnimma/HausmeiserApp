var LoginController = (function() {

  var indexURL = "index.html",
      loginUrl = "login.html",
      estimateURL = "estimation.html",
      userName,
      userPhone,
      userMail;

  //Move on to login.html when the user entered a correct NDS-account
  //or show an error alert when the NDS-account is wrong
  var checkUserNDS = function(){
    if(document.documentElement.lang == 'de'){
      if(_checkingStringFormat(document.getElementsByClassName('login-input')[1].value)){
        localStorage.setItem('NDS-Account', document.getElementsByClassName('login-input')[1].value);
        mainView.router.loadPage(loginUrl);
      }else{
        alert("Kein gültiger NDS-Account. Bitte versuchen Sie es erneut.");
      }
    }else{
      if(_checkingStringFormat(document.getElementsByClassName('login-input')[0].value)){
        localStorage.setItem('NDS-Account', document.getElementsByClassName('login-input')[0].value);
        mainView.router.loadPage(loginUrl);
      }else{
        alert("Not a correct NDS-account. Please try again.");
      }
    }
  }

  //Move on to login.html when the user is already logged in and the 
  var checkLoginStatus = function(){
    if(localStorage.getItem('NDS-Account') !== null){
      console.log(localStorage.getItem('NDS-Account'));
      if(document.documentElement.lang == 'de'){
        if(_checkingStringFormat(localStorage.getItem('NDS-Account'))){
          mainView.router.loadPage(loginUrl);
        }else{
          alert("Kein gültiger NDS-Account. Bitte versuchen Sie es erneut.");
        }
      }else{
        if(_checkingStringFormat(localStorage.getItem('NDS-Account'))){
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
  var checkUserInfo = function(){
    if(document.getElementsByClassName('name-input')[0].value !== '' &&
       _validateEmail(document.getElementsByClassName('mail-input')[0].value) &&
       _checkLangUserPhone()){
      _saveUserData();
      _enableSettingsUI();
      mainView.router.loadPage(estimateURL);
    }else if (document.documentElement.lang == 'de'){
      alert("Bitte füllen Sie alle Felder aus.");
    }else{
      alert("Please fill all fields.");      
    }
  }

  //Set the user's NDS-Account when he returns back to index.html
  function setNDSAccount(){
    if (document.documentElement.lang == 'de'){
      document.getElementsByClassName('login-input')[1].value = localStorage.getItem('NDS-Account');
    }else{
      document.getElementsByClassName('login-input')[0].value = localStorage.getItem('NDS-Account');
    }
  }

  //Check the user's name after input
  function checkUserName(){
    if(document.getElementsByClassName('name-input')[0].value !== ''){
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
    if(document.getElementsByClassName('phone-input')[0].value !== '' || document.getElementsByClassName('phone-input')[1].value !== ''){
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

  //Logout the user, update the settings UI elements and reaload index.html
  function logout(){
    localStorage.removeItem('NDS-Account');
    _disbaleSettingsUI();
    document.location.href = indexURL;
  }

  //Enable the logout button and show the user NDS-Account in the settings
  function _enableSettingsUI(){
    document.getElementsByClassName('menu-item-user-name')[0].innerHTML = localStorage.getItem('NDS-Account');
    document.getElementsByClassName('menu-item-user-name')[1].innerHTML = localStorage.getItem('NDS-Account');
    document.getElementsByClassName('menu-item-user-logout')[0].disabled = false;
    document.getElementsByClassName('menu-item-user-logout')[1].disabled = false;
  }

  //Disable the logout button and show the user NDS-Account in the settings
  function _disbaleSettingsUI(){
    document.getElementsByClassName('menu-item-user-name')[0].innerHTML = localStorage.getItem('NDS-Account');
    document.getElementsByClassName('menu-item-user-name')[1].innerHTML = localStorage.getItem('NDS-Account');
    document.getElementsByClassName('menu-item-user-logout')[0].disabled = true;
    document.getElementsByClassName('menu-item-user-logout')[1].disabled = true;
  }

  //Save the user data(name, mail, phone) if the data was valid
  function _saveUserData(){
    userName = document.getElementsByClassName('name-input')[0].value;
    sessionStorage.setItem('userName', userName);
    userMail = document.getElementsByClassName('mail-input')[0].value;
    sessionStorage.setItem('userMail', userMail);
    if(document.documentElement.lang == 'de'){
      userPhone = document.getElementsByClassName('phone-input')[1].value;
      sessionStorage.setItem('userPhone', userPhone);
    }else{
      userPhone = document.getElementsByClassName('phone-input')[0].value;
      sessionStorage.setItem('userPhone', userPhone);
    }
  }

  //Check whether the user entered a phone number in the right language phone input field
  function _checkLangUserPhone(){
    if(document.documentElement.lang == 'de'){
      if(document.getElementsByClassName('phone-input')[1].value !== ''){
        return true;
      }else{
        return false;
      }
    }else{
      if(document.getElementsByClassName('phone-input')[0].value !== ''){
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
    getUserData: getUserData,
    checkLoginStatus:checkLoginStatus,
    setNDSAccount: setNDSAccount,
    logout: logout
  };
  
})();
