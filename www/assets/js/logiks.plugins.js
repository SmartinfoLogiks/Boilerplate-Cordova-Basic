var allNotifications = {};

function showNotification(message, title, params, badgeNo, callback) {
	if (title == null) title = appConfig.APPNAME;
	if (badgeNo == null) badgeNo = 0;
	if (params == null) params = {};

	if (typeof cordova == "object") {
		defaultParams = {
			autoCancel: true,
			ongoing: false,
			id: Math.random() * 100000000,
			title: appConfig.APPTITLE,
			message: "",
			badge: badgeNo,
			data: "{}"
		};

		params = $.extend(defaultParams, params);

		params.title = title;
		params.message = message;

		if (params.data == null) {
			params.data = "{}";
		}

		//if(appConfig.DEBUG) console.debug(params);

		Notifications(params, callback);

		if (cordova.plugins.notification.badge != null) {
			cordova.plugins.notification.badge.increase(badgeNo);
		}
	} else if (typeof Notification == "function") {
		defaultParams = {
			autoCancel: true,
			ongoing: false,
			id: Math.random() * 100000000,
			title: appConfig.APPTITLE,
			message: "",
			type: "Default",
			json: JSON.stringify({
				"type": "Default"
			})
		};

		params = $.extend(defaultParams, params);

		params.title = title;
		params.message = message;

		new Notification(title, params);
	} else {
		lgksError(message, title);
	}
	//https://github.com/katzer/cordova-plugin-local-notifications/#examples
	// window.plugin.notification.local.add({
	//     id:         String,  // A unique id of the notifiction
	//     date/firstAt:       Date,    // This expects a date object
	//     message:    String,  // The message that is displayed
	//     title:      String,  // The title of the message
	//     repeat/every:     String,  // Either 'secondly', 'minutely', 'hourly', 'daily', 'weekly', 'monthly' or 'yearly'
	//     badge:      Number,  // Displays number badge to notification
	//     sound:      String,  // A sound to be played
	//	   led: 	   Integer,	// Color of led
	//     json:       String,  // Data to be passed through the notification
	//     autoCancel: Boolean, // Setting this flag and the notification is automatically canceled when the user clicks it
	//     ongoing:    Boolean, // Prevent clearing of notification (Android only)
	//     icon:			"file://media/logos/logox30.png",
	//     sound:			"file://media/sounds/alert.mp3",
	// }, callback, scope);
	//}
}

//window.navigator.share		Simple Sharing
function shareMe(message, subject, fileOrFileArray, url, successCallback, errorCallback) {
	if (window.plugins != null && window.plugins.socialsharing != null) {
		window.plugins.socialsharing.share(message, subject, fileOrFileArray, url, successCallback, errorCallback);
	} else {
		lgksError("Sorry, Sharing Is Not Enabled On Your Platform.");
	}
}

function setupBackgroundMode(enable) {
	if (typeof cordova == "object" && typeof cordova.plugins.backgroundMode == "function") {
		if (enable === false) {
			cordova.plugins.backgroundMode.disable();
		} else {
			cordova.plugins.backgroundMode.on('activate', function() {
				cordova.plugins.backgroundMode.disableWebViewOptimizations();
			});
			cordova.plugins.backgroundMode.setDefaults({
				text: 'Click here to go back to the app.'
			});
			cordova.plugins.backgroundMode.configure({
				silent: true
			});

			cordova.plugins.backgroundMode.excludeFromTaskList();
			cordova.plugins.backgroundMode.overrideBackButton();

			cordova.plugins.backgroundMode.enable();
		}
	}
}

//Tracking Codes
gaPlugin = null;

function trackApp(type, page, subpage) {
	if (appConfig.DEBUG) console.log("TRACKING:" + type + " @" + page);
	if (appConfig.STATUS != "LIVE") return false;

	if (window.ga != null) {
		if (appConfig.DEBUG) window.ga.debugMode();
		if (gaPlugin == null) {
			if (appVersion == 0) {
				cordova.getAppVersion.getVersionNumber(function(d) {
					appVersion = d;

					gaPlugin = window.ga;
					gaPlugin.startTrackerWithId(appConfig.KEYS.GOOGLE_ANALYTICS);
					gaPlugin.setAppVersion(appVersion);
					gaPlugin.addCustomDimension(0, appConfig.STATUS);
					gaPlugin.addCustomDimension(1, appConfig.DEBUG);
					gaPlugin.addCustomDimension(2, getUserSettings("DATASRC-NAME"));
					// 			gaPlugin.addCustomDimension(3,appConfig.URL.DATASRC);

					trackApp(type, page);
				});
			} else {
				gaPlugin = window.ga;
				gaPlugin.startTrackerWithId(appConfig.KEYS.GOOGLE_ANALYTICS);
				gaPlugin.setAppVersion(appVersion);
				gaPlugin.addCustomDimension(0, appConfig.STATUS);
				gaPlugin.addCustomDimension(1, appConfig.DEBUG);
				gaPlugin.addCustomDimension(2, getUserSettings("DATASRC-NAME"));
				// 			gaPlugin.addCustomDimension(3,appConfig.URL.DATASRC);
			}
		}
		if (gaPlugin != null) {
			gaPlugin.setUserId(currentUser);
			switch (type) {
				case "pageview":
					gaPlugin.trackView(page, '', false, function(e) {}, function(e) {});
					break;
				case "event":
					page = page.split(":");
					if (page[1] == null) page[1] = "touch";
					if (page[2] == null) page[2] = "button";
					if (page[3] == null) page[3] = 0;
					gaPlugin.trackEvent(page[0], page[1], page[2], 0, false, function(e) {}, function(e) {});
					break;
				case "error":
				case "crash":
				case "exception":
					gaPlugin.trackException(page, type, function(e) {}, function(e) {});
					break;
				case "metric":
					page = page.split(":");
					if (page[1] == null) page[1] = 0;
					gaPlugin.trackException(page[0], page[1], function(e) {}, function(e) {});
					break;
			}
		}
	}

	if (window.tapstream != null) {
		window.tapstream.fireEvent('PAGE-' + pg.substr(1).toUpperCase(), false, {
			'userid': currentUser
		});
	}
}

function trackEvent(eventCategory, event) {
	a = eventCategory + ":";
	if (typeof event == "object") {
		if (event.type != null) a += ":" + event.type;
		else {
			a += ":touch";
		}
		if ($(e.srcElement).attr('name') != null) {
			a += ":" + $(e.srcElement).attr('name');
		} else {
			a += ":";
		}
		v = $(e.srcElement).val();
		if (v == null) v = 0;
		a += ":" + v;
	} else {
		a += ":touch::0";
	}
	trackApp("event", a, event);
}