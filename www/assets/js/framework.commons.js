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

function frameworkError(msgCode) {
  console.error(msgCode);
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
