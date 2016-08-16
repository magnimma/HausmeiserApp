var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

Template7.global = {
    android: isAndroid,
    ios: isIos
};

var $$ = Dom7;

if (isAndroid) {
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
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
var mainView = FMApp.addView('.view-main', {
    // Material doesn't support it but don't worry about it
    // F7 will ignore it for Material theme
    dynamicNavbar: true
});

FMApp.onPageInit('disturbance', function (page) {
// Do something here for "about" page
  console.log("dist init");
  DisturbanceController.fetchBuildingData();
})



