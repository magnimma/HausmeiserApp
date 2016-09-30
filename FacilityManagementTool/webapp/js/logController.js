//The loggingController loggs the time that the user needs to reach the key steps of the disturbance report
//Steps: 
var UtilityController = (function() {

      //Variable containing the starting time of the logging process
  var startTime = 0,
      start = 0,
      end = 0,

      //Variable containing the current date
      date = "",

      //Variable containing the current logging step
      step = "NDS-Account Login",

      //Variable showing whether the user has an internet connection or not
      status = navigator.onLine;

  //Initiate the loggingController and start logging
  function init(){
    start = new Date().getTime();
  }

  //Measure the current step and log it to the console
  function measureStep(currentStep){
    //console.log(start);
    end = new Date().getTime();
    //console.log(end);
    console.log(currentStep + ": " + (end - start)/1000);
    start = new Date().getTime();
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
    checkOnlineStatus: checkOnlineStatus
  };
  
})();
