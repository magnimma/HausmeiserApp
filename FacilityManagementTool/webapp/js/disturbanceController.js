
DisturbanceController = (function() {

  var newUrl = "https://appsso.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/raumliste.csv",      
      pictureURL = 'picture.html',
      localCSV = "csv/raumliste.csv",
      sendURL = 'form.html',
      csvDataRows,
      roomCode,
      specialGroup,
      description;

  //change the html site when the user entered a correct NDS-account
  //or show an error alert when the NDS-account is wrong
  var fetchBuildingData = function(){
    console.log("fetch");
    
    /*Uncaught syntax error
    $.ajax({
    url: newUrl,
    dataType: 'JSONP',
    jsonpCallback: 'callback',
    type: 'GET',
    success: function (data) {
        console.log(data);
    }
    });
*/

/*  No Access Control Origin header
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
              console.log(xmlHttp.responseText);
      }
      xmlHttp.open("GET", newUrl, true); // true for asynchronous 
      xmlHttp.send(null);
    */

    $.ajax({
      url: localCSV,
      dataType: 'text',
    }).done(_handleCSVData);

  }

  //extract the necessary data from the csv file
  //buildings, floors, roomNumbers and roomCodes
  function _handleCSVData(data) {
    var allRows = data.split(/\r?\n|\r/);
    var building = [];
    var floor = [];
    var roomNumber = [];
    var roomCode = [];
    csvDataRows = allRows;
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      var rowCells = allRows[singleRow];
      if(rowCells != ""){
        building.push(rowCells.split('*')[1]);
        /* alte Einteilung
        if(rowCells[2].split(" ")[3] != undefined){
          floor.push(rowCells[2].split(" ")[3].split("*")[0]);
          roomNumber.push(rowCells[2].split(" ")[3].split("*")[1]);
        }
        if(rowCells[2].split(" ")[4] != undefined){
          roomCode.push(rowCells[2].split(" ")[4].split("*")[1]);
        }
        */
        floor.push(rowCells.split('*')[2]);
        roomNumber.push(rowCells.split('*')[3]);
        roomCode.push(rowCells.split('*')[4]);
      }
    }
    _appendBuildingData(_uniqArray(building));
  }

  //react to user building selections
  function onBuildingChanged(){
    var mySelect = document.getElementById("floorSelect");
    mySelect.disabled = false;
    mySelect = document.getElementById("buildingSelect");
    roomCode = undefined;

    _extractFloorData(mySelect.options[mySelect.selectedIndex].value);
  }

  //react to user floor selections
  function onFloorChanged(){
    var myBuildingSelect = document.getElementById("buildingSelect");
    var myFloorSelect = document.getElementById("floorSelect");
    var activeBuilding = myBuildingSelect.options[myBuildingSelect.selectedIndex].value;
    var activeFloor = myFloorSelect.options[myFloorSelect.selectedIndex].value;
    roomCode = undefined;

    _extractRoomData(activeBuilding, activeFloor);
  }

  //react to user room selections
  function onRoomChanged(){
    var myBuildingSelect = document.getElementById("buildingSelect");
    var myFloorSelect = document.getElementById("floorSelect");
    var myRoomSelect = document.getElementById("roomSelect");
    var activeBuilding = myBuildingSelect.options[myBuildingSelect.selectedIndex].value;
    var activeFloor = myFloorSelect.options[myFloorSelect.selectedIndex].value;
    var activeRoom = myRoomSelect.options[myRoomSelect.selectedIndex].value;

    _extractRoomCode(activeBuilding, activeFloor, activeRoom);
  }

  //Extract the necessary room data from the csv file
  function _extractRoomCode(building, floor, room){
    var allRows = csvDataRows;
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      var rowCells = allRows[singleRow];
      if(rowCells != "" && rowCells.split('*')[1] == building && rowCells.split('*')[2] == floor && rowCells.split('*')[3] == room){
        roomCode = rowCells.split('*')[4];
        sessionStorage.setItem('roomCode', rowCells.split('*')[4]);
        console.log('Raumcode: ' + roomCode);
      }
    }
  }

  //Check whether the user provided all the necessary disturbance information
  //If yes move on
  //Else show error alert
  function checkDisturbanceData(){
    var errMsg = 'Following fields are missing: \n',
        myGroupSelect1 = document.getElementsByClassName('groupSelect')[0],
        myGroupSelect2 = document.getElementsByClassName('groupSelect')[1],
        myTextArea1 = document.getElementsByClassName('desc-text')[0],
        myTextArea2 = document.getElementsByClassName('desc-text')[1],
        err = false;   
    if(document.documentElement.lang == 'de'){
      errMsg = 'Folgende Felder fehlen: \n';
      if(sessionStorage.getItem('roomCode') == undefined){
        errMsg += '- Raum\n';
        err = true;
      }
      if(myGroupSelect2.selectedIndex == 0){
        errMsg += '- Fachgruppe\n';
        err = true;
      }
      if(myTextArea2.value == ''){
        errMsg += '- Beschreibung\n';
        err = true;
      }
      //Save the disturbance data(specialGroup, description)
      specialGroup = myGroupSelect2.options[myGroupSelect2.selectedIndex].value;
      description = myTextArea2.value;
      sessionStorage.setItem('specialGroup', myGroupSelect2.options[myGroupSelect2.selectedIndex].value);
      sessionStorage.setItem('description', myTextArea2.value);
    }else{
      if(sessionStorage.getItem('roomCode') == undefined){
        errMsg += '- Room\n';
        err = true;
      }
      if(myGroupSelect1.selectedIndex == 0){
        errMsg += '- Specialist group\n';
        err = true;
      }
      if(myTextArea1.value == ''){
        errMsg += '- Description\n';
        err = true;
      }
      //Save the disturbance data(specialGroup, description)
      specialGroup = myGroupSelect1.options[myGroupSelect1.selectedIndex].value;
      description = myTextArea1.value;
      sessionStorage.setItem('specialGroup', myGroupSelect1.options[myGroupSelect1.selectedIndex].value);
      sessionStorage.setItem('description', myTextArea1.value);
    }
    if(err == false){
//      mainView.router.loadPage(sendURL);
      _submitDisturbance();
    }else{
      alert(errMsg);
    }
  }

  //Submit the disturbance with all the necessary data
  function _submitDisturbance(){
    var disturbance = '',
        userData = LoginController.getUserData();
    
    //Method 1: global variables

    //First, append the user data
    /*
    for(var i = 0; i < userData.length; i++){
      disturbance += userData[i] + ', ';
    }
    //Then append the disturbance data
    disturbance += roomCode + ', ';
    disturbance += specialGroup + ', ';
    disturbance += description;
    */

    //Method 2: session storage
    disturbance += sessionStorage.getItem('userName') + ', ';
    disturbance += sessionStorage.getItem('userMail') + ', ';
    disturbance += sessionStorage.getItem('userPhone') + ', ';

    disturbance += sessionStorage.getItem('roomCode') + ', ';
    disturbance += sessionStorage.getItem('specialGroup') + ', ';
    disturbance += sessionStorage.getItem('description');

    alert(disturbance);
    
    //If the user wants to send an aditional picture of the disturbance
    //move on to picture.html
    var myBuildingSelect = document.getElementById("picCheckbox");
    if(myBuildingSelect.checked == true){
      mainView.router.loadPage(pictureURL);
    }
  }

  //Extract the necessary room data from the csv file
  function _extractRoomData(building, floor){
    var room = [];
    var allRows = csvDataRows;
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      var rowCells = allRows[singleRow];
      if(rowCells != "" && rowCells.split('*')[1] == building && rowCells.split('*')[2] == floor){
        room.push(rowCells.split('*')[3]);
      }
    }
    _appendRoomData(_uniqArray(room));
  }

   //Append the current room data from the csv file to the html site
  function _appendRoomData(roomList){
    //First, clear the old options from the select item and enable the select input field
    var mySelect = document.getElementById("roomSelect");
    resetSelectOptions(mySelect);
    mySelect.disabled = false;

    //Afterwards append the current data
    for(var i = 0; i < roomList.length; i++){
      var newOption = document.createElement('option');
      newOption.value = roomList[i];
      if (typeof newOption.textContent === 'undefined'){
            newOption.innerText = roomList[i];
        }
        else{
            newOption.textContent = roomList[i];
        }
      mySelect.appendChild(newOption);
    }
  }

  //Reset options of a given select input field
  function resetSelectOptions(mySelect){
    while (mySelect.firstChild) {
        mySelect.removeChild(mySelect.firstChild);
    }
    //Then create a placeholder option for the select input field
    //Depending on the header's lang attribute in english or german
    _createPlaceHolderOption(mySelect);
  }

  //Create a german/english placeholderoption for a given select input field 
  function _createPlaceHolderOption(mySelect){
    var newOption = document.createElement('option');
    if(document.documentElement.lang == 'de'){
      newOption.value = 'platzhalter';
      if (typeof newOption.textContent === 'undefined'){
        newOption.innerText = 'Bitte wählen';
      }
      else{
        newOption.textContent = 'Bitte wählen';
      }
      mySelect.appendChild(newOption);
    }else{
      newOption.value = 'placeholder';
      if (typeof newOption.textContent === 'undefined'){
        newOption.innerText = 'Please choose';
      }
      else{
        newOption.textContent = 'Please choose';
      }
      mySelect.appendChild(newOption);
    }
  }

  //Extract the necessary floor data from the csv file
  function _extractFloorData(building){
    var floor = [];
    var allRows = csvDataRows;
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      var rowCells = allRows[singleRow];
      if(rowCells != "" && rowCells.split('*')[1] == building){
        floor.push(rowCells.split('*')[2]);
      }
    }
    _appendFloorData(_uniqArray(floor));
  }

  //Append the current floor data from the csv file to the html site
  function _appendFloorData(floorList){
    //First clear the old options from the select item fields(floorSelect, roomSelect)
    var mySelect = document.getElementById("roomSelect");
    resetSelectOptions(mySelect);
    var mySelect = document.getElementById("floorSelect");
    resetSelectOptions(mySelect);

    //Afterwards append the current data
    for(var i = 0; i < floorList.length; i++){
      var newOption = document.createElement('option');
      newOption.value = floorList[i];
      if (typeof newOption.textContent === 'undefined'){
            newOption.innerText = floorList[i];
        }
        else{
            newOption.textContent = floorList[i];
        }
      mySelect.appendChild(newOption);
    }
    //Disable the room select input field, as the user has to specify a floor first
    mySelect = document.getElementById('roomSelect');
    resetSelectOptions(mySelect);
    mySelect.disabled = true;
  }

  //Append the buildings data from the csv file to the html site
  function _appendBuildingData(buildingList){
    //First, create a placeholder option for the select input field
    //(buildingSelect, floorSelect, roomSelect)
    //Depending on the header's lang attribute in english or german
    var mySelect = document.getElementById('floorSelect');
    resetSelectOptions(mySelect);
    //Disable the floor and the room select input fields, as the user has to specify a building and a floor first
    mySelect.disabled = true;
    mySelect = document.getElementById('roomSelect');
    resetSelectOptions(mySelect);
    mySelect.disabled = true;
    mySelect = document.getElementById('buildingSelect');
    resetSelectOptions(mySelect);

    //Afterwards append the current data
    for(var i = 0; i < buildingList.length; i++){
      var newOption = document.createElement('option');
      newOption.value = buildingList[i];
      if (typeof newOption.textContent === 'undefined'){
            newOption.innerText = buildingList[i];
        }
        else{
            newOption.textContent = buildingList[i];
        }
      mySelect.appendChild(newOption);
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
