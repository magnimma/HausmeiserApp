//The settingsController is responsible for the settings panel
//It changes the app's language and sets the default language at the start
var SettingsController = (function() {

  var myLangSelect = document.getElementById("languageSelect");

  //Initiate the settinsgController
  function init(){
    console.log("settings");
    myLangSelect.addEventListener("change", changeLanguage, false);
  }

  //Change the app"s language, remove the temporarily saved roomcode and refresh the current page
  //Save the currently used language
  function changeLanguage(){
    document.documentElement.lang = myLangSelect.options[myLangSelect.selectedIndex].value;
    sessionStorage.removeItem("roomCode");
    console.log("listener");
    localStorage.setItem("lang", document.documentElement.lang);
    mainView.router.refreshPage();
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
