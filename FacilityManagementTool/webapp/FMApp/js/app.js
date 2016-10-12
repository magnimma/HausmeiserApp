//The app.js determines whether the used device is an iOS or an android device
//and adjusts the appearance of the app accordingly
//Furthermore it initializes Framework7 specific page callbacks 
var isAndroid = Framework7.prototype.device.android/* === true*/;
var isIos = /*Framework7.prototype.device.ios ===*/ true;
//isAndroid = true;
//isIos = false;

console.log(isAndroid);
console.log(isIos);

Template7.global = {
    android: isAndroid,
    ios: isIos
};

var $$ = Dom7;

if (isAndroid) {
    // Change class of the navbar
    $$(".pages.navbar-through").removeClass("navbar-through").addClass("navbar-fixed");
    // And move navbar into page
    $$(".view .navbar").prependTo(".view .page");
}

// Init App
var FMApp = new Framework7({
    // Enable Material theme for Android device only
    material: isAndroid ? true : false,
    // Enable Template7 pages
    template7Pages: true,
    // Enable fastClicks and disable the 300ms delay for links and form elements in browsers
    fastClicks: false,
    // The default modal dialog title
    modalTitle: "Facility Management App",
    // Enable ability to close modal by clicking outside of modal
    modalCloseByOutside: true,
    // Hide navbar on scroll down
    hideNavbarOnPageScroll: true,
    // Do not show navbar immediately on scroll up
    showBarsOnPageScrollTop: false,
    // Do not show navbar immediately when page end is reached
    showBarsOnPageScrollEnd: false,
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
    dynamicNavbar: true
});

_initPageCallbacks();

function _initPageCallbacks(){
  FMApp.onPageBeforeInit("disturbance", function (page) {
    //Fetch the building, floor and room data before the disturbance page is initialized
    DisturbanceController.init();
  });

  FMApp.onPageBeforeAnimation("index", function (page) {
    //Set the user"s NDS-Account when the index.html is loaded and reday to animate
    LoginController.setNDSAccount();
  });

  FMApp.onPageInit("picture", function (page) {
    //Initiate the datacontroller when the picture.html is loaded and reday to animate
    DataController.init();
  });

  FMApp.onPageInit("login", function (page) {
    //Initiate the login and the settingsController after the login.html was initialized
    LoginController.init();
  });

  FMApp.onPageInit("index", function (page) {
    //Trigger a pageInit event for the index.html afterwards it was initialized
  }).trigger();

}





