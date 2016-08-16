
var app = (function() {

  var appModule = {};

  appModule.init = function() {
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
    console.log("logControll");
  };

  return appModule;
  
}());

