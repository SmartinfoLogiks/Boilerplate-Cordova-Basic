var appConfig = {};
var currentUser = null;
var appVersionNo=0;
var appVersionCode=0;
var appName="";

if(typeof cordova=="object" && typeof cordova.getAppVersion=="function") {
	cordova.getAppVersion.getVersionNumber(function(d) {
		appVersionNo=d;
	});
	cordova.getAppVersion.getVersionCode((function(d) {
		appVersionCode=d;
	}));
	cordova.getAppVersion.getAppName(function(d) {
		appName=d;
	});
}

function frameworkError(msgCode) {
  console.error(msgCode);
}

function logoutDirect(gotoPage) {
  if (appConfig.DEBUG) console.warn("Logout Direct Called");
  
  if(gotoPage==null || gotoPage.length<=0) gotoPage=appConfig.PAGEHOME;
  
  if(window.plugins!=null) {
    if (window.plugins.googleplus != null) window.plugins.googleplus.logout()
  }
  
  lang = getUserSettings("APP-LANG");
  window.localStorage.clear();
  setUserSettings("APP-LANG", lang);
  
  $.getJSON("app.json",function(data) {
          appConfig=data;
          reloadAppCore(gotoPage);
      });
}

function getUserToken() {
    return getUserSettings("USERKEY-AUTH");
}
function getUserID() {
    userID = getUserSettings("USERKEY-USER");
    if (userID == null) return "";
    else return userID;
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
