
Main.loginController = (function() {

  var init = function() {
    _checkForLogin();
  };

  var _checkForLogin = function(){
    console.log("logincheck");
    document.getElementById('login-input').placeholder = "GEHT";
  }

  return {
    init: init
  };
  
})();