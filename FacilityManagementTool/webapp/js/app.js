var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;
isAndroid = true;
isIos = false;

Template7.global = {
    android: isAndroid,
    ios: isIos
};

var $$ = Dom7;

if (isAndroid) {
    // Change class
    // BU: "$$(".view(s).navbar-through")" 
    $$(".pages.navbar-through").removeClass("navbar-through").addClass("navbar-fixed");
    // And move Navbar into Page
    $$(".view .navbar").prependTo(".view .page");
}

// Init App
var FMApp = new Framework7({
    // Enable Material theme for Android device only
    material: isAndroid ? true : false,
    // Enable Template7 pages
    template7Pages: true,
    // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        FMApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        FMApp.hideIndicator();
    }
});
 
// Init View
var mainView = FMApp.addView(".view-main", {
    // Material doesn"t support it but don"t worry about it
    // F7 will ignore it for Material theme
    dynamicNavbar: true
});

_initPageCallbacks();

function _initPageCallbacks(){
  FMApp.onPageBeforeInit("disturbance", function (page) {
    //Fetch the building, floor and room data once the disturbance page is initialized
    DisturbanceController.fetchBuildingData();
  });

  FMApp.onPageBeforeAnimation("index", function (page) {
    //Set the user"s NDS-Account when the index.html is loaded and reday to animate
    LoginController.setNDSAccount();
  });

  FMApp.onPageInit("picture", function (page) {
    //Set the user"s NDS-Account when the index.html is loaded and reday to animate
    DataController.init();
  });

  FMApp.onPageInit("index", function (page) {
    //Set the user"s NDS-Account when the index.html is loaded and reday to animate
    console.log("Index init");
  }).trigger();

}





