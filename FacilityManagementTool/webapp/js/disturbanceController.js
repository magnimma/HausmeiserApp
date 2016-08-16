
DisturbanceController = (function() {

  var newUrl = "https://appsso.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/raumliste.csv";
  var localCSV = "csv/raumliste.csv";
  var csvDataRows;

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
    var myselect = document.getElementById("buildingSelect");

    _extractFloorData(myselect.options[myselect.selectedIndex].value);
  }

  //react to user floor selections
  function onFloorChanged(){
    var myBuildingSelect = document.getElementById("buildingSelect");
    var myFloorSelect = document.getElementById("floorSelect");
    var activeBuilding = myBuildingSelect.options[myBuildingSelect.selectedIndex].value;
    var activeFloor = myFloorSelect.options[myFloorSelect.selectedIndex].value;

    _extractRoomData(activeBuilding, activeFloor);
  }

  //react to user floor selections
  function onRoomChanged(){
    var myBuildingSelect = document.getElementById("buildingSelect");
    var myFloorSelect = document.getElementById("floorSelect");
    var myRoomSelect = document.getElementById("roomSelect");
    var activeBuilding = myBuildingSelect.options[myBuildingSelect.selectedIndex].value;
    var activeFloor = myFloorSelect.options[myFloorSelect.selectedIndex].value;
    var activeRoom = myRoomSelect.options[myRoomSelect.selectedIndex].value;

    _extractRoomCode(activeBuilding, activeFloor, activeRoom);
  }

  //extract the necessary room data from the csv file
  function _extractRoomCode(building, floor, room){
    var roomCode;
    var allRows = csvDataRows;
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      var rowCells = allRows[singleRow];
      if(rowCells != "" && rowCells.split('*')[1] == building && rowCells.split('*')[2] == floor && rowCells.split('*')[3] == room){
        roomCode = rowCells.split('*')[4];
        console.log('Raumcode: ' + roomCode);
      }
    }
  }

  //extract the necessary room data from the csv file
  function _extractRoomData(building, floor){
    console.log(building, floor);
    var room = [];
    var allRows = csvDataRows;
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      var rowCells = allRows[singleRow];
      if(rowCells != "" && rowCells.split('*')[1] == building && rowCells.split('*')[2] == floor){
        console.log(rowCells.split('*')[2] + 'floor' + floor);
        room.push(rowCells.split('*')[3]);
      }
    }
    _appendRoomData(_uniqArray(room));
  }

   //append the current room data from the csv file to the html site
  function _appendRoomData(roomList){
    //first clear the old options from the select item
    var mySelect = document.getElementById("roomSelect");
    while (mySelect.firstChild) {
        mySelect.removeChild(mySelect.firstChild);
    }

    //afterwards append the current data
    for(var i = 0; i < roomList.length; i++){
      var mySelect = document.getElementById('roomSelect');
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

  //extract the necessary floor data from the csv file
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

  //append the current floor data from the csv file to the html site
  function _appendFloorData(floorList){
    //first clear the old options from the select item
    var mySelect = document.getElementById("floorSelect");
    while (mySelect.firstChild) {
        mySelect.removeChild(mySelect.firstChild);
    }

    //afterwards append the current data
    for(var i = 0; i < floorList.length; i++){
      var mySelect = document.getElementById('floorSelect');
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
  }

  //append the buildings data from the csv file to the html site
  function _appendBuildingData(buildingList){
    for(var i = 0; i < buildingList.length; i++){
      var mySelect = document.getElementById('buildingSelect');
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

  // deletes the redundant items of an array
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
    onRoomChanged: onRoomChanged
  };
  
})();
