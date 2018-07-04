var remoteIndex=null;
var forceReload=false;
var offlineMode=false;
var answered=false;

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


function getDataSource() {
	if(typeof appConfig.URL=="string") {
		return appConfig.URL;
	}
	if(appConfig.URL.DATASRC==null) {
		appConfig.URL.DATASRC=getUserSettings("DATASRC");
	}
	return appConfig.URL.DATASRC;
}

function getIdentityServer() {
	if(typeof appConfig.URL=="string") {
		return md5(appConfig.URL);
	}
	return appConfig.URL.IDENTITY;
}

function getServiceCMD(cmd, action, format) {
	authkey = getUserSettings("USERKEY-AUTH");
	token = getUserSettings("USERKEY-TOKEN");
	appkey=appConfig.APPKEY;
	if (token == null) token = "";
	duuid = JSON.stringify(window.device);
	if (duuid == null) duuid = "";
	else duuid = encodeURIComponent(duuid);

	lx = getDataSource()+ cmd"?APIKEY=" + appConfig.REMOTEKEY +"&appkey=" + appkey + "&deviceuuid=" + duuid +
		"&app_vers=" + appVersionNo + "&app_code=" + appVersionCode + "&app_name=" + appName +
		"&token=" + token;

	if(appConfig.REFSITE!=null && strlen(appConfig.REFSITE)>0) {
		lx+="&site=" + appConfig.REFSITE;
	}


	if (action != null && action.length > 0) lx += "&action=" + action;
	if (format != null && format.length > 0) lx += "&format=" + format;
	
	else lx += "&format=json";
	lx += "&currentUser=" + getUserID();
	return lx;
}

function testAPI(scmd,action,q,type) {
	switch(type) {
		case "post":case "POST":
			processAJAXPostQuery(getServiceCMD(scmd,action),q,function(txt) {console.log(txt);},function(txt) {console.error(txt);},true);
		break;
		default:
			processAJAXGetQuery(getServiceCMD(scmd,action),function(txt) {console.log(txt);},function(txt) {console.error(txt);},true);
	}
	
}

function fetchRemoteData(dataQuery,dataQ,callback) {
	switch(dataQuery.charAt(0)) {
		case "@":
			if(dataQ==null) dataQ="";

			dataQuery=dataQuery.substr(1);
			dataQuery=dataQuery.split("$");

			lx=getServiceCMD("data","fetchHTML")+"&type="+dataQuery[0];
			q="q="+dataQ;

			if(dataQuery[1]!=null && dataQuery[1].length>0) {
				q+="&"+dataQuery[1];
			}
			q=q.replace("&&","&");
			
			//create html content from recieved data and populate the provided DIV

			processAJAXSubmitQuery(lx,q,callback);
		break;


		default:
			if (callback != null) callback(null);
	}
}
function fetchLive(lx, callback, errorCallback) {
	if (appConfig.DEBUG) console.debug("LIVE:" + lx);
	
	$.ajax({
			type: "GET",
			url: lx,
			headers: {
				"token":getUserToken()
			}
		}).done(function(txt) {
			offlineMode=false;
			if(typeof txt=="object") {
				if(txt.error!=null) {
					if(txt.error.code==401) {
						logoutDirect();
					} else {
						lgksError(txt.error.code+", "+txt.error.msg);
					}
					if (errorCallback != null) errorCallback(txt);
					return false;
				}
			}
			if (callback != null) callback(txt);
		})
		.fail(function(txt) {
			if(typeof txt=="object") {
				if(txt.error!=null && txt.error.code!=null) {
					lgksError(txt.error.code+", "+txt.error.msg);
					if (errorCallback != null) errorCallback(txt);
					return false;
				}
			}
			offlineMode=true;
			triggerEvents.runTriggers('onOffline');
			console.warn("Error communicating with server, <br>You don't seem to have internet access.");
			if (errorCallback != null) errorCallback(txt);
		})
		.always(function(txt) {

		});	
}
function fetchRemoteAssets(lx, callback, errorCallback, reCache) {
	if (appConfig.DEBUG) console.debug("ASSET:" + lx);

	answered=false;
	if(isOffline()) {
		if(appConfig.DEBUG) console.log("Offline Triggered");
		dx=checkRemoteData(lx,q, getUserSettings("CACHE_ASSETS_PERIOD"));
		if(dx!=null && dx!=false) {
			answered=true;
			if (callback != null) callback(dx);
		} else {
			if (callback != null) callback();
		}
		return;
	} else if(reCache==null || !reCache) {
		dx=checkRemoteData(lx,"");
		if(dx!=null && dx!=false) {
			answered=true;
			if (callback != null) callback(dx);
		}
	}

	if(answered) {
		return;
	}

	$.ajax({
			type: "GET",
			url: lx,
			headers: {
				"token":getUserToken()
			}
		}).done(function(txt) {
			offlineMode=false;
			if(typeof txt=="object") {
				if(txt.error!=null) {
					if(txt.error.code==401) {
						logoutDirect();
					} else {
						lgksError(txt.error.code+", "+txt.error.msg);
					}
					if (errorCallback != null) errorCallback(txt);
					return false;
				}
			}
			saveRemoteData(lx,"", txt);
			if(!answered) {
				if (callback != null) callback(txt);
			}
		})
		.fail(function(txt) {
			if(typeof txt=="object") {
				if(txt.error!=null && txt.error.code!=null) {
					lgksError(txt.error.code+", "+txt.error.msg);
					if (errorCallback != null) errorCallback(txt);
					return false;
				}
			}
			offlineMode=true;
			triggerEvents.runTriggers('onOffline');
			console.warn("Error communicating with server, <br>You don't seem to have internet access.");
			if (errorCallback != null) errorCallback(txt);
		})
		.always(function(txt) {

		});
}

