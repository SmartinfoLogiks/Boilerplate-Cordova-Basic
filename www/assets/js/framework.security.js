const _AUTH={
  initialize: function() {
    console.log("SECURITY INITIALIZE");
  },
  isLoggedIn : function() {
	if (getUserSettings("USERKEY-TOKEN") == null) {
			return false;
	} else {
		return true;
	}
  },
    
  checkLogin: function(userID) {
    
  },
  doLogin: function(userid, password, callBack) {
    var q = 'userid=' + userid + '&password=' + password + '&mauth=jwt';
    if(appConfig.REFSITE!=null && appConfig.REFSITE.length>0) {
      q+="&site="+appConfig.REFSITE;
    }
    
    var lx = _REMOTE.getServiceCMD('auth');
    _REMOTE.processAJAXSubmitQuery(lx, q, function(data) {
      // console.log(data);
      if (data.token != null) {
        setUserSettings("USERKEY-TOKEN", data.token);
        setUserSettings("USERKEY-USERID", data.userid);
        setUserSettings("USERKEY-NAME", data.name);
        setUserSettings("USERKEY-EMAIL", data.email);
        setUserSettings("USERKEY-USER", data);
	setUserSettings("LAST_LOGIN_DATE", moment().format("Y-MM-DD HH:mm:ss"));
        
        if(callBack!=null && typeof callBack == "function") callBack(data);
        else loadPage("#home");
      } else {
        if(callBack!=null && typeof callBack == "function") callBack(data);
        else lgksToast("Login Error");
      }
    });
  },
  generateToken: function() {
    //USERKEY-TOKEN
  },
  resetAuthToken: function() {
    //USERKEY-TOKEN
  },
  doLogout: function(gotoPage) {
    if (appConfig.DEBUG) console.warn("Logout Direct Called");
    
    if(gotoPage==null || gotoPage.length<=0) gotoPage=appConfig.PAGEHOME;

    if(window.plugins!=null) {
      if (window.plugins.googleplus != null) window.plugins.googleplus.logout()
    }

    dataSRC = getUserSettings("DATASRC");
    lang = getUserSettings("APP-LANG");
    
    window.localStorage.clear();

    setUserSettings("APP-LANG", lang);
    setUserSettings("DATASRC",dataSRC)

    $.getJSON("app.json",function(data) {
            appConfig=data;
            if(appConfig.CONFIG[appConfig.appstatus]!=null) {
              appConfig = $.extend(appConfig,appConfig.CONFIG[appConfig.appstatus]);
            }

            reloadAppCore(gotoPage);
        });
  },
  getUserToken: function() {
    return getUserSettings("USERKEY-TOKEN");
  },
  getUserID: function() {
    userID = getUserSettings("USERKEY-USERID");
    if (userID == null) return "";
    else return userID;
  },
  getMyProfile: function(callBack) {
    callBack(false);
  }
}
