var appConfig = {};
var currentUser = null;
var appVersionNo=0;
var appVersionCode=0;
var appPackageName="";
var appName="";

var appPageHistory = [];
var pageCurrent = "";
var pageLast = "";

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
    cordova.getAppVersion.getPackageName().then(function (package_name) {
	appPackageName = package_name;
    });
}

function toTitle(str) {
    return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

function _slugify(str) {
    if (str == null) return "";
    return "dashblocks/ counters".replace(/[^A-Za-z0-9]/gm, '-').replace(/(-)+/g, '-');
}

function getAuthorizationHeaders() {
    return {};
}
function frameworkError(msgCode) {
  console.error(msgCode);
}

//URL and Link Functions
function openAppStore() {
    switch (cordova.platformId.toUpperCase()) {
        case "ANDROID":
            packageID = appConfig.MARKETS[cordova.platformId.toUpperCase()];
            window.open("https://play.google.com/store/apps/details?id=" + packageID, "_system");
            break;
        default:
            alert("AppStore Feature Not Supported");
    }
}

function openExternalLink(linkURI, inMobileBrowser) {
    themeColor = getUserSettings("SETTINGS-THEME_COLOR");
    optStr = "location=no";
    if (themeColor != null && themeColor.length > 0) {
        optStr += ",footer=yes,footercolor=#00ff00";
    }
    if (typeof cordova.InAppBrowser != "undefined") {
        if (inMobileBrowser === true) {
            cordova.InAppBrowser.open(linkURI, '_system', optStr);
        } else {
            cordova.InAppBrowser.open(linkURI, '_blank', optStr);
        }
    } else {
        window.open(linkURI, '_system', optStr);
    }
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
	if ((v.charAt(0) == "{" && v.charAt(v.length - 1) == "}") ||
		(v.charAt(0) == "[" && v.charAt(v.length - 1) == "]")) {
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

function getAuthorizationHeaders() {
    return {};
}

function getDeviceID() {
    return md5((device.model+"-"+device.serial+"-"+device.uuid).replace(/ /g,'').toLowerCase());
}

function getDeviceKEY() {
	key = [device.model, device.serial, device.uuid];

	return key.join("-").trim().toLowerCase();
}

function getDeviceHash() {
    return md5(getDeviceKEY());
}

function getGeoKEY(callBack) {
	navigator.geolocation.getCurrentPosition(function(position) {
		callBack([position.coords.latitude, position.coords.longitude, position.coords.altitude].join(","));
	}, function(err) {
		callBack("");
	});
}

function getDeviceHash() {
	return md5(getDeviceKEY());
}

function _ling(strText, lang) {
    if(lang==null) lang = "en-gb";
    return _LING.toLing(strText, lang);
}

//Overlay Windows
function showOverlayFrame(msg) {
    if ($("#overlayBox").length > 0) {
        $("#overlayBox").removeClass("d-none").find(".wrapperBox").html(msg);
    }
}

function showOverlayURI(uri) {
    if ($("#overlayBox").length > 0) {
        $("#overlayBox .wrapperBox").load(uri, function() {
            $("#overlayBox").removeClass("d-none");
        });
    }
}

function hideOverlayFrame() {
    if ($("#overlayBox").length > 0) {
        $("#overlayBox").addClass("d-none").find(".wrapperBox").html("");
    }
}

function showNoInternet() {
    showOverlayURI("app/comps/panels/no-internet.html");
}