function processAJAXQuery(type,lx, q, params, callback) {
	if(type==null) type="GET";
	else type=type.toUpperCase();
	
	var errorCallback=null,reCache=true;
	
	if(params['callback']!=null) callback=params['callback'];
	if(params['errorCallback']!=null) errorCallback=params['errorCallback'];
	if(params['reCache']!=null) reCache=params['reCache'];

	if (appConfig.DEBUG) console.debug("AJAX:"+type+":"+ lx);

	switch(type) {
		case "GET":
			processAJAXGetQuery(lx, callback, errorCallback,reCache);
		break;
		case "POST":
			processAJAXPostQuery(lx, q, callback, errorCallback,reCache);
		break;
	}
}

function processAJAXGetQuery(l, callback, errorCallback,reCache,noCache) {
	if (appConfig.DEBUG) console.debug("GET:" + l);
	if(noCache==null) noCache=false;
	if(reCache==null) reCache=false;
	
	if(forceReload) {
		reCache=true;
	}
	
	answered=false;
	if(isOffline()) {
		if(appConfig.DEBUG) console.log("Offline Triggered");
		dx=checkRemoteData(l,"");
		if(dx!=null && dx!=false) {
			answered=true;
			if (callback != null) callback(dx);
		} else {
			if (callback != null) callback();
		}
		return;
	} else if(reCache==null || !reCache) {
		dx=checkRemoteData(l,"");
		if(dx!=null && dx!=false) {
			answered=true;
			if (callback != null) callback(dx);
		}
	}
	if(answered && !getUserSettings("GREEDY_CACHE")) {
		return;
	}

	forceReload=false;
	$.ajax({
			type: "GET",
			url: l,
			headers: {
				"token":getUserToken()
			}
		}).done(function(txt) {
			offlineMode=false;
			if(typeof txt=="object") {
				if(txt.error!=null) {
					if(txt.error.code==401) {
						logoutDirect();
					} else {
						lgksError(txt.error.code+", "+txt.error.msg);
					}
					if (errorCallback != null) errorCallback(txt);
					return false;
				}
			}
			if(noCache!==true) {
				saveRemoteData(l,"", txt);
			}
			
			if(!answered) {
				if (callback != null) callback(txt);
			}
		})
		.fail(function(err) {
			if(typeof err=="object") {
				if(err.status==401) {
					logoutDirect("#auth_login");
				} else if(err.error!=null && err.error.code!=null) {
					lgksError(err.error.code+", "+err.error.msg);
					if (errorCallback != null) errorCallback(err);
					return false;
				}
			}
			offlineMode=true;
			triggerEvents.runTriggers('onOffline');
			console.warn("Error communicating with server, <br>You don't seem to have internet access.");
			if (errorCallback != null) errorCallback(err);
		})
		.always(function(txt) {

		});
}

