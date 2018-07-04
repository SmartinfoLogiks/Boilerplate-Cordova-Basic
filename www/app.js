function onAppLoad() {
	if(appConfig.DEBUG) console.log("App loaded.");
	
	$(".navbar-header .navbar-toggle").on("touch", function(e) {
		refNav = $(this).data("for");
		$("#" + refNav).toggleClass("cbp-spmenu-open");
	});
	$(".cbp-spmenu .navbar-toggle").on("touch", function(e) {
		refNav = $(this).closest(".cbp-spmenu").attr("id");
		$("#" + refNav).toggleClass("cbp-spmenu-open");
	});
	$(".cbp-spmenu").delegate("a", "touch", function(e) {
		href = $(this).attr("href");
		if (href.charAt(0) == "#") {
			app.route(href);
		} else {
			navigator.app.loadUrl(href, {
				openExternal: true
			});
		}
	});
	
	setInterval(function() {
		 checkAlerts();
	},getUserSettings("NOTIFICATION_INTERVAL"));
}
function onPagePreload() {
	
}
function checkAlerts() {
	userID=getUserID();
	if(userID==null || userID.length<=0) return;
	
	//NOTIFICATIONS
	dt=getUserSettings("NOTIFICATION-LAST-UPDATE");
	
	lx=getServiceCMD("alerts","notifications");
	if(dt!=null && dt.length>4) {
		lx+="&last_updated="+dt;
	}

	processAJAXGetQuery(lx,function(dataJson) {
		console.log(dataJson);
		if(dataJson!=null) {
			if(dataJson.count>0) {
				showNotification("You have "+dataJson.count+" new notifications.",appConfig.APPTITLE,function(e) {console.log(e);},{"badge":nx});
			}
			setUserSettings("NOTIFICATION-LAST-UPDATE",dataJson.timestamp);
		}
	},function(e) {},true,true);
}
function loadMenus() {
	if(appConfig.DEBUG) console.log("Menu loaded.");
  logiksMenu.renderMenu();
}

triggerEvents.addTrigger('onAppLoad',"onAppLoad");
triggerEvents.addTrigger('onPagePreload',"onPagePreload");
// triggerEvents.addTrigger('onPagePostload',"onPagePostload");
// triggerEvents.addTrigger('onAppLoad',"onAppLoad");

// triggerEvents.addTrigger('onOnline',"appOffline");
// triggerEvents.addTrigger('onOffline',"appOffline");
// triggerEvents.addTrigger('onDeviceReady',"appDeviceReady");

$("#appCommonHTML").load("app/templates.html",function() {
		app.initialize();
	});

function loadCommonHTML() {
	$("#appCommonHTML").load("app/templates.html");
}
