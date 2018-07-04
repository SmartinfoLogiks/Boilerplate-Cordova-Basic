var appConfig = {};
var tempObj = null;
var isAppInForeground = false;
var appPageHistory = [];
var currentUser = null;
var reloadResourceFunc = null;
var appBuild=0;
var appVersion=0;

function pageLoader(msg,size) {
	if (msg == null) msg = "";
	if (size == null) size = "4x";

	$("#photoViewer").detach();

// 	$("#mainContainer").html("<div class='ajaxloading'>" + msg + "</div>");
// 	$("#mainContainer").html("<div class='appLoaderContainer'>" + msg + "<br><div class='appLoaderSpinner fa fa-spinner fa-spin fa-"+size+"'></div></div>");
	
	$("#mainContainer").html("<div class='appLoaderContainerPage'><br>" + msg + "<br><div class='ajaxloading'></div></div>");
}

function goBack() {
    if ($(".modal.in").length > 0) {
    	$(".modal").modal("hide");
    } else if ($(".overlay").length > 0) {
        $(".overlay").fadeOut("slow", function() {
            $(".overlay").detach();
        });
    } else if ($(".modal-backdrop").length > 0) {
		$(".modal-backdrop").detach();
    } else if ($(".cbp-spmenu.cbp-spmenu-open").length > 0) {
        $(".cbp-spmenu.cbp-spmenu-open").removeClass("cbp-spmenu-open");
    } else if(!$("#albumViewer").hasClass("hidden")) {
        closeAlbumViewer();
    } else {
        appPageHistory.pop();
        pg = appPageHistory.pop();
        if (pg == null) {
            if (navigator.app != null) {
		if(cordova.plugins.backgroundMode!=null) {
			if(cordova.plugins.backgroundMode.isEnabled()) {
				cordova.plugins.backgroundMode.moveToBackground();
			} else {
				navigator.app.exitApp();
			}
		} else {
			navigator.app.exitApp();
		}
            } else {
                app.route(appConfig.PAGEHOME);
            }
        } else {
            app.route(pg);
        }
    }
}

//All Other Functions
function logoutDirect(gotoPage) {
    if (appConfig.DEBUG) console.warn("Logout Direct Called");

    if(gotoPage==null || gotoPage.length<=0) gotoPage=appConfig.PAGEHOME;
	
    currentUser = null;

    if (window.plugins.googleplus != null) window.plugins.googleplus.logout()

    lang = getUserSettings("APP-LANG");
    window.localStorage.clear();
    setUserSettings("APP-LANG", lang);
  
    //appConfig.MENU['Data-Forms']="@COLLECTIONS";
    
    $.getJSON("app.json",function(data) {
            appConfig=data;
      
            loadMenus();
            loadUserinfoBar();
            //pageBrowser();
        });
    app.route(gotoPage);
}
function logout() {
    if (appConfig.DEBUG) console.warn("Logout Called");

    var lx = getServiceCMD("logout");
    processAJAXGetQuery(lx, function(txt) {
        logoutDirect();
    }, function(txt) {
        logoutDirect();
    });
}

function checkUser() {
    return !(currentUser == null || currentUser.length <= 0);
}

function getUserID() {
    userID = getUserSettings("USERKEY-USER");
    if (userID == null) return "";
    else return userID;
}

function getUserToken() {
	return localStorage.getItem("USERKEY-AUTH");//md5(new Date());//
}

function checkLogin(showLogin) {
    //checkRemoteLogin();
    if(showLogin==null) showLogin=true;

    userKey = getUserSettings("USERKEY-AUTH");
    userID = getUserSettings("USERKEY-USER");
	
    if (userKey == null) {
        if (showLogin) {
            app.route("#login");
            return false;
        } else {
            return false;
        }
    } else {
        currentUser = getUserID();
        return true;
    }
}

function saveLingSettings(lang) {
    appLang = lang;
    setUserSettings("APP-LANG", lang);
    location.reload();
}


function reloadPage() {
    loadPage(window.location.hash.substr(1));
}

