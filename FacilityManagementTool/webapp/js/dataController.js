//The dataController is responsible for the mail attachements the user can send to further describe a disturbance
//It assists the user to take pictures of the disturbance and to send an email including these pictures
var DataController = (function() {

  //Variable containing the disturbance mail address
  var srvPhpURL = 'http://oa.mi.ur.de/~gog59212/FMApp/server/php/',
      appreciationURL = "appreciation",

      //Variable containing a file input UI element 
      myInput,

      //Variable containing a button UI element 
      activeButton;      

  //Initiate the dataController and set the UI element listeners
  function init() {
    myInput = $(".attachement-input")[0];
    //Prevent the attachement upload form field from reloading the webapp after submit
    $("#fileinfo").submit(function(e) {
      e.preventDefault();
    });
    //Initiate click listener for the send attachement buttons and the take new picture buttons
    $(".add-attachement")[0].addEventListener("click", _takePic, false);
    $(".add-attachement")[1].addEventListener("click", _takePic, false);
    $(".attachement-input")[0].addEventListener("change", _attachementChosen, false);
  }

  //Rename the add attachement button element when the user has chosen an disturbance attachement
  //Enable the Submit disturbance button
  function _attachementChosen(){
    activeButton = $(".add-attachement")[0];
    activeButton.value = myInput.files[0].name;
    activeButton = $(".add-attachement")[1];
    activeButton.value = myInput.files[0].name;
    activeButton = $(".submit-attachement")[0];
    activeButton.disabled = false;
    activeButton = $(".submit-attachement")[1];
    activeButton.disabled = false;
  }

  //Rename the add attachement button element when the user has uploaded an disturbance attachement
  //Disable the Submit disturbance button
function _resetUIElements(){
  activeButton = $(".add-attachement")[0];
  activeButton.value = "Choose attachement";
  activeButton = $(".add-attachement")[1];
  activeButton.value = "Anhang auswählen";
  activeButton = $(".submit-attachement")[0];
  activeButton.disabled = true;
  activeButton = $(".submit-attachement")[1];
  activeButton.disabled = true;
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

  //Try to upload the chosen disturbance attachement
  function uploadAttachement(){
    _resetUIElements();
    var fd = new FormData(document.getElementById("fileinfo"));
    console.log(fd);
    $.ajax({
      url : srvPhpURL + 'upload.php',
      type : 'POST',
      data : fd,
      processData: false,  // tell jQuery not to process the data
      contentType: false,  // tell jQuery not to set contentType
      success : function(data) {
        console.log(data);
        alert(data);
     }
    });
  }

  return {
    init: init,
    uploadAttachement: uploadAttachement
  };
  
})();
