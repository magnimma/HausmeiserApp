
DataController = (function() {

  var fmEmail = 'jayjay93@gmx.de',
      myInput;

  //Initiate the dataController, the UIelements and the eventhandler
  function init() {
    myInput = document.getElementsByClassName('myFileInput')[0];
    mySendPicBtn1 = document.getElementsByClassName('send-picture')[0];
    mySendPicBtn2 = document.getElementsByClassName('send-picture')[1];
    mySendPicBtn1.addEventListener('click', _sendMail, false);
    mySendPicBtn2.addEventListener('click', _sendMail, false);
    myTakePicBtn1 = document.getElementsByClassName('take-picture')[0];
    myTakePicBtn2 = document.getElementsByClassName('take-picture')[1];
    myTakePicBtn1.addEventListener('click', _takePic, false);
    myTakePicBtn2.addEventListener('click', _takePic, false);
  }

  //Open the native mail app with prefilled address
  function _sendMail() {
    window.location.href = 'mailto:' + fmEmail;
  }

  //Open the native mail app with prefilled address
  function _takePic() {
    console.log('click trigger');
    console.log(myInput)
    _fireClick(myInput);
  }

  function _fireClick(node){
    if (document.createEvent) {
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, false);
        node.dispatchEvent(evt);    
    } else if (document.createEventObject) {
        node.fireEvent('onclick') ; 
    } else if (typeof node.onclick == 'function') {
        node.onclick(); 
    }
}

  return {
    init: init
  };
  
})();
