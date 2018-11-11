//Google Analytics
var gaPlugin = null;

function initGA() {
	if (appConfig.appstatus != "production") return false;
	if (appConfig.DEBUG) console.info("TRACKING:" + type + " @" + window.location.hash);

	if (window.ga != null) {
		if (appConfig.DEBUG) window.ga.debugMode();

		gaPlugin = window.ga;
		gaPlugin.startTrackerWithId(appConfig.KEYS.GOOGLE_ANALYTICS);
		gaPlugin.setAppVersion(appVersionNo);
		gaPlugin.addCustomDimension(0, appConfig.appstatus);
		gaPlugin.addCustomDimension(1, appConfig.DEBUG);
	}
}

function trackView(type, page, subpage) {
	if(page==null) page = window.location.hash;
	if(type==null) type = "page";

	if(gaPlugin==null) initGA();

	if(gaPlugin==null) {
		console.info("NOT TRACKING [DEBUG]:" + type + " @" + window.location.hash);
		return;
	}

	gaPlugin.setUserId(getUserID());
	switch (type) {
		case "pageview":case "page":case "panel":
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
			gaPlugin.trackMetric(page[0], page[1], function(e) {}, function(e) {});
			break;
	}

	// if (window.tapstream != null) {
	// 	window.tapstream.fireEvent('PAGE-' + pg.substr(1).toUpperCase(), false, {
	// 		'userid': currentUser
	// 	});
	// }
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