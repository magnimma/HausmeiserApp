//The disturbanceController determines and checks the necessary disturbance data and finally sends the disturbance
//The user can enter local information according the disturbance, assign a sepcialist group and enter a brief description
//Optionally the user can choose to send an email with an attachement to provide further information according the disturbance, which leads the user to an extra screen
//To assist the user to enter the necessary disturbance information, the disturbanceController fetches suitable local and specialist group information from a csv and a json file
var DisturbanceController = (function() {

      //Links to data and html files
  var buildingCsvUrl = "https://appsso.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/raumliste.csv",      
      pictureURL = "picture.html",
      localCSV = "csv/raumliste.csv",
      localHostCSV = "http://192.168.178.43/FMApp/csv/raumliste.csv",
      specGrpJSON = "csv/fachgruppen.json",
      sendURL = "form.html",
      offlineURL = "offline.html",

      //Variable for the building data, containing the available buildings and the according name
      buildingGrpMap = {},
      
      //Variables containing the building, floor and room data
      building = [],
      floor = [],
      room = [],
//RAUS      roomCode = [],

      //Variable containing the currently active select form field
      activeSelectField,

      //Variable containing a new option for a select form field
      newOption,

      //Variable containing the currently active checkBox
      activeCheckBox,

      //Variable containing the currently active text field
      activeTextField,

      //Variable containing the currently active button
      activeButton,

      //Variables containing the currently active building, floor and room
      //If chosen by the user
      activeBuilding = "",
      activeFloor = "",
      activeRoom = "",

      //Variable containing all rows of the csv file containing the building, floor and room data
      csvDataRows,
      //Variable containing a single row of the csv file containing the building, floor and room data
      rowCells,

      //Regular expressions used to validate user content(disturbance description)
      descRegex = /^[A-Za-z0-9_,;.+-]{1,80}$/,

      //Variable containing the current date
      //Format: dd.mm.yyyy hh:mm
      currDate,

      //Variabel containing the set of responsible special groups for a specific building
      responsibleSpecialGroups,
      //Variable containing the responsible special group for a specific building
      respSpecialGroup,
      
      //Variable containing the number of disturbances sent online
      placeholderWebId = 1,

      //Contains the different special groups data for the different building in json format
      jsonData,

      //Variable containing an error message which is shown when the user
      //hasnt completely filled in all necessary fields of a disturbance
      errMsg = "Following fields are missing: \n",
      //Variable containing boolean value, whether the user made a mistake
      //filling in the necessary distubance data
      err = false;

  //Initiate the disturbanceController when the disturbance.html is iniatiated
  function init(){
    _setupUIListener();
    _fetchBuildingData();
    console.log("distubance");
  }

  //Setup the UI element listener
  function _setupUIListener(){
    //Add change listener to the building, floor and room select input fields
    $("#buildingSelect")[0].addEventListener("change", _buildingChanged, false);
    $("#floorSelect")[0].addEventListener("change", _floorChanged, false);
    $("#roomSelect")[0].addEventListener("change", _roomChanged, false);
    //Add click listener to the check disturbance buttons
    $(".check-button")[0].addEventListener("click", _checkDisturbanceData, false);
    $(".check-button")[1].addEventListener("click", _checkDisturbanceData, false);
  }

  //Fetch the building, room and floor data file
  //Currently from a csv file
  //TODO fetch the file from the uniR server
  function _fetchBuildingData(){
    $.ajax({
      url: localCSV,
      dataType: "text",
    }).done(_handleCSVData);
    _handleJSONData();
  }

  //Save the csv file data
  //Format: Altes Finanzamt, ALFI*Altes Finanzamt, ALFI*_0  EG*001 Lesesaal slow.*BY.R.L.2700.2700.0.01*0000000000004O1E..
  //Extract the building data
  //Format: ["Altes Finanzamt, ALFI", "Bibliothek, Tiefgarage Ost, TGAO", ..]
  //Save the general and the exact building data together in a map
  //Format: {Altes Finanzamt, ALFI: "Altes Finanzamt, ALFI", Bibliothek, Tiefgarage Ost, TGAO: "Bibliothek, Tiefgarage Ost, TGAO", ..}
  function _handleCSVData(data) {
    csvDataRows = data.split(/\r?\n|\r/);
    for (var singleRow = 0; singleRow < csvDataRows.length; singleRow++) {
      rowCells = csvDataRows[singleRow];
      if(rowCells !== ""){
        building.push(rowCells.split("*")[1]);
        buildingGrpMap[rowCells.split("*")[1]] = rowCells.split("*")[0];
      }
    }
    _appendBuildingData(_uniqArray(building));
  }

  //React to user building selections
  //Extract the according special groups and the floor data
  function _buildingChanged(){
    $("#floorSelect")[0].disabled = false;
    activeSelectField = $("#buildingSelect")[0];
    sessionStorage.removeItem("roomCode");

    _extractSpecialGroups(activeSelectField.options[activeSelectField.selectedIndex].value);
    _extractFloorData(activeSelectField.options[activeSelectField.selectedIndex].value);
  }

  //React to user floor selections
  //Save the building and floor data and extract the according room data 
  function _floorChanged(){
    activeSelectField = $("#buildingSelect")[0];
    activeBuilding = activeSelectField.options[activeSelectField.selectedIndex].value;
    activeSelectField = $("#floorSelect")[0];
    activeFloor = activeSelectField.options[activeSelectField.selectedIndex].value;
    sessionStorage.removeItem("roomCode");

    _extractRoomData(activeBuilding, activeFloor);
  }

  //React to user room selections
  //Fetch the building, floor and room data and extract the roomCode
  function _roomChanged(){
    activeSelectField = $("#buildingSelect")[0];
    activeBuilding = activeSelectField.options[activeSelectField.selectedIndex].value;

    activeSelectField = $("#floorSelect")[0];
    activeFloor = activeSelectField.options[activeSelectField.selectedIndex].value;

    activeSelectField = $("#roomSelect")[0];
    activeRoom = activeSelectField.options[activeSelectField.selectedIndex].value;

    _extractRoomCode(activeBuilding, activeFloor, activeRoom);
  }

  //Extract the set of responsible special groups for the active building from the csv file 
  function _extractSpecialGroups(building){
    for(var i = 0; i < jsonData.Datensatz.length; i++){
      if(buildingGrpMap[building] === jsonData.Datensatz[i].Bauwerk){
        responsibleSpecialGroups = jsonData.Datensatz[i];
      }
    }
  }

  //Extract the responsible special group for the active building and the disturbance
  function _extractSpecialGroup(){
    if(document.documentElement.lang == "de"){
      if(sessionStorage.getItem("specialGroup") === "Elektro"){
        respSpecialGroup = "Fachgruppe Starkstrom";
      }else{
        respSpecialGroup = "Fachgruppe " + sessionStorage.getItem("specialGroup");
      }
      respSpecialGroup = responsibleSpecialGroups[respSpecialGroup];
      sessionStorage.setItem("respSpecialGroup", respSpecialGroup);
    }else{
      //The english special group needs to be translated to german first
      respSpecialGroup = "Fachgruppe " + _translateSpecGroup(sessionStorage.getItem("specialGroup"));
      respSpecialGroup = responsibleSpecialGroups[respSpecialGroup];
      sessionStorage.setItem("respSpecialGroup", respSpecialGroup);
    }
  }

  //Handle the json file and extract the data
  function _handleJSONData(){
    $.getJSON(specGrpJSON, function(data) {         
      jsonData = data;
    });
  }

  //Extract the necessary roomcode data from the csv file
  function _extractRoomCode(building, floor, room){
    for (var singleRow = 0; singleRow < csvDataRows.length; singleRow++) {
      rowCells = csvDataRows[singleRow];
      if(rowCells !== "" && rowCells.split("*")[1] == building && rowCells.split("*")[2] == floor && rowCells.split("*")[3] == room){
        sessionStorage.setItem("roomCode", rowCells.split("*")[4]);
      }
    }
  }

  //Check whether the user provided all the necessary disturbance information
  //If yes: save the provided information, extract the special group and submit the disturbance 
  //Else show error alert
  function _checkDisturbanceData(){
    err = false;   
    if(document.documentElement.lang == "de"){
      errMsg = "Folgende Felder fehlen oder sind mit ungültigem Inhalt gefühlt: \n";
      activeSelectField = $(".groupSelect")[1];
      activeTextField = $(".desc-text")[1];
      sessionStorage.getItem("roomCode")
      if(sessionStorage.getItem("roomCode") === null){
        errMsg += "- Raum\n";
        err = true;
      }
      if(activeSelectField.selectedIndex === 0){
        errMsg += "- Fachgruppe\n";
        err = true;
      }
      if(_validateDescription(activeTextField.value)){
        errMsg += "- Beschreibung\n";
        err = true;
      }
      //Save the disturbance data(specialGroup, description)
      sessionStorage.setItem("specialGroup", activeSelectField.options[activeSelectField.selectedIndex].value);
      sessionStorage.setItem("description", activeTextField.value);
    }else{
      errMsg = "Following fields are missing or filled with invalid content: \n";
      activeSelectField = $(".groupSelect")[0];
      activeTextField = $(".desc-text")[0];
      if(sessionStorage.getItem("roomCode") === null){
        errMsg += "- Room\n";
        err = true;
      }
      if(activeSelectField.selectedIndex === 0){
        errMsg += "- Specialist group\n";
        err = true;
      }
      if(_validateDescription(activeTextField.value)){
        errMsg += "- Description\n";
        err = true;
      }
      //Save the disturbance data(specialGroup, description)
      sessionStorage.setItem("specialGroup", activeSelectField.options[activeSelectField.selectedIndex].value);
      sessionStorage.setItem("description", activeTextField.value);
    }
    if(err === false){
      UtilityController.measureStep("Disturbance reported");
      _extractSpecialGroup();
      _submitDisturbance();
    }else{
      alert(errMsg);
    }
  }

  //Translate an english name of a special group into german
  function _translateSpecGroup(englishSpecGroup){
    switch(englishSpecGroup) {
    case "Electric":
        return "Starkstrom";
    case "Heating/Ventilation":
        return "Heizung/Lüftung";
    case "Sanitary":
        return "Sanitär";
    case "Refrigeration":
        return "Kältetechnik";
    case "Windows/Doors":
        return "Fenster/Türen";
    case "Telecommunications":
        return "Nachrichtentechnik";
    default:
        return "Nachrichtentechnik";
    }
  }

  //Fetch the web id for the currently created disturbance report
  function _fetchWebId(){
    placeholderWebId = "1234";
    sessionStorage.setItem("webId", placeholderWebId);
  }

  //Submit the disturbance with all the necessary data
  function _submitDisturbance(){
    disturbance = "";

    _fetchWebId();

    disturbance += placeholderWebId + ";";
    disturbance += localStorage.getItem("userName") + ";";
    disturbance += localStorage.getItem("userPhone") + ";";

    currDate = _getCurrDate();

    disturbance += currDate + ";";
    disturbance += currDate + ";";
    disturbance += currDate + ";";
    disturbance += "Instandsetzung;";
    disturbance += sessionStorage.getItem("description") + ";";
    disturbance += sessionStorage.getItem("roomCode") + ";";
    disturbance += "Fachgruppe;" + sessionStorage.getItem("respSpecialGroup") + ";;";

    //Check whether the user has internet connection
    //If yes: submit the disturbance report
    //If no: Show the fallback offline page
    if(UtilityController.checkOnlineStatus()){
      alert(disturbance);

      //If the user wants to send an aditional picture of the disturbance
      //move on to picture.html
      activeCheckBox = document.getElementById("picCheckbox");
      if(activeCheckBox.checked === true){
        mainView.router.loadPage(pictureURL);
      }
    }else{
      mainView.router.loadPage(offlineURL);
    }
  }

  //Validate the disturbance description
  //Allowed figures: a-Z
  function _validateDescription(description){
    if(descRegex.test(description)){
      console.log("validation false");
      return false;
    }
    console.log("validation true");
    return true;
  }

  //Get the current date and time and return it as string
  //Format: dd.mm.yyyy hh:mm
  function _getCurrDate(){
    var today = new Date(),
        dd = today.getDate(),
        mm = today.getMonth()+1, //January is 0!
        yyyy = today.getFullYear();
        hh = today.getHours();
        minmin = today.getMinutes();

    if(dd<10) {
        dd="0"+dd
    } 

    if(mm<10) {
        mm="0"+mm
    } 

    today = dd + "." + mm + "." + yyyy + " " + hh + ":" + minmin;
    return today;
  }

  //Extract the necessary room data from the csv file
  function _extractRoomData(building, floor){
    room = [];
    for (var singleRow = 0; singleRow < csvDataRows.length; singleRow++) {
      rowCells = csvDataRows[singleRow];
      if(rowCells !== "" && rowCells.split("*")[1] == building && rowCells.split("*")[2] == floor){
        room.push(rowCells.split("*")[3]);
      }
    }
    _appendRoomData(_uniqArray(room));
  }

   //Append the current room data from the csv file to the html site(roomSelect)
  function _appendRoomData(roomList){
    //First, clear the old options from the select item and enable the select input field
    activeSelectField = $("#roomSelect")[0];
    _resetSelectOptions(activeSelectField);
    activeSelectField.disabled = false;

    //Afterwards append the current data
    for(var i = 0; i < roomList.length; i++){
      newOption = document.createElement("option");
      newOption.value = roomList[i];
      if (typeof newOption.textContent === "undefined"){
            newOption.innerText = roomList[i];
        }
        else{
            newOption.textContent = roomList[i];
        }
      activeSelectField.appendChild(newOption);
    }
  }

  //Reset options of a given select input field
  function _resetSelectOptions(mySelect){
    while (mySelect.firstChild) {
        mySelect.removeChild(mySelect.firstChild);
    }
    //Then create a placeholder option for the select input field
    //Depending on the header"s lang attribute in english or german
    _createPlaceHolderOption(mySelect);
  }

  //Create a german/english placeholderoption for a given select input field 
  function _createPlaceHolderOption(mySelect){
    var newOption = document.createElement("option");
    if(document.documentElement.lang == "de"){
      newOption.value = "platzhalter";
      if (typeof newOption.textContent === "undefined"){
        newOption.innerText = "Bitte wählen";
      }
      else{
        newOption.textContent = "Bitte wählen";
      }
      mySelect.appendChild(newOption);
    }else{
      newOption.value = "placeholder";
      if (typeof newOption.textContent === "undefined"){
        newOption.innerText = "Please choose";
      }
      else{
        newOption.textContent = "Please choose";
      }
      mySelect.appendChild(newOption);
    }
  }

  //Extract the necessary floor data from the csv file
  function _extractFloorData(building){
    floor = [];
    for (var singleRow = 0; singleRow < csvDataRows.length; singleRow++) {
      rowCells = csvDataRows[singleRow];
      if(rowCells !== "" && rowCells.split("*")[1] == building){
        floor.push(rowCells.split("*")[2]);
      }
    }
    _appendFloorData(_uniqArray(floor));
  }

  //Append the current floor data from the csv file to the html site(floorSelect)
  function _appendFloorData(floorList){
    //First clear the old options from the select item fields(floorSelect, roomSelect)
    activeSelectField = $("#roomSelect")[0];
    _resetSelectOptions(activeSelectField);
    activeSelectField = $("#floorSelect")[0];
    _resetSelectOptions(activeSelectField);

    //Afterwards append the current data
    for(var i = 0; i < floorList.length; i++){
      var newOption = document.createElement("option");
      newOption.value = floorList[i];
      if (typeof newOption.textContent === "undefined"){
            newOption.innerText = floorList[i];
        }
        else{
            newOption.textContent = floorList[i];
        }
      activeSelectField.appendChild(newOption);
    }
    //Disable the room select input field, as the user has to specify a floor first
    activeSelectField = $("#roomSelect")[0];
    _resetSelectOptions(activeSelectField);
    activeSelectField.disabled = true;
  }

  //Append the buildings data from the csv file to the html site
  function _appendBuildingData(buildingList){
    //First, create a placeholder option for the select input field
    //(buildingSelect, floorSelect, roomSelect)
    //Depending on the header"s lang attribute in english or german
    activeSelectField = $("#floorSelect")[0];
    _resetSelectOptions(activeSelectField);
    //Disable the floor and the room select input fields, as the user has to specify a building and a floor first
    activeSelectField.disabled = true;
    activeSelectField = $("#roomSelect")[0];
    _resetSelectOptions(activeSelectField);
    activeSelectField.disabled = true;
    activeSelectField = $("#buildingSelect")[0];
    _resetSelectOptions(activeSelectField);

    //Afterwards append the current data
    for(var i = 0; i < buildingList.length; i++){
      var newOption = document.createElement("option");
      newOption.value = buildingList[i];
      if (typeof newOption.textContent === "undefined"){
            newOption.innerText = buildingList[i];
        }
        else{
            newOption.textContent = buildingList[i];
        }
      activeSelectField.appendChild(newOption);
    }
  }

  //Delete the redundant items of an array
  function _uniqArray(array) {
    var seen = {};
    return array.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }

  return {
    init: init,
  };
  
})();