function processAJAXPostQuery(l, q, callback, errorCallback,reCache,noCache) {
	if (appConfig.DEBUG) console.debug("POST:" + l);
	if(noCache==null) noCache=false;
	if(reCache==null) reCache=true;
	
	if(forceReload) {
		reCache=true;
	}
	
	answered=false;
	if(isOffline()) {
		if(appConfig.DEBUG) console.log("Offline Triggered");
		dx=checkRemoteData(l,q);
		if(dx!=null && dx!=false) {
			answered=true;
			if (callback != null) callback(dx);
		} else {
			if (callback != null) callback();
		}
		return;
	} else if(reCache==null || !reCache) {
		dx=checkRemoteData(l,"");
		if(dx!=null && dx!=false) {
			answered=true;
			if (callback != null) callback(dx);
		}
	}
	if(answered && !getUserSettings("GREEDY_CACHE")) {
		return;
	}
	
	forceReload=false;
	$.ajax({
			type: "POST",
			url: l,
			data: q,
			headers: {
				"token":getUserToken()
			}
		}).done(function(txt) {
			offlineMode=false;
			if(typeof txt=="object") {
				if(txt.error!=null) {
					if(txt.error.code==401) {
						logoutDirect();
					} else {
						lgksError(txt.error.code+", "+txt.error.msg);
					}
					lgksError(txt.error.code+", "+txt.error.msg);
					if (errorCallback != null) errorCallback(txt);
					return false;
				}
			}
			if(noCache!==true) {
				saveRemoteData(l,q, txt);
			}
			if(!answered) {
				if (callback != null) callback(txt);
			}
		})
		.fail(function(txt) {
			if(typeof txt=="object") {
				if(txt.error!=null && txt.error.code!=null) {
					lgksError(txt.error.code+", "+txt.error.msg);
					if (errorCallback != null) errorCallback(txt);
					return false;
				}
			}
			offlineMode=true;
			triggerEvents.runTriggers('onOffline');
			console.warn("Error communicating with server, <br>You don't seem to have internet access.");
			if (errorCallback != null) errorCallback(txt);
		})
		.always(function(txt) {

		});
}
function processAJAXPutQuery(l, q, callback, errorCallback) {
	if (appConfig.DEBUG) console.debug("SUBMIT:" + l);
	$.ajax({
			type: "PUT",
			url: l,
			data: q,
			headers: {
				"token":getUserToken()
			}
		}).done(function(txt) {
			offlineMode=false;
			if(typeof txt=="object") {
				if(txt.error!=null) {
					lgksError(txt.error.code+", "+txt.error.msg);
					if (errorCallback != null) errorCallback(txt);
					return false;
				}
			}
			if (callback != null) callback(txt);
		})
		.fail(function(txt) {
			if(typeof txt=="object") {
				if(txt.error!=null && txt.error.code!=null) {
					lgksError(txt.error.code+", "+txt.error.msg);
					if (errorCallback != null) errorCallback(txt);
					return false;
				}
			}
			offlineMode=true;
			triggerEvents.runTriggers('onOffline');
			console.warn("Error communicating with server, <br>You don't seem to have internet access.");
			if (errorCallback != null) errorCallback(txt);
		})
		.always(function(txt) {

		});
}
function processAJAXSubmitQuery(l, q, callback, errorCallback) {
	if (appConfig.DEBUG) console.debug("SUBMIT:" + l);
	$.ajax({
			type: "POST",
			url: l,
			data: q,
			headers: {
				"token":getUserToken()
			}
		}).done(function(txt) {
			offlineMode=false;
			if(typeof txt=="object") {
				if(txt.error!=null) {
					lgksError(txt.error.code+", "+txt.error.msg);
					if (errorCallback != null) errorCallback(txt);
					return false;
				}
			}
			if (callback != null) callback(txt);
		})
		.fail(function(txt) {
			if(typeof txt=="object") {
				if(txt.error!=null && txt.error.code!=null) {
					lgksError(txt.error.code+", "+txt.error.msg);
					if (errorCallback != null) errorCallback(txt);
					return false;
				}
			}
			offlineMode=true;
			triggerEvents.runTriggers('onOffline');
			console.warn("Error communicating with server, <br>You don't seem to have internet access.");
			if (errorCallback != null) errorCallback(txt);
		})
		.always(function(txt) {

		});
}

