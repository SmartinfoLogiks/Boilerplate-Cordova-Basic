var _CURRENT_PAGE = "#home";

function loadAppCore() {
  pageHash = window.location.hash;
  
  registerEventListeners();

  logiksWorkers.initialize();
  
  $("#templates").load("app/comps/templates.html", function() {
        if(typeof appLoadComplete == "function") {
            appLoadComplete(pageHash);
        } else {
            loadPage(pageHash);

            if (typeof loadMenus == "function") loadMenus();
            if (typeof loadUserinfoBar == "function") loadUserinfoBar();
        }
    });

  loadPage(pageHash);
  
  //loadMenus();
  //loadUserinfoBar();
  
  if(typeof window['initApp']=="function") initApp();
}
function reloadAppCore(pageRef) {
  cleanWorkspace();
  //loadPage(pageRef);
  //loadMenus();
  //loadUserinfoBar();
  
  //reinitApp();
  
  $("#templates").load("app/comps/templates.html", function() {
        loadPage(pageHash);

        if (typeof loadMenus == "function") loadMenus();
        if (typeof loadUserinfoBar == "function") loadUserinfoBar();

        if (typeof window['reinitApp'] == "function") reinitApp();
    });
}

function registerEventListeners() {
  $("body").delegate("a.pageLink[href],a.btn-link[href],.gotoLink[href]", "click", function(e) {
      href = $(this).attr("href");
      if (href != null && href.length > 1 && href.substr(0, 1) == "#") {
        //href = href.substr(1);
		    //href1 = href.split("/");
		    loadPage(href);
      }
    });

  $("body").delegate("a.inappLink[href],a.inapp-link[href],.inappLink[href]","click",function(e) {
            href=$(this).attr("href");
            if($(this).hasClass("browser") || $(this).hasClass("inbrowser")) {
              cordova.InAppBrowser.open(href, '_blank', 'location=no');  
            } else {
              navigator.app.loadUrl(href, { openExternal:true });
              //cordova.InAppBrowser.open(href, '_system', 'location=yes');
            }
        });
	
  $("body").delegate(".actionCmd[cmd],.actionCMD[cmd],.actionIcon[cmd]", "click", function(e) {
		e.preventDefault();

		cmd = $(this).attr("cmd");

		if (window[cmd] != null && typeof window[cmd] == "function") {
			window[cmd](this);
		} else {
			console.info("Command Not Found", cmd);
		}
	});
	$("body").delegate(".goBackLink", "click", function(e) {
		goBack();
	});
	
	//System Event
	document.addEventListener("backbutton", function(e) {goBack();}, false);
}

function registerPageEvents() {
  
}

function cleanWorkspace() {
  $("#mainContainer").html("");
  $("#templates").html("");
}

function loadPage(pageRef, callBack) {
    if (pageRef == null || pageRef.length <= 0) {
        pageRef = appConfig.PAGEHOME;
    }
    if (pageRef.substr(0, 1) == "#") {
        pageRef = pageRef.substr(1);
    }
    pageRefOriginal = pageRef;
    pageRef = pageRef.split("@")[0];

    if (appConfig.PAGECONFIG.NOHEADER != null && appConfig.PAGECONFIG.NOHEADER.length > 0) {
        if (appConfig.PAGECONFIG.NOHEADER.inArray(pageRef)) {
            $("#topbar").hide();
        } else {
            $("#topbar").show();
        }
    }

    //No Footer Required
    if (appConfig.PAGECONFIG.NOFOOTER != null && appConfig.PAGECONFIG.NOFOOTER.length > 0) {
        if (appConfig.PAGECONFIG.NOFOOTER.inArray(pageRef)) {
            $("#footer").hide();
        } else {
            $("#footer").show();
        }
    }

    //Login Required
    if (appConfig.PAGECONFIG.NOLOGIN != null && appConfig.PAGECONFIG.NOLOGIN.length > 0) {
        if (!appConfig.PAGECONFIG.NOLOGIN.inArray(pageRef)) {
            if (!_AUTH.isLoggedIn()) {
                loadPage("#login");
                lgksToast("Login Required");
                return;
            }
        }
    }
    if (typeof window['trackView'] == "function") trackView("pageview", pageRef.toUpperCase());
    //cleanWorkspace();
    if (["login", "register", "forgotpwd","forgot-password", "resetpwd","reset-password", "pwd"].indexOf(pageRef) < 0) {
        appPageHistory.push(pageRefOriginal);

        pageLast = pageCurrent;
        pageCurrent = pageRefOriginal;
    }

    $.get("app/pages/" + pageRef + ".html", function(html) {
        _CURRENT_PAGE = pageRefOriginal;

        //Internationalization Of HTML Content
        html = html.replace(/#[a-zA-Z0-9-_,.]+#/gi, htmlContentReplacer);

        updateTitle(pageRef.toTitle());

        $("body").attr("class", pageRef.replace(/[^\w\s]/gi, '_') + "-body app");
        $("#mainContainer").attr("class", pageRef + "-view container-fluid").html(html);

        registerPageEvents();
        //_TRIGGERS.runTriggers('onPagePostload',pageRef);
    }).done(function() {
        initAjaxListUI();
        pageLoaded(pageRef, "success");
        _TRIGGERS.runTriggers('onPageLoad', pageRef);
    }).fail(function() {
        pageLoaded(pageRef, "error");
        _TRIGGERS.runTriggers('onPageError', pageRef);
    }).always(function() {
        pageTitle = pageRef.replace("#", "").replace("_", " ").capitalize();
        //Update Menu Title
        $(".TOPBAR-TITLE").html(pageTitle);
        //Initiate Page Elements
        //Load components
        //Initiate Events

        if (callBack != null) {
            if (typeof callBack == "function") {
                callBack(pageRef);
            } else if (window[callBack] != null && typeof window[callBack] == "function") {
                window[callBack](pageRef);
            }
        }
    });
}

function loadTemplate(compName, callBack) {
    //$.getScript("./app/comps/topbar/index.js", function() {});
    $.get("app/templates/" + compName + "/index.html", function(html) {
        $("#templates").find("#"+compName).detach();
        $("#templates").append("<div id='" + compName + "'>" + html + "</div>");

        _TRIGGERS.runTriggers('onComponentLoad', compName);

        if(typeof callBack == "function") {
            callBack(compName);
        } else if (callBack != null && window[callBack] != null) {
            window[callBack](compName);
        }
    });
}

function loadComponent(compName, devID, callBack) {
    //$.getScript("./app/comps/topbar/index.js", function() {});
    $.get("app/comps/" + compName + "/index.html", function(html) {
        $(devID).html(html);

        _TRIGGERS.runTriggers('onComponentLoad', compName);

        if(typeof callBack == "function") {
            callBack(compName);
        } else if (callBack != null && window[callBack] != null) {
            window[callBack](compName);
        }
    });
}



$(document).on("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
});
