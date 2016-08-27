
var DisturbanceController = (function() {

  var newUrl = "https://appsso.uni-regensburg.de/Einrichtungen/TZ/famos/stoerung/raumliste.csv",      
      pictureURL = 'picture.html',
      localCSV = "csv/raumliste.csv",
      specGrpJSON = 'csv/fachgruppen.json',
      jsonData,
      sendURL = 'form.html',
      csvDataRows,
      roomCode,
      specialGroup,
      description,
      buildingGrpMap = {},
      building = [],
      floor = [],
      roomNumber = [],
      roomCode = [],
      allRows,
      mySelect,
      myBuildingSelect,
      myFloorSelect,
      myRoomSelect,
      activeBuilding,
      activeFloor,
      activeRoom,
      rowCells,
      disturbance,
      currDate,
      specGrpData,
      responsibleSpecialGroups,
      placeholderWebId = 123;


  //Fetch the building, room and floor data file
  //Currently from a csv file
  //TODO fetch the file from the uniR server
  var fetchBuildingData = function(){
    $.ajax({
      url: localCSV,
      dataType: 'text',
    }).done(_handleCSVData);
    _handleJSONData();
  }

  //Save the csv file data
  //Extract the building data
  function _handleCSVData(data) {
    allRows = data.split(/\r?\n|\r/);
    csvDataRows = allRows;
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      rowCells = allRows[singleRow];
      if(rowCells !== ''){
        building.push(rowCells.split('*')[1]);
        buildingGrpMap[rowCells.split('*')[1]] = rowCells.split('*')[0];
      }
    }
    _appendBuildingData(_uniqArray(building));
  }

  //react to user building selections
  function onBuildingChanged(){
    mySelect = document.getElementById("floorSelect");
    mySelect.disabled = false;
    mySelect = document.getElementById("buildingSelect");
    roomCode = undefined;

      _extractSpecialGroups(mySelect.options[mySelect.selectedIndex].value);
    _extractFloorData(mySelect.options[mySelect.selectedIndex].value);
  }

  //react to user floor selections
  function onFloorChanged(){
    myBuildingSelect = document.getElementById("buildingSelect");
    myFloorSelect = document.getElementById("floorSelect");
    activeBuilding = myBuildingSelect.options[myBuildingSelect.selectedIndex].value;
    activeFloor = myFloorSelect.options[myFloorSelect.selectedIndex].value;
    roomCode = undefined;

    _extractRoomData(activeBuilding, activeFloor);
  }

  //react to user room selections
  //Fetch the building, floor and room data and extract the roomCode
  function onRoomChanged(){
    myBuildingSelect = document.getElementById("buildingSelect");
    myFloorSelect = document.getElementById("floorSelect");
    myRoomSelect = document.getElementById("roomSelect");
    activeBuilding = myBuildingSelect.options[myBuildingSelect.selectedIndex].value;
    activeFloor = myFloorSelect.options[myFloorSelect.selectedIndex].value;
    activeRoom = myRoomSelect.options[myRoomSelect.selectedIndex].value;

    _extractRoomCode(activeBuilding, activeFloor, activeRoom);
  }

  //Extract the responsible special groups for the active building from the csv file 
  function _extractSpecialGroups(building){
    console.log(building);
    for(var i = 0; i < jsonData.Datensatz.length; i++){
      if(buildingGrpMap[building] === jsonData.Datensatz[i].Bauwerk){
        //TODO chosen special group and buildingGrpMap[i] vergleichen
        responsibleSpecialGroups = jsonData.Datensatz[i];
      }
    }
  }

  //Extract the responsible special group for the active building and the disturbance
  function _extractSpecialGroup(){
//    console.log(activeBuilding);
//    console.log(responsibleSpecialGroups);
    var respSpecialGroup = 'Fachgruppe ' + sessionStorage.getItem('specialGroup');
//    console.log(respSpecialGroup);    
    respSpecialGroup = responsibleSpecialGroups[respSpecialGroup];
//    console.log(respSpecialGroup);
    sessionStorage.setItem('respSpecialGroup', respSpecialGroup);
  }

  //Handle the json file
  function _handleJSONData(){
    $.getJSON(specGrpJSON, function(data) {         
      jsonData = data;
    });
  }

  //Extract the necessary room data from the csv file
  function _extractRoomCode(building, floor, room){
    allRows = csvDataRows;
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      rowCells = allRows[singleRow];
      if(rowCells !== '' && rowCells.split('*')[1] == building && rowCells.split('*')[2] == floor && rowCells.split('*')[3] == room){
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
      if(sessionStorage.getItem('roomCode') === null){
        errMsg += '- Raum\n';
        err = true;
      }
      if(myGroupSelect2.selectedIndex === 0){
        errMsg += '- Fachgruppe\n';
        err = true;
      }
      if(myTextArea2.value === ''){
        errMsg += '- Beschreibung\n';
        err = true;
      }
      //Save the disturbance data(specialGroup, description)
      specialGroup = myGroupSelect2.options[myGroupSelect2.selectedIndex].value;
      description = myTextArea2.value;
      sessionStorage.setItem('specialGroup', myGroupSelect2.options[myGroupSelect2.selectedIndex].value);
      sessionStorage.setItem('description', myTextArea2.value);
    }else{
      if(sessionStorage.getItem('roomCode') === null){
        errMsg += '- Room\n';
        err = true;
      }
      if(myGroupSelect1.selectedIndex === 0){
        errMsg += '- Specialist group\n';
        err = true;
      }
      if(myTextArea1.value === ''){
        errMsg += '- Description\n';
        err = true;
      }
      //Save the disturbance data(specialGroup, description)
      specialGroup = myGroupSelect1.options[myGroupSelect1.selectedIndex].value;
      description = myTextArea1.value;
      sessionStorage.setItem('specialGroup', myGroupSelect1.options[myGroupSelect1.selectedIndex].value);
      sessionStorage.setItem('description', myTextArea1.value);
    }
    if(err === false){
//      mainView.router.loadPage(sendURL);
      _extractSpecialGroup();
      _submitDisturbance();
    }else{
      alert(errMsg);
    }
  }

  //Submit the disturbance with all the necessary data
  function _submitDisturbance(){
    disturbance = '';

    disturbance = 'Meldungsvorlage: Web_id;Name;Telefon;ErfasstAm;GemeldetAm;Wunschtermin;Auftragsart;Nachricht;Raum_ID;Ausfuehrender;Fachgruppe;Auftragsnummer;Auftragstatus\n Beispielmeldung: 50;Bärbel Jacobi;4962;08.05.2009 12:11;08.05.2009 12:11;08.05.2009 12:11;Instandsetzung;starke Zugluft im Maschinenraum<cr><lf>;BY.R.C.2200.2200.0.03;Fachgruppe;HZG/RLT  BIP,CH,EZ,KIGA,RZ;;'

    //Method 2: session storage
    disturbance += placeholderWebId + ';';
    disturbance += sessionStorage.getItem('userName') + ';';
    disturbance += sessionStorage.getItem('userPhone') + ';';
//    disturbance += sessionStorage.getItem('userMail') + ', ';

    currDate = _getCurrDate();

    disturbance += currDate + ';';
    disturbance += currDate + ';';
    disturbance += currDate + ';';
    disturbance += 'Instandsetzung;';
    disturbance += sessionStorage.getItem('description') + ';';
    disturbance += sessionStorage.getItem('roomCode') + ';';
    disturbance += 'Fachgruppe;' + sessionStorage.getItem('respSpecialGroup') + ';;';

    alert(disturbance);
    
    //If the user wants to send an aditional picture of the disturbance
    //move on to picture.html
    var myBuildingSelect = document.getElementById("picCheckbox");
    if(myBuildingSelect.checked === true){
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
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    today = dd + '.' + mm + '.' + yyyy + ' ' + hh + ':' + minmin;
    return today;
  }

  //Extract the necessary room data from the csv file
  function _extractRoomData(building, floor){
    var room = [];
    var allRows = csvDataRows;
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      rowCells = allRows[singleRow];
      if(rowCells !== '' && rowCells.split('*')[1] == building && rowCells.split('*')[2] == floor){
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
      rowCells = allRows[singleRow];
      if(rowCells !== '' && rowCells.split('*')[1] == building){
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
    mySelect = document.getElementById("floorSelect");
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
