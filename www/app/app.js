//Primary Application Javascript, Write code here that can be accessed across app

requirejs([
  "appjs/hbars",
]);

$(function() {
   console.log("App Load Time: ", ((Date.now()-appTimerStart)+1800)/1000,' Secs');
});

function initApp() {
  console.log("App Finish Time: ", ((Date.now()-appTimerStart)+1800)/1000,' Secs');
}

function reinitApp() {
  
}

function pageLoaded(pageRef,loadType) {
  
}