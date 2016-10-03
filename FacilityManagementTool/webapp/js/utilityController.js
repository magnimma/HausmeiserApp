//The loggingController loggs the time that the user needs to reach the key steps of the disturbance report
//Steps: 
var UtilityController = (function() {

      //Variable containing the server URL
  var srvPhpURL = 'http://oa.mi.ur.de/~gog59212/FMApp/server/php/',

      
      //Variable containing the starting time of the logging process
      startTime = 0,
      start = 0,
      end = 0,

      //Variable containing the current date
      date = "",

      //Variable containing the current logging step
      currentAction = [],

      //Variable containing all measured user actions
      userActions = [],

      //Variable containing the first saved timestamp of an log array
      timestamp = "";

      //Variable showing whether the user has an internet connection or not
      status = navigator.onLine;

  //Initiate the loggingController and start logging
  function init(){
    start = new Date().getTime();
  }

  //Measure the current step and log it
  function measureStep(currentStep){
    //console.log(start);
    end = new Date().getTime();
    //Push to the log data to an array
    currentAction.push(new Date(Math.floor(Date.now())));
    currentAction.push(currentStep);
    currentAction.push((end - start)/1000);
    //Push the single action log to an array containing all the actions
    userActions.push(currentAction);
    //Reset the sinle action array
    currentAction = [];
    //Save a new start time
    start = new Date().getTime();
  }

  //Send the log array to the webserver
  function sendLog(){
    timestamp = userActions[0][0];
    userActions = JSON.stringify(userActions);
    $.ajax({
      url: srvPhpURL + "log.php",
      type: "POST",
      data: ({"logData": userActions, "timestamp": timestamp}),
      success: function(data) {
        console.log("RETURN" + data);
      }
    });
  }

  //Check whether the user has an internet connection or not
  function checkOnlineStatus(){
    status = navigator.onLine;
      console.log("online: " + navigator.onLine);
      return status;
  }

  return {
    init: init,
    measureStep: measureStep,
    sendLog: sendLog,
    checkOnlineStatus: checkOnlineStatus
  };
  
})();
