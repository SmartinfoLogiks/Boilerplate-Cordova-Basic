var watchId = null;
var currentLocation=false;

function getLocation(callBack,callBackError) {
    navigator.geolocation.getCurrentPosition(function(position) {
        point = { "latitude": position.coords.latitude, "longitude": position.coords.longitude };
        currentLocation=point;
        callBack(point);
    },function(e) {
        if(e.code==e.TIMEOUT) {
            showNotification("Location is disabled! Please enable the Location in your settings.");
            checkTracking();
        } else if(e.code==e.POSITION_UNAVAILABLE) {
            showNotification("Location is disabled! Please enable the Location in your settings.");
            checkTracking();
        } else if(e.code==e.PERMISSION_DENIED) {
            showNotification("Location is disabled! Please enable the Location in your settings.");
            checkTracking();
        } else {
            showNotification("Location is disabled! Please enable the Location in your settings.");
            checkTracking();
        }
        callBackError(e);
    },{ maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
}
function updateLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
        point = { "latitude": position.coords.latitude, "longitude": position.coords.longitude };
        currentLocation=point;
    },function(e) {
        if(e.code==e.TIMEOUT) {
            setTimeout(function() {
                updateLocation();
            },60000);
        } else if(e.code==e.POSITION_UNAVAILABLE) {
            checkTracking();
        } else if(e.code==e.PERMISSION_DENIED) {
            checkTracking();
        } else {
            setTimeout(function() {
                updateLocation();
            },60000);
        }
    },{ maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
}
function checkTracking() {
  if(typeof cordova=="object" && typeof cordova.plugins.diagnostic=="function") {
    cordova.plugins.diagnostic.isLocationEnabled(function(e) {
      if(e===false) {
        lgksConfirm("Your Location Settings seems to be off. Do you want to switch it on?",function(ans) {
            if(ans) {
              cordova.plugins.diagnostic.switchToLocationSettings();
            } else {
              showNotification("Location is disabled! Please enable the Location in your settings.");
            }
            setTimeout(function() {
                  updateLocation();
              },100000);
          });
      }
    });
  }
}
function watchLocation() {
    watchID = navigator.geolocation.watchPosition(function(position) {
        point = { "latitude": position.coords.latitude, "longitude": position.coords.longitude };
        currentLocation=point;

        if(appConfig.DEBUG) console.log(point);
    },function(x) {
        currentLocation=false;
        
        if(e.code==e.TIMEOUT) {
            showNotification("Location is disabled! Please enable the Location in your settings.");
        } else if(e.code==e.POSITION_UNAVAILABLE) {
            //showNotification("Location is not available currently.");
        } else if(e.code==e.PERMISSION_DENIED) {
            showNotification("Location permission not available! Please reinstall the app.");
        } else {
            // showNotification("Location is disabled! Please enable the Location in your settings.");
        }
    },{ maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
}
function clearWatchLocation() {
    try {
        navigator.geolocation.clearWatch(watchID);
    } catch(e) {}
}