const _REMOTE = {
	cacheData: true,
	pubkey: null,
	headerCache: null,

	initialize: function() {
		
	},

	getDataSource: function() {
		if (getUserSettings("URI_DATA") == null) {
			setUserSettings("URI_DATA", appConfig.URL);
		}
		return getUserSettings("URI_DATA");
	},

	getIdentitySource: function() {
		if (getUserSettings("URI_IDENTITY") == null) {
			if (appConfig.IDENTITY_URL == null) {
				appConfig.IDENTITY_URL = appConfig.URL;
			}
			setUserSettings("URI_IDENTITY", appConfig.IDENTITY_URL);
		}
		return getUserSettings("URI_IDENTITY");
	},

	getServiceHeader: function() {
		//md5(new Date() + appConfig.APPKEY + appVersionCode);
		//getDeviceID()
		if(_REMOTE.pubkey==null) {
			_REMOTE.pubkey = getUserSettings("PUBKEY");
		}

		var headers = {};
		if(_REMOTE.headerCache!=null) {
			headers = _REMOTE.headerCache;
		} else {
			if(appConfig.APPKEY!=null && appConfig.APPKEY.length>0) {
		    	headers.appkey=appConfig.APPKEY
		    }
		    if(appConfig.APIKEY!=null && appConfig.APIKEY.length>0) {
		    	headers.apikey=appConfig.APIKEY
		    }
		    if(_REMOTE.pubkey!=null && _REMOTE.pubkey.length>0) {
		      headers.pubkey = _REMOTE.pubkey;
		    }
		    _REMOTE.headerCache = headers;
		}

	    token = getUserToken();
	    if(token!=null && token.length>0) {
    		headers.token = token;
	    }

	    //"token": _AUTH.getUserToken(),
		//"Authorization": "Bearer " + _AUTH.getUserToken(),
	    authHeader = getAuthorizationHeaders();
	    if(authHeader!=null && typeof authHeader == "object") {
	    	headers = $.extend(headers,authHeader);
	    }
		//duuid = JSON.stringify(window.device);

		return headers;
	},

	getServiceCMD: function(path, params, format) {
		if (!(format != null && format.length > 0)) {
			format = "json";
		}
		lx = _REMOTE.getDataSource() + path;

		lx = lx.replace("?&", "?");
		if(lx.indexOf("?")<0) lx+="?";

		if(appConfig.REFSITE && appConfig.REFSITE.length>0) {
			lx+="&site="+appConfig.REFSITE;
		}
		lx = lx.replace("?&", "?");
		
		if (params != null && typeof params == "object") {
			if (!Array.isArray(params)) {
				q = [];
				$.each(params, function(k, m) {
					q.push(k + "=" + encodeURIComponent(m));
				});
				params = q;
			}
			params = params.join("&");
		}
		if (params != null && params.length > 0) {
			lx += "&" + params;
		}
		//lx += "&currentUser=" + _AUTH.getUserID();

		return lx;
	},

	fetchAssets: function(lx, callback, errorCallback, reCache) {
		if (appConfig.DEBUG) console.debug("ASSETS:" + lx);

		if (reCache !== true) {
			if (_REMOTE.cacheData) {
				cacheData = _REMOTE.getRemoteCache(lx, "");
				if (cacheData !== false) {
					return callback(cacheData);
				}
			}
		}

		$.ajax({
			type: "GET",
			url: lx,
			headers: _REMOTE.getServiceHeader()
		}).done(function(txt) {
			_REMOTE.addRemoteCache(lx, "", txt);

			callback(txt);
		}).fail(function(err) {
			frameworkError(txt);

			if (errorCallback != null) errorCallback(err);
		}).always(function(txt) {

		});
	},

	processAJAXQuery: function(lx, callback, errorCallback, reCache) {
		if (appConfig.DEBUG) console.debug("GET:" + lx);

		if (reCache !== true) {
			if (_REMOTE.cacheData) {
				cacheData = _REMOTE.getRemoteCache(lx, "");
				if (cacheData !== false) {
					return callback(cacheData);
				}
			}
		}

		$.ajax({
				type: "GET",
				url: lx,
				headers: _REMOTE.getServiceHeader()
			}).done(function(txt) {
				if (typeof txt == "object") {
					if (txt.error != null) {
						if (txt.error.code == 401) {
							logoutDirect();
						} else {
							frameworkError(txt.error.code + ", " + txt.error.msg);
						}
						if (errorCallback != null) errorCallback(txt);
						return false;
					}
				}
				_REMOTE.addRemoteCache(lx, "", txt);

				if (callback != null) callback(txt);
			})
			.fail(function(err) {
				if (typeof err == "object") {
					if (err.status == 401) {
						logoutDirect("#auth_login");
					} else if (err.error != null && err.error.code != null) {
						frameworkError(err.error.code + ", " + err.error.msg);
						if (errorCallback != null) errorCallback(err);
						return false;
					}
				} else {
					frameworkError(txt);
				}

				if (errorCallback != null) errorCallback(err);
			})
			.always(function(txt) {

			});
	},
	processAJAXPostQuery: function(lx, q, callback, errorCallback, reCache) {
		if (appConfig.DEBUG) console.debug("POST:" + lx);

		if (reCache !== true) {
			if (_REMOTE.cacheData) {
				cacheData = _REMOTE.getRemoteCache(lx, q);
				if (cacheData !== false) {
					return callback(cacheData);
				}
			}
		}

		$.ajax({
				type: "POST",
				url: lx,
				data: q,
				headers: _REMOTE.getServiceHeader()
			}).done(function(txt) {
				if (typeof txt == "object") {
					if (txt.error != null) {
						if (txt.error.code == 401) {
							logoutDirect();
						} else {
							frameworkError(txt.error.code + ", " + txt.error.msg);
						}
						frameworkError(txt.error.code + ", " + txt.error.msg);
						if (errorCallback != null) errorCallback(txt);
						return false;
					}
				}
				_REMOTE.addRemoteCache(lx, q, txt);
				if (callback != null) callback(txt);
			})
			.fail(function(txt) {
				if (typeof txt == "object") {
					if (txt.error != null && txt.error.code != null) {
						frameworkError(txt.error.code + ", " + txt.error.msg);
						if (errorCallback != null) errorCallback(txt);
						return false;
					}
				} else {
					frameworkError(txt);
				}
				if (errorCallback != null) errorCallback(txt);
			})
			.always(function(txt) {

			});
	},

	processAJAXOtherQuery: function(requestType, lx, q, callback, errorCallback) {
		if (appConfig.DEBUG) console.debug("OTHER:" + lx);

		$.ajax({
				type: requestType,
				url: lx,
				data: q,
				headers: _REMOTE.getServiceHeader()
			}).done(function(txt) {
				if (typeof txt == "object") {
					if (txt.error != null) {
						frameworkError(txt.error.code + ", " + txt.error.msg);
						if (errorCallback != null) errorCallback(txt);
						return false;
					}
				}
				if (callback != null) callback(txt);
			})
			.fail(function(txt) {
				if (typeof txt == "object") {
					if (txt.error != null && txt.error.code != null) {
						frameworkError(txt.error.code + ", " + txt.error.msg);
						if (errorCallback != null) errorCallback(txt);
						return false;
					}
				} else {
					frameworkError(txt);
				}
				if (errorCallback != null) errorCallback(txt);
			})
			.always(function(txt) {

			});
	},

	processAJAXSubmitQuery: function(l, q, callback, errorCallback) {
		if (appConfig.DEBUG) console.debug("SUBMIT:" + l);
		$.ajax({
				type: "POST",
				url: l,
				data: q,
				headers: _REMOTE.getServiceHeader()
			}).done(function(txt) {
				if (typeof txt == "object") {
					if (txt.error != null) {
						frameworkError(txt.error.code + ", " + txt.error.msg);
						if (errorCallback != null) errorCallback(txt);
						return false;
					}
				}
				if (callback != null) callback(txt);
			})
			.fail(function(txt) {
				if (typeof txt == "object") {
					if (txt.error != null && txt.error.code != null) {
						frameworkError(txt.error.code + ", " + txt.error.msg);
						if (errorCallback != null) errorCallback(txt);
						return false;
					}
				}
				if (errorCallback != null) errorCallback(txt);
			})
			.always(function(txt) {

			});
	},


	errorReporter: function(message, url, linenumber, column, errorObj) {
		var stack = '';
		if (errorObj !== undefined) {
			stack = errorObj.stack;
		}
		if (url == null) url = window.location.toString();

		$.post(_REMOTE.getServiceCMD("errorReporter", "newCrash"), {
			'message': message,
			'url': url,
			'page': window.location.hash,
			'linenumber': linenumber,
			'column': column,
			'stack': stack
		}, function(data) {
			console.warn(data);
		});
	},

	//Cache ID
	getRemoteCache: function(url, q) {
		if (typeof q == "object") q = JSON.serialize(q);
		urlHash = md5(url + q);
		cacheData = window.localStorage.getItem("REMOTE-" + urlHash);
		if (cacheData == null) return false;
		else return cacheData;
	},
	addRemoteCache: function(url, q, data) {
		if (typeof q == "object") q = JSON.serialize(q);
		urlHash = md5(url + q);
		window.localStorage.getItem("REMOTE-" + urlHash, data);
		return data;
	},
	deleteRemoteCache: function(url, q) {
		if (typeof q == "object") q = JSON.serialize(q);
		urlHash = md5(url + q);
		window.localStorage.removeItem("REMOTE-" + urlHash);
	}
}