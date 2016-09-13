//The dataController is responsible for the mail attachements the user can send to further describe a disturbance
//It assists the user to take pictures of the disturbance and to send an email including these pictures
var DataController = (function() {

  //Variable containing the disturbance mail address
  var tzEmail = "tz@ur.de",

      //Variable containing an file input UI element 
      myInput;

  //Initiate the dataController and set the UI element listeners
  function init() {
    myInput = $(".myFileInput")[0];
    //Initiate click listener for the send attachement buttons and the take new picture buttons
    $(".send-picture")[0].addEventListener("click", _sendMail, false);
    $(".send-picture")[1].addEventListener("click", _sendMail, false);
    $(".take-picture")[0].addEventListener("click", _takePic, false);
    $(".take-picture")[1].addEventListener("click", _takePic, false);
  }

  //Open the native mail app with prefilled address and subject
  function _sendMail() {
    console.log(sessionStorage.getItem("webId"));
    window.location.href = "mailto:" + tzEmail + "?subject=Anhang für Störungsmeldung Nr." + localStorage.getItem("webId");
  }

  //Trigger a click event on the "Take picture" input element
  function _takePic() {
    _fireClick(myInput);
  }

  //Trigger a click event on the "Take picture" input element
  function _fireClick(node){
    if (document.createEvent) {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, false);
        node.dispatchEvent(evt);    
    } else if (document.createEventObject) {
        node.fireEvent("onclick") ; 
    } else if (typeof node.onclick == "function") {
        node.onclick(); 
    }
}

  return {
    init: init
  };
  
})();
