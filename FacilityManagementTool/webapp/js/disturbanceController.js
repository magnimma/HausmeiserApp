
var DisturbanceController = (function() {

      //Links to data and html files
  var newUrl = "https://appsso.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/raumliste.csv",      
      pictureURL = "picture.html",
      localCSV = "csv/raumliste.csv",
      specGrpJSON = "csv/fachgruppen.json",
      sendURL = "form.html",

      //Variable for the value of the specialGroup form field, chosen by the user
      specialGroup = "",

      //Variable for the value of the description input text field, chosen by the user
      description = "",

      //Variable for the building data, containing the available buildings and the according name
      buildingGrpMap = {},
      
      //Variables containing the building, floor, room and roomCode data
      building = [],
      floor = [],
      room = [],
      roomCode = [],

      //Variable containing the currently active select form field
      activeSelectField,

      //Variable containing a new option for a select form field
      newOption,

      //Variable containing the currently active checkBox
      activeCheckBox,

      //Variable containing the currently active text field
      activeTextField,

      //Variables containing the currently active building, floor and room
      //If chosen by the user
      activeBuilding = "",
      activeFloor = "",
      activeRoom = "",

      //Variable containing all rows of the csv file containing the building, floor and room data
      csvDataRows,
      //Variable containing a single row of the csv file containing the building, floor and room data
      rowCells,

      //Variable containing the disturbance text
      disturbance = "",

      //Variable containing the current date
      //Format: dd.mm.yyyy hh:mm
      currDate,

      //Variabel containing the set of responsible special groups for a specific building
      responsibleSpecialGroups,
      //Variable containing the responsible special group for a specific building
      respSpecialGroup,
      
      //Variable containing the number of disturbances sent online
      placeholderWebId = 123,

      //Contains the different special groups data for the different building in json format
      jsonData,

      //Variable containing an error message which is shown when the user
      //hasnt completely filled in all necessary fields of a disturbance
      errMsg = "Following fields are missing: \n";
      //Variable containing boolean value, whether the user made a mistake
      //filling in the necessary distubance data
      err = false;


  //Fetch the building, room and floor data file
  //Currently from a csv file
  //TODO fetch the file from the uniR server
  function fetchBuildingData(){
    $.ajax({
      url: localCSV,
      dataType: "text",
    }).done(_handleCSVData);
    _handleJSONData();
  }

  //Save the csv file data
  //Extract the building data
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

  //react to user building selections
  function onBuildingChanged(){
    activeSelectField = document.getElementById("floorSelect");
    activeSelectField.disabled = false;
    activeSelectField = document.getElementById("buildingSelect");
    roomCode = undefined;

    _extractSpecialGroups(activeSelectField.options[activeSelectField.selectedIndex].value);
    _extractFloorData(activeSelectField.options[activeSelectField.selectedIndex].value);
  }

  //react to user floor selections
  function onFloorChanged(){
    activeSelectField = document.getElementById("buildingSelect");
    activeBuilding = activeSelectField.options[activeSelectField.selectedIndex].value;
    activeSelectField = document.getElementById("floorSelect");
    activeFloor = activeSelectField.options[activeSelectField.selectedIndex].value;
    roomCode = undefined;

    _extractRoomData(activeBuilding, activeFloor);
  }

  //react to user room selections
  //Fetch the building, floor and room data and extract the roomCode
  function onRoomChanged(){
    activeSelectField = document.getElementById("buildingSelect");
    activeBuilding = activeSelectField.options[activeSelectField.selectedIndex].value;

    activeSelectField = document.getElementById("floorSelect");
    activeFloor = activeSelectField.options[activeSelectField.selectedIndex].value;

    activeSelectField = document.getElementById("roomSelect");
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

  //Handle the json file
  function _handleJSONData(){
    $.getJSON(specGrpJSON, function(data) {         
      jsonData = data;
    });
  }

  //Extract the necessary room data from the csv file
  function _extractRoomCode(building, floor, room){
    for (var singleRow = 0; singleRow < csvDataRows.length; singleRow++) {
      rowCells = csvDataRows[singleRow];
      if(rowCells !== "" && rowCells.split("*")[1] == building && rowCells.split("*")[2] == floor && rowCells.split("*")[3] == room){
        roomCode = rowCells.split("*")[4];
        sessionStorage.setItem("roomCode", rowCells.split("*")[4]);
        console.log("Raumcode: " + roomCode);
      }
    }
  }

  //Check whether the user provided all the necessary disturbance information
  //If yes move on
  //Else show error alert
  function checkDisturbanceData(){
    err = false;   
    if(document.documentElement.lang == "de"){
      errMsg = "Folgende Felder fehlen: \n";
      activeSelectField = document.getElementsByClassName("groupSelect")[1];
      activeTextField = document.getElementsByClassName("desc-text")[1];
      sessionStorage.getItem("roomCode")
      if(sessionStorage.getItem("roomCode") === null){
        errMsg += "- Raum\n";
        err = true;
      }
      if(activeSelectField.selectedIndex === 0){
        errMsg += "- Fachgruppe\n";
        err = true;
      }
      if(activeTextField.value === ""){
        errMsg += "- Beschreibung\n";
        err = true;
      }
      //Save the disturbance data(specialGroup, description)
      specialGroup = activeSelectField.options[activeSelectField.selectedIndex].value;
      description = activeTextField.value;
      sessionStorage.setItem("specialGroup", activeSelectField.options[activeSelectField.selectedIndex].value);
      sessionStorage.setItem("description", activeTextField.value);
    }else{
      errMsg = "Following fields are missing: \n";
      activeSelectField = document.getElementsByClassName("groupSelect")[0];
      activeTextField = document.getElementsByClassName("desc-text")[0];
      if(sessionStorage.getItem("roomCode") === null){
        errMsg += "- Room\n";
        err = true;
      }
      if(activeSelectField.selectedIndex === 0){
        errMsg += "- Specialist group\n";
        err = true;
      }
      if(activeTextField.value === ""){
        errMsg += "- Description\n";
        err = true;
      }
      //Save the disturbance data(specialGroup, description)
      specialGroup = activeSelectField.options[activeSelectField.selectedIndex].value;
      description = activeTextField.value;
      sessionStorage.setItem("specialGroup", activeSelectField.options[activeSelectField.selectedIndex].value);
      sessionStorage.setItem("description", activeTextField.value);
    }
    if(err === false){
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

  //Submit the disturbance with all the necessary data
  function _submitDisturbance(){
    disturbance = "";

    disturbance = "Meldungsvorlage: Web_id;Name;Telefon;ErfasstAm;GemeldetAm;Wunschtermin;Auftragsart;Nachricht;Raum_ID;Ausfuehrender;Fachgruppe;Auftragsnummer;Auftragstatus\n Beispielmeldung: 50;Bärbel Jacobi;4962;08.05.2009 12:11;08.05.2009 12:11;08.05.2009 12:11;Instandsetzung;starke Zugluft im Maschinenraum<cr><lf>;BY.R.C.2200.2200.0.03;Fachgruppe;HZG/RLT  BIP,CH,EZ,KIGA,RZ;;"

    //Method 2: session storage
    disturbance += placeholderWebId + ";";
    disturbance += sessionStorage.getItem("userName") + ";";
    disturbance += sessionStorage.getItem("userPhone") + ";";
//    disturbance += sessionStorage.getItem("userMail") + ", ";

    currDate = _getCurrDate();

    disturbance += currDate + ";";
    disturbance += currDate + ";";
    disturbance += currDate + ";";
    disturbance += "Instandsetzung;";
    disturbance += sessionStorage.getItem("description") + ";";
    disturbance += sessionStorage.getItem("roomCode") + ";";
    disturbance += "Fachgruppe;" + sessionStorage.getItem("respSpecialGroup") + ";;";

    alert(disturbance);
    
    //If the user wants to send an aditional picture of the disturbance
    //move on to picture.html
    activeCheckBox = document.getElementById("picCheckbox");
    if(activeCheckBox.checked === true){
      mainView.router.loadPage(pictureURL);
    }
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

   //Append the current room data from the csv file to the html site
  function _appendRoomData(roomList){
    //First, clear the old options from the select item and enable the select input field
    activeSelectField = document.getElementById("roomSelect");
    resetSelectOptions(activeSelectField);
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
  function resetSelectOptions(mySelect){
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

  //Append the current floor data from the csv file to the html site
  function _appendFloorData(floorList){
    //First clear the old options from the select item fields(floorSelect, roomSelect)
    activeSelectField = document.getElementById("roomSelect");
    resetSelectOptions(activeSelectField);
    activeSelectField = document.getElementById("floorSelect");
    resetSelectOptions(activeSelectField);

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
    activeSelectField = document.getElementById("roomSelect");
    resetSelectOptions(activeSelectField);
    activeSelectField.disabled = true;
  }

  //Append the buildings data from the csv file to the html site
  function _appendBuildingData(buildingList){
    //First, create a placeholder option for the select input field
    //(buildingSelect, floorSelect, roomSelect)
    //Depending on the header"s lang attribute in english or german
    activeSelectField = document.getElementById("floorSelect");
    resetSelectOptions(activeSelectField);
    //Disable the floor and the room select input fields, as the user has to specify a building and a floor first
    activeSelectField.disabled = true;
    activeSelectField = document.getElementById("roomSelect");
    resetSelectOptions(activeSelectField);
    activeSelectField.disabled = true;
    activeSelectField = document.getElementById("buildingSelect");
    resetSelectOptions(activeSelectField);

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
    fetchBuildingData: fetchBuildingData,
    onBuildingChanged: onBuildingChanged,
    onFloorChanged: onFloorChanged,
    onRoomChanged: onRoomChanged,
    checkDisturbanceData: checkDisturbanceData,
    resetSelectOptions: resetSelectOptions
  };
  
})();