function checkRemoteLogin() {
	lx = getServiceCMD("mauth", "checkRemoteLogin");
	processAJAXQuery(lx, function(data) {
		if (!data.Data.LOGIN) {
			if (appConfig.DEBUG) console.warn("Auto Logout Called");
			currentUser = null;

			window.localStorage.clear();

			loadMenus();
			loadUserinfoBar();
		}
	});
}

function checkRemoteData(lx,q) {
	refHash=md5(lx+q);
	if(appConfig.DEBUG) console.log("CACHE:"+refHash);
	
	ndx=checkRemoteIndex(lx,q);
	if(!ndx) return false;

	data=getUserSettings(refHash);
	if(data==null) {
		return false;
	} else if(typeof data=="object") {
		return data;
	} else if(data.indexOf("{")===0) {
		return $.parseJSON(data);
	} else {
		return data;
	}
}
function saveRemoteData(lx,q, data) {
	refHash=md5(lx+q);
	
	updateRemoteIndex(lx,q,"fetch");

	if(typeof data=="object") {
		if(data.error!=null) return false;
	} else {
		if(data.indexOf("{")==0 && data.indexOf("}")==data.length-1) {
			jsData=$.parseJSON(data);
			if(jsData.error!=null) return false;
		} else {
			
		}
	}
	setUserSettings(refHash,data);
}
function getRemoteIndex(lx,q) {
	refHash=md5(lx+q);
	return refHash;
}
function checkRemoteIndex(lx,q,cachePeriod) {
	if(cachePeriod==null || isNaN(cachePeriod)) {
		cachePeriod=getUserSettings("CACHE_DATA_PERIOD");
	}
	refHash=md5(lx+q);

	if(remoteIndex==null) {
		remoteIndex=getUserSettings("REMOTE-INDEX");
	}
	if(remoteIndex==null) remoteIndex={};

	remoteData=getUserSettings(refHash);

	if(remoteIndex[refHash]==null) {
		return false;
	} else if(remoteData==null || remoteData.error!=null) {
		return false;
	} else {
		if(isOffline()) {
			return true;
		}
		
		currentTime=new Date().getTime();
		cachePeriod=cachePeriod*1000;

		ndx=remoteIndex[refHash];

		if(currentTime-ndx['time']>cachePeriod) {
			return false;
		}
		return true;
	}
}
function updateRemoteIndex(lx,q,type) {
	refHash=md5(lx+q);
	if (appConfig.DEBUG) console.log("INDEX Update : "+refHash);
	
	if(remoteIndex==null) {
		remoteIndex=getUserSettings("REMOTE-INDEX");
	}
	if(remoteIndex==null) remoteIndex={};
	
	date=new Date();

	if(remoteIndex[refHash]==null) {
		remoteIndex[refHash]={
			"link":lx,
			"data":q,
			"query":type,
			"time":date.getTime(),
			"date":date
		};
		setUserSettings("REMOTE-INDEX",remoteIndex);
	} else {
		if(type=="fetch") {
			remoteIndex[refHash]['type']="fetch";
			remoteIndex[refHash]['time']=date.getTime();
			remoteIndex[refHash]['date']=date;
		}
		setUserSettings("REMOTE-INDEX",remoteIndex);
	}
}

//Other functions
function errorReporter(message, url, linenumber, column, errorObj) {
	var stack = '';
	if(errorObj !== undefined) {
		stack = errorObj.stack;
	}
	if(url==null) url=window.location.toString();
	
	$.post(getServiceCMD("errorReporter", "newCrash"), {
		'message': message,
		'url': url,
		'page': window.location.hash,
		'linenumber': linenumber,
		'column': column,
		'stack': stack
	}, function(data) {
		console.warn(data);
	});
	
	trackApp("error",message);
}

//Utility functions
function testConnection(testFunc) {
	if(testFunc==null) testFunc="info";
	fetchLive(getServiceCMD("test",testFunc),function(data) {console.log(data);})
}
