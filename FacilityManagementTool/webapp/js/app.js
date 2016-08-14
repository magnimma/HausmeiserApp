
Main.app = (function() {

//  exampleModule = null,
  loginController = null;

  var init = function() {
    console.log("appinit");
    _initModules();
  };

  var FMApp = new Framework7({
      modalTitle: 'F7-MVC-Base',
      animateNavBackIcon: true
  });

  var mainView = FMApp.addView('.view-main', {
      dynamicNavbar: true
  });

  _initModules = function() {
//    exampleModule = Main.ExampleModule.init();
    console.log("logControll");
    loginController = Main.loginController.init();
  };

  return {
    FMApp: FMApp,
    mainView: mainView,
    init: init
  };
  
})();