/*
 * logiks.cmds.js
 * This is the command center for Logiks Cordova Application
 * From here we can execute various commands that are required to be executed
 *
 */

 var logiksCmds={
    initialize: function() {
    	if(appConfig.DEBUG) console.log("Commands Initialized");
    },
    handle: function(strCmd) {
      try {
        if(typeof strCmd.data=="string") {
          if(strCmd.data.charAt(0)=="{") {
            strCmd.data=JSON.parse(strCmd.data);
          } else if(strCmd.data.charAt(0)=="#") {
            strCmd.data={"goto":strCmd.data};
          } else {
            strCmd.data={"callback":strCmd.data};
          }
        }
        if(strCmd.data.callback!=null) {
          logiksCmds.execute(strCmd.data.callback,strCmd.data);
        } else if(strCmd.data.goto!=null && strCmd.data.goto.length>0) {
          app.route(strCmd.data.goto);
        }
      } catch(e) {
        console.error(e);
      }
    },
    execute: function(cmd, params) {
    	if(cmd==null || cmd.length<=0) return false;

    	if(cmd != null && typeof cmd == "function") {
            return cmd(params);
        } else if(window[cmd]!=null && typeof window[cmd] == "function") {
            return window[cmd](params);
        } else {
        	return null;
        }
    },
    settings: function(k,v) {
    	if(k==null || k.length<=0) return false;
    	switch(k) {
            case "brand_title":
                if(v==null || v.length<=0) v=appConfig.APPTITLE;
                appConfig.APPTITLE=v;
                $(".header .navbar-header .navbar-brand").html(v);
                break;
            case "brand_logo":
                if(v==null || v.length<=0) return;
                $(".header .navbar-header .navbar-brand").css("background-image","url('"+v+"')");
                break;
            case "brand_watermark":
                if(v==null || v.length<=0) return;
                $("#wrap").css("background-image","url('"+v+"')");
                break;
            case "color_topbar":
                if(v!=null && v.length>2 && v.substr(0,1)!="#") v="#"+v;
                $(".header .navbar-header").css("background-color",v);
                $(".cbp-spmenu .mimicHeaderBar .buttonSpace").css("background-color",v);
                break;
            case "color_background":
                if(v!=null && v.length>2 && v.substr(0,1)!="#") v="#"+v;
                $("#wrap").css("background-color",v);
                break;
            case "preload_collections":
                if(Array.isArray(v)) {
                  $.each(v, function(a,b) {
                    if(appConfig.DEBUG) console.log("PRELOADING : "+b);
                    processAJAXGetQuery(getServiceCMD("data","fetch")+"&type="+b);
                  });
                }
              break;
            default:
              if(appConfig.DEFAULTS[k]!=null) {
                setUserSettings(k,v);
              }
        }
    }
};