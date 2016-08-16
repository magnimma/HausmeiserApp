
var app = (function() {

  var appModule = {};

  appModule.init = function() {
    console.log("appinit");
    _initModules();
  };

  // Determine theme depending on device
  var isAndroid = Framework7.prototype.device.android === true;
  var isIos = Framework7.prototype.device.ios === true;
   
  // Set Template7 global devices flags
  Template7.global = {
      android: isAndroid,
      ios: isIos
  };

  // Define Dom7
  var $$ = Dom7;
   
  // Change Through navbar layout to Fixed
  if (isAndroid) {
      // Change class
      $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
      // And move Navbar into Page
      $$('.view .navbar').prependTo('.view .page');
  }

/* Erstes Setup
  var FMApp = new Framework7({
      modalTitle: 'F7-MVC-Base',
      animateNavBackIcon: true
  });
*/

  var FMApp = new Framework7({
    // Enable Material theme for Android device only
    material: isAndroid ? true : false,
    // Enable Template7 pages
    template7Pages: true,
    modalTitle: 'F7-MVC-Base',
    animateNavBackIcon: true
});

  var mainView = FMApp.addView('.view-main', {
      dynamicNavbar: true
  });

  FMApp.onPageInit('disturbance', function (page) {
  //fetch building data when the disturbance page is initialized
    DisturbanceController.fetchBuildingData();
  })

  _initModules = function() {
    console.log("logControll");
  };

  return appModule;
  
}());

