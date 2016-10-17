//The dataController handles the user file uploads
//It sends the chosen attachement files via Ajax-Request to the php server and shows an error/success alert
var DataController = (function() {

      //Variable containing a file input UI element 
  var myInput,

      //Variable containing a button UI element 
      activeButton,   

      //Variable containing the disturbance id for the current disturbance report
      disturbanceId = 1;

  //Initiate the dataController and set the UI element listeners
  function init() {
    myInput = $(".attachement-input")[0];
    //Prevent the attachement upload form field from reloading the webapp after submit
    $("#fileinfo").submit(function(e) {
      e.preventDefault();
    });
    //Set click listener for the add-attachement buttons
    $(".add-attachement")[0].addEventListener("click", _triggerClick, false);
    $(".add-attachement")[1].addEventListener("click", _triggerClick, false);
    //Set change listener for the attachement input field
    $(".attachement-input")[0].addEventListener("change", _attachementChosen, false);
  }

  //Rename the add attachement button element when the user has chosen an disturbance attachement
  //Enable the Submit attachement button
  function _attachementChosen(){
    try{
      activeButton = $(".add-attachement")[0];
      activeButton.value = myInput.files[0].name;
      activeButton = $(".add-attachement")[1];
      activeButton.value = myInput.files[0].name;
      activeButton = $(".submit-attachement")[0];
      activeButton.disabled = false;
      activeButton = $(".submit-attachement")[1];
      activeButton.disabled = false;
    }catch(err){
      console.log("Error: " + err);
    }
  }

  //Rename the add attachement button element when the user has uploaded an disturbance attachement
  //Disable the Submit attachement button
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

  //Trigger a click event on the add-attachement input element
  function _triggerClick() {
    _fireClick(myInput);
  }

  //Trigger a click event on the add-attachement input element
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

  //Try to upload the chosen disturbance attachement via Ajax to the php server 
  //if the user has a internet connection
  //Attach the current disturbance id to the Url to help the server rename the file appropriately
  //Redirect to the offline fallback page otherwise
  //Show an error/success alert
  function uploadAttachement(){
    if(UtilityController.checkOnlineStatus() == "true"){  
      _resetUIElements();
      disturbanceId = sessionStorage.getItem("webId");
      var fd = new FormData(document.getElementById("fileinfo"));
      $.ajax({
        url : myApp.urSrvURL + 'upload.php?distId=' + disturbanceId,
        type : 'POST',
        data : fd,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
          FMApp.alert(data);
       }
      });
    }else{
      mainView.loadPage(myApp.offlineURL);
    }
  }

  return {
    init: init,
    uploadAttachement: uploadAttachement
  };
  
})();
