// Initialize your app
var s,
FMApp = new Framework7({
	settings: {
		login: false;
	}
	init: function(){
		//initialize the FMApp module
		s = this.settings;
		console.log("init");
	}
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = FMApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
FMApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});