function refetchResource() {
    checkServerUplink(function(status) {
        if (status) {
            forceReload = true;
            if (reloadResourceFunc != null && typeof window[reloadResourceFunc] == "function") {
                window[reloadResourceFunc]();
            } else {
                reloadPage();
            }
        }
    });
}

function refetchUserData() {
	fetchLive(getServiceCMD("profile"),function(txt) {
		setUserSettings("USERKEY-DATA",txt);
		loadUserinfoBar();
	});
}

function checkServerUplink(callBack) {
		offlineMode = false;
		if(appConfig.URL.DATASRC==null) {
			if (!offlineMode) {
					triggerEvents.runTriggers('onOnline');
			}
			if (callBack != null) {
				if(typeof window[callBack] == "function") {
						window[callBack](true);
				} else if(typeof callBack=="function") {
						callBack(true);
				}
			}
			return;
		}
    if(appConfig.DEBUG) console.log("Checking Server Uplink");
    $.ajax({
            type: "GET",
            //url: getServiceCMD('alive', '', 'event-stream')
            //url: getServiceCMD('cmds', 'alive', 'event-stream')
            url: appConfig.URL.ALIVE
        }).done(function(txt) {
            offlineMode = false;
            if (!offlineMode) {
                triggerEvents.runTriggers('onOnline');
            }
            if (callBack != null) {
                if(typeof window[callBack] == "function") {
                    window[callBack](true);
                } else if(typeof callBack=="function") {
                    callBack(true);
                }
            }
        })
        .fail(function(txt) {
            offlineMode = true;
            if (offlineMode) {
                triggerEvents.runTriggers('onOffline');
            }
            if (callBack != null) {
                if(typeof window[callBack] == "function") {
                    window[callBack](false);
                } else if(typeof callBack=="function") {
                    callBack(false);
                }
            }
        });
}

function updateOfflineUI(divID) {
    if (divID == null) {
        divID = ".dataContainer";
    }
    if (isOffline()) {
        $(divID).html("<br><h1 align=center>You are Offline.</h1><br><p align=center>No data prefetched earlier.</p>");
        return false;
    }
    return true;
}

function isOffline() {
    return false;
    return offlineMode;
}



//User Settings Storage
function getUserSettings(key) {
    v = window.localStorage.getItem(key);
    if (v == null || v == "undefined") {
        if(appConfig.DEFAULTS!=null && appConfig.DEFAULTS[key]!=null) {
            v = appConfig.DEFAULTS[key];
            window.localStorage.setItem(key, v);
            return v;
        } else {
            return null;
        }
    }
    if(v.charAt(0)=="{" && v.charAt(v.length-1)=="}") {
        try {
            v=$.parseJSON(v);
        } catch(e) {
            return null;
        }
    }
    return v;
}

function setUserSettings(key, v) {
    if(typeof v=="object") {
        v=JSON.stringify(v);
    }
    window.localStorage.setItem(key, v);
}

function deleteUserSettings(key) {
    window.localStorage.removeItem(key);
}

function debugMsg(msg,lvl) {
	if(lvl==null) lvl=5;
	dLevel=getUserSettings("DEBUG-LEVEL");
	if(dLevel==null || dLevel=="") {
		if(getUserSettings("DEBUG")) {
			dLevel=5;
		} else {
			dLevel=0;
		}
	}
	if(lvl<=dLevel) {
		console.log(msg);
	}
}

function getMarketLink() {
	if(window['device']!=null) {
		switch(device.platform.toLowerCase()) {
			case "android":
				lx="market://details?id="+appConfig.MARKETS.ANDROID;
				return lx;
			break;
			case "ios":
				//lx="https://itunes.apple.com/app/id"+appConfig.MARKETS.IOS;
				lx="itms-apps://itunes.com/apps/id"+appConfig.MARKETS.IOS;
				return lx;
			break;
			case "wince":
				lx="ms-windows-store:PDP?PFN="+appConfig.MARKETS.WINDOWS;
				return lx;
			break;
			case "blackberry":
				lx="appworld://content/"+appConfig.MARKETS.BLACKBERRY+"/";
				return lx;
			break;
		}
	}
	return "";
}