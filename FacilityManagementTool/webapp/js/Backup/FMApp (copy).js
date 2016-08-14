define('FMApp', function() {
    var FMApp = new Framework7({
        modalTitle: 'F7-MVC-Base',
        animateNavBackIcon: true
    });
    var mainView = FMApp.addView('.view-main', {
        dynamicNavbar: true
    });
    var init = function() {
    	console.log("Load settings if available..");
    }
    return {
        FMApp: FMApp,
        mainView: mainView,
        init: init
    };
});