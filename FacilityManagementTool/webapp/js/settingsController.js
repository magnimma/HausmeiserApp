
var SettingsController = (function() {

  var myLangSelect = document.getElementById("languageSelect");

  //Change the app"s language, remove the temporarily saved roomcode and refresh the current page
  //Save the currently used language
  function changeLanguage(){
    document.documentElement.lang = myLangSelect.options[myLangSelect.selectedIndex].value;
    sessionStorage.removeItem("roomCode");
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
    changeLanguage: changeLanguage,
    setDefaultLanguage: setDefaultLanguage
  };
  
})();
