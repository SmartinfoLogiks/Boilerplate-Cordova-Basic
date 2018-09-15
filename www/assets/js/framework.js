var appConfig = {};

function loadAppCore() {
  pageHash = window.location.hash;
  
  loadPage(pageHash);
  
  //loadPage("home");
  //loadMenus();
  //loadUserinfoBar();
  //pageBrowser();
}
function cleanWorkspace() {
  $("#mainContainer").html("");
  $("#templates").html("");
}

function loadPage(pageRef, callBack) {
  if(pageRef==null || pageRef.length<=0) {
    pageRef = appConfig.PAGEHOME;
  }
  if(pageRef.substr(0,1)=="#") {
    pageRef = pageRef.substr(1);
  }
  //cleanWorkspace();
  
  $.get("app/pages/" + pageRef + ".html", function(html) {
		//Internationalization Of HTML Content
		html = html.replace(/#[a-zA-Z0-9-_,.]+#/gi, htmlContentReplacer);
		
		//updateTitle(pageRef.toTitle());
		
		$("body").attr("class",pageRef+"-body app");
		$("#mainContainer").attr("class",pageRef+"-view container-fluid").html(html);

		//_TRIGGERS.runTriggers('onPagePostload',pageRef);
	}).done(function() {
		_TRIGGERS.runTriggers('onPageLoad', pageRef);
	}).fail(function() {
		_TRIGGERS.runTriggers('onPageError', pageRef);
	}).always(function() {
    
    //Update Menu Title
    //Initiate Page Elements
    //Load components
    //Initiate Events
    
		if(callBack!=null && window[callBack]!=null) {
      window[callBack](compName);
    }
	});
}

function loadComponent(compName, callBack) {
  //$.getScript("./app/comps/topbar/index.js", function() {});
  $.get("app/comps/" + compName + "/index.html", function(html) {
    $("#templates").append("<div id='"+compName+"'>"+html+"</div>");
    
    _TRIGGERS.runTriggers('onComponentLoad', compName);
    
    if(callBack!=null && window[callBack]!=null) {
      window[callBack](compName);
    }
  });
}



$(document).on("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
});