
SettingsController = (function() {

  var myLangSelect = document.getElementById('languageSelect');

  //Change the app's language
  function changeLanguage(){
    document.documentElement.lang = myLangSelect.options[myLangSelect.selectedIndex].value;
  }

  //Set the app's default laguage
  function setDefaultLanguage(){
    if(document.documentElement.lang == 'de'){
      myLangSelect.selectedIndex = 1;
    }
  }

  return {
    changeLanguage: changeLanguage,
    setDefaultLanguage: setDefaultLanguage
  };
  
})();
