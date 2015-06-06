var appConfig={};
var allNotifications={};
var tempObj=null;
var appPageHistory=[];
var currentUser=null;
var watchId=null;

document.addEventListener("deviceready", function() {
	if(appConfig.DEBUG) console.debug("Logiks App Loaded");
	window.plugin.notification.local.onadd=function(nid, state, json) {
                        if(typeof json=="string") json=$.parseJSON(json);
                        allNotifications[nid]=json.type;
                    };
});

//Other Functions
function showAlert(message, title, callBack) {
	if(title==null) title="PlacPic";

	if (navigator.notification) {
		navigator.notification.alert(message, callBack, title, 'OK');
	} else {
		alert(title ? (title + ": " + message) : message);
	}
}
function showPrompt(message,defaultData,callBack,title) {
	if(title==null) title="PlacPic";
	if (navigator.notification) {
		navigator.notification.prompt(message,function(txt) {
				if(txt.buttonIndex==1) callBack(txt.input1);
			},title,null,defaultData);
	} else {
		callBack(prompt(message,defaultData));
	}
}
function showConfirm(message,callBack,title) {
	if(title==null) title="PlacPic";
	if (navigator.notification) {
		navigator.notification.confirm(message,callBack,title);
	} else {
		callBack(confirm(message));
	}
}
function showNotification(message,title,callback,params,type) {
	if(title==null) title=appConfig.APPNAME+" Says";
	if(type==null) type="Default";

	if(window.plugin!=null && window.plugin.notification!=null) {
		if(params==null) {
			params={
				autoCancel:true,
				ongoing:false,
			};
		}
		if(params.id==null) params.id=Math.random()*100000000;
		params.title=title;
		params.message=message;
		if(params.json==null) {
			params.json=JSON.stringify({"type":type});
		}
		//if(appConfig.DEBUG) console.debug(params);
		//window.plugin.notification.local.cancelAll();
		window.plugin.notification.local.add(params, callback);
	} else{
		showAlert(message,title);
	}
	//https://github.com/katzer/cordova-plugin-local-notifications/#examples
	// window.plugin.notification.local.add({
	//     id:         String,  // A unique id of the notifiction
	//     date:       Date,    // This expects a date object
	//     message:    String,  // The message that is displayed
	//     title:      String,  // The title of the message
	//     repeat:     String,  // Either 'secondly', 'minutely', 'hourly', 'daily', 'weekly', 'monthly' or 'yearly'
	//     badge:      Number,  // Displays number badge to notification
	//     sound:      String,  // A sound to be played
	//     json:       String,  // Data to be passed through the notification
	//     autoCancel: Boolean, // Setting this flag and the notification is automatically canceled when the user clicks it
	//     ongoing:    Boolean, // Prevent clearing of notification (Android only)
	// }, callback, scope);
	//}
}
function shareMe(message, subject, fileOrFileArray, url, successCallback, errorCallback) {
	if(window.plugins!=null && window.plugins.socialsharing!=null) {
		window.plugins.socialsharing.share(message, subject, fileOrFileArray, url, successCallback, errorCallback);
	} else {
		showAlert("Sorry, Sharing Is Not Enabled On Your Platform.");
	}
}
function getServiceCMD(cmd,action,format) {
	token=window.localStorage.getItem("USERKEY-AUTH");
	if(token==null) token="";
	duuid=JSON.stringify(window.device);
	if(duuid==null) duuid="";
	else duuid=encodeURIComponent(duuid);
	
	lx="http://www.placpic.com/services/"+cmd+"?site=home&APIKEY="+appConfig.REMOTEKEY+
		"&token="+token+"&deviceuuid="+duuid;
	if(action!=null && action.length>0) lx+="&action="+action;
	if(format!=null && format.length>0) lx+="&format="+format;
	else lx+="&format=json";
	lx+="&currentUser="+getUserID();
	return lx;
}
function processAJAXQuery(l,callback,errorCallback) {
	if(appConfig.DEBUG) console.debug("AJAX:"+l);
	$.ajax({
	  type: "GET",
	  url: l
	}).done(function(txt) {
		    if(callback!=null) callback(txt);
		  })
		  .fail(function(txt) {
		    if(errorCallback!=null) errorCallback(txt);
		  })
		  .always(function(txt) {
		    
		  });
}
function processAJAXPostQuery(l,q,callback,errorCallback) {
	if(appConfig.DEBUG) console.debug("POST:"+l);
	$.ajax({
	  type: "POST",
	  url: l,
	  data: q
	}).done(function(txt) {
		    if(callback!=null) callback(txt);
		  })
		  .fail(function(txt) {
		    if(errorCallback!=null) errorCallback(txt);
		  })
		  .always(function(txt) {
		    
		  });
}
function getUserSettings(key) {
	v=window.localStorage.getItem(key);
	if(v==null || v=="undefined") {
		v=appConfig.DEFAULTS[key];
		window.localStorage.setItem(key,v);
	}
	return v;
}
function setUserSettings(key,v) {
	window.localStorage.setItem(key,v);
}
function pageLoader(msg) {
	if(msg==null) msg="Loading ...";
	$("#photoViewer").detach();
	$("#mainContainer").html("<div class='ajaxloading'>"+msg+"</div>");
}

