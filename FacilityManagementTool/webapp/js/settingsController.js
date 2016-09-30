//The settingsController is responsible for the settings panel
//It changes the app's language and sets the default language at the start
var SettingsController = (function() {

  var myLangSelect = document.getElementById("languageSelect"),
      helpURL = "help.html",
      indexURL = "index.html";

  //Initiate the settingsController
  function init(){
    console.log("settings");
    _setupUIListeners();
  }

  //Load the help.html and show the help
  function _startHelp(){
    mainView.router.loadPage(helpURL);
  }

  //Setup the UI element listener
  function _setupUIListeners(){
    //Add click listener to the help buttons
    $(".menu-item-help")[0].addEventListener("click", _startHelp, false);
    $(".menu-item-help")[1].addEventListener("click", _startHelp, false);
    //Add change listener to the language select field
    myLangSelect.addEventListener("change", changeLanguage, false);
  }

  //Change the app"s language, remove the temporarily saved roomcode and refresh the current page
  //Save the currently used language
  function changeLanguage(){
    document.documentElement.lang = myLangSelect.options[myLangSelect.selectedIndex].value;
    sessionStorage.removeItem("roomCode");
    console.log("listener");
    localStorage.setItem("lang", document.documentElement.lang);
    mainView.router.load(reload = true);
  }

  //Set the app"s default laguage in the settings panel
  function setDefaultLanguage(){
    if(document.documentElement.lang == "de"){
      myLangSelect.selectedIndex = 1;
    }
  }

  return {
    init: init,
    changeLanguage: changeLanguage,
    setDefaultLanguage: setDefaultLanguage
  };
  
})();
