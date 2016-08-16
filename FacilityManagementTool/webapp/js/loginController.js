
LoginController = (function() {

  var newUrl = "login.html";

  //change the html site when the user entered a correct NDS-account
  //or show an error alert when the NDS-account is wrong
  var checkForLogin = function(){
    if(_checkingStringFormat(document.getElementsByClassName('login-input')[0].value) || _checkingStringFormat(document.getElementsByClassName('login-input')[1].value)){
      document.location.href = newUrl;
    }else if (document.documentElement.lang == 'de'){
      alert("Kein gültiger NDS-Account. Bitte versuchen Sie es erneut.");
    }else{
      alert("Not a correct NDS-account. Please try again.");      
    }
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
    checkForLogin: checkForLogin
  };
  
})();