function errorReporter(message, url , linenumber, column, errorObj) {
	var stack = '';
	if(errorObj !== undefined) {//so it won’t blow up in the rest of the browsers
		stack = errorObj.stack;
	}

	$.post(getServiceCMD("errorReporter","newCrash"),{
		'user_id' : currentUser,
		'form_id' : 1,
		'message' : message,
		'url' : url,
		'linenumber' : linenumber,
		'stack': stack
	},function(data) {
		console.warn(data);
	});
}

function trackApp(type,page,params) {
	if(appConfig.DEBUG) console.log("TRACKING:"+type+" @"+page);
	if(window.plugins!=null && window.plugins.gaPlugin!=null) {
		if(gaPlugin==null) {
			gaPlugin = window.plugins.gaPlugin;
	        gaPlugin.init(function(e) {
	            console.log(e);
	        }, function(e) {
	            console.error(e);
	        }, "UA-55047906-2", 10);
		}
		if(gaPlugin!=null) {
			switch(type) {
				case "pageview":
					gaPlugin.trackPage(function(e) {},function(e) {},page);
				break;
			}
		}
    } else if(window.analytics!=null) {
    	if(appConfig.DEBUG) window.analytics.debugMode();
    	if(gaPlugin==null) {
    		gaPlugin=window.analytics;
    		gaPlugin.startTrackerWithId('UA-55047906-2');
    		
    	}
    	if(gaPlugin!=null) {
    		gaPlugin.setUserId(currentUser);
			switch(type) {
				case "pageview":
					gaPlugin.trackView(page,function(e) {},function(e) {});
				break;
			}
		}
    }
}

function goBack() {
	if($(".overlay").length>0) {
        $(".overlay").fadeOut("slow",function() {$(".overlay").detach();});
    } else if($(".cbp-spmenu.cbp-spmenu-open").length>0) {
        classie.remove(document.getElementById($(".cbp-spmenu.cbp-spmenu-open").attr("id")) , 'cbp-spmenu-open');
    } else {
        appPageHistory.pop();
        pg=appPageHistory.pop();
        if(pg==null) {
            navigator.app.exitApp();
        } else {
            app.route(pg);
        }
    }
}

//All Other Functions
function logout() {
	if(appConfig.DEBUG) console.warn("Logout Called");
	currentUser=null;

	window.localStorage.removeItem("NOTIFICATION-DATA");
	window.localStorage.removeItem("NOTIFICATION-TIMESTAMP");
	
	window.localStorage.removeItem("USERKEY-AUTH");
	window.localStorage.removeItem("USERKEY-CLIENT");
	window.localStorage.removeItem("USERKEY-DATE");
	window.localStorage.removeItem("USERKEY-TIME");
	window.localStorage.removeItem("USERKEY-TOKEN");
	window.localStorage.removeItem("USERKEY-USER");
	window.localStorage.removeItem("USERKEY-DATA");

	loadMenus();
    loadUserinfoBar();
	//pageBrowser();

	app.route("#home");
}
function checkUser() {
	return !(currentUser==null || currentUser.length<=0);
}
function getUserID() {
	userKey=window.localStorage.getItem("USERKEY-USER");
	if(userKey==null) return  "";
	else return userKey;
}
function checkLogin(showLogin) {
	checkRemoteLogin();
	userKey=window.localStorage.getItem("USERKEY-AUTH");
	if(userKey==null) {
		if(showLogin) {
			pageLogin();
			return false;
		} else {
			return false;
		}
	} else {
		currentUser=getUserID();
		return true;
	}
}
function checkRemoteLogin() {
	lx=getServiceCMD("appcmds","checkRemoteLogin");
	processAJAXQuery(lx,function(data) {
		if(!data.Data.LOGIN) {
			if(appConfig.DEBUG) console.warn("Auto Logout Called");
			currentUser=null;
			
			window.localStorage.removeItem("USERKEY-AUTH");
			window.localStorage.removeItem("USERKEY-CLIENT");
			window.localStorage.removeItem("USERKEY-DATE");
			window.localStorage.removeItem("USERKEY-TIME");
			window.localStorage.removeItem("USERKEY-TOKEN");
			window.localStorage.removeItem("USERKEY-USER");
			window.localStorage.removeItem("USERKEY-DATA");

			loadMenus();
		    loadUserinfoBar();
		}
	});
}

function saveLingSettings(lang) {
	appLang=lang;
	window.localStorage.setItem("APP-LANG",lang);
	location.reload();
}
