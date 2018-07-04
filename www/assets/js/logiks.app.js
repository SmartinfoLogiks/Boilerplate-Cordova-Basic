var app={
    processList: [],
    initialize: function() {
        currentUser=getUserSettings("USERKEY-USER");
        pageLoader("Initiating...");

        triggerEvents.runTriggers('onAppPreload');

        app.registerEvents();
        $(window).on('hashchange', $.proxy(this.route, this));

        $.getJSON("app.json",function(data) {
            appConfig=data;
            
            if(appConfig.CHECKONLINE) {
                checkServerUplink(function() {
                    app.loadDataSystem();
                });
            } else {
                app.loadDataSystem();
            }
        });
    },
    loadDataSystem: function() {
        storage.initialize(appConfig.APPNAME.toLowerCase());
	logiksCmds.initialize();
      
        if(typeof cordova=="object") {
          cordova.getAppVersion.getVersionNumber(function(d) {
                      appVersion=d;
                    });
          cordova.getAppVersion.getVersionCode(function(d) {
                      appBuild=d;
                    });
        }

        cleanupDate=getUserSettings("LAST_UPDATED");
        if(cleanupDate==null) {
            setUserSettings("LAST_UPDATED",new Date().toString());
        }
        var self = this;
        
        appLang=getUserSettings("APP-LANG");
        if(appLang==null || appLang.length<=0 || appLang=="null") {
            html=getLingSelector();

            $("#mainContainer").html(html);
            return;
        }
        triggerEvents.runTriggers('onAppLoad');
      
        logiksWorkers.initialize();
        
        require(['lang/'+appLang],function() {
                $.get("app/app.html",function(html) {
                    html=html.replace(/#[a-zA-Z0-9-_,.]+#/gi, htmlContentReplacer);
                    $("#mainContainer").html(html);

                    if(appConfig.DEBUG) console.log("App Layout Loaded.");
                }).done(function() {
                        if(window.location.hash==null || window.location.hash.length<=2) {
//                             if(cleanupDate==null) {
//                                 app.route("#login");
//                             } else {
//                                 app.route(appConfig.PAGEHOME);
//                             }
                            app.route(appConfig.PAGEHOME);
                        } else {
                            app.route();
                        }
                    }).fail(function() {
                        console.error("Boot layout not found in the form of app/app.html");
                        loadPage(appConfig.PAGEHOME,pageParam);
                    }).always(function() {
                        logiksMenu.initialize();
                        if(appConfig.DEBUG) console.log("First Render Complete");
                    });
                app.startProcess();
            });
    },
    route: function(hash) {
        if(hash==null || typeof hash=="object") {
            hash = window.location.hash.toString();
        } else {
            if(hash.indexOf("/")>0) hash="#"+hash;
            window.location.hash=hash;
            return;
        }
        if(hash==null || hash.length<=0) {
          console.error("HASH NOT FOUND");
          return;
        }
        if(appConfig.DEBUG) console.log("ROUTER-HASH:"+hash);

        hashArr=hash.split("/");
        pg=hashArr[0];

        currentUser=getUserID();

        loadPage(pg.toLowerCase());

        if(hash!="#logout") appPageHistory.push(hash);
        
        trackApp("pageview",pg.substr(1).toUpperCase());

        $("#popupoverIcon").html("");

        $(".cbp-spmenu").removeClass("cbp-spmenu-open");

        if($(".overlay").length>0) {
            $(".overlay").fadeOut("slow",function() {$(".overlay").detach();});
        }
    },
    registerEvents: function() {
        var self = this;
        //window.onerror=errorReporter;
        
        //Physical Button Events
        document.addEventListener("deviceready", function() {
                if(appConfig.DEBUG) console.info("Device Ready");
                
                if(cordova.plugins.webintent!=null) {
                  cordova.plugins.webintent.getExtra(cordova.plugins.webintent.EXTRA_TEXT, 
                        function(data) {
                             console.warn(data)
                            }, function(e) {
                             console.warn(e)
                                // There was no extra supplied.
                            }
                    );
                }
                
                document.addEventListener("backbutton", function(e) {
                        if(appConfig.DEBUG) console.log("EVENT:Back Button");
                        triggerEvents.runTriggers("onBackButton");
                        goBack();
                        return true;
                    }, false);
                
                document.addEventListener("resume", function(e) {
                    if(appConfig.DEBUG) console.log("EVENT:App Resume");
				isAppInForeground = true;
                    triggerEvents.runTriggers("onAppResume");
                    return true;
                }, false);
                
                document.addEventListener("pause", function(e) {
                    if(appConfig.DEBUG) console.log("EVENT:App Pause");
				isAppInForeground = false;
                    triggerEvents.runTriggers("onAppPause");
                }, false);

                document.addEventListener("menubutton", function(e) {
                        if(appConfig.DEBUG) console.log("EVENT:App Menu");
                        e.preventDefault();
                        triggerEvents.runTriggers("onMenuButton");
                        $(".cbp-spmenu").removeClass("cbp-spmenu-open");
			//$(".cbp-spmenu.cbp-spmenu-open").toggleClass("cbp-spmenu-open");
                    }, false);

//                 window.plugin.notification.local.onclick=function(nid, state, json) {
//                         console.log(json);
//                         app.route("#notifications");
//                     };
//                 window.plugin.notification.local.oncancel=function(nid, state, json) {
//                         delete(allNotifications[nid]);
//                     };
                
                triggerEvents.runTriggers("onDeviceReady");
             }, false);
        

        //All Primary button ids
        $("body").delegate("a.pageLink,a.btn-link,.gotoLink[href]","touch",function(e) {
            href=$(this).attr("href");
            if(href=="#refresh") {
                reloadPage();
            } else if(href.charAt(0)=="#") {
                app.route(href);
            } else {
                if($(this).hasClass("browser") || $(this).hasClass("inbrowser")) {
                  navigator.app.loadUrl(href, { openExternal:true });
                  //cordova.InAppBrowser.open(href, '_system', 'location=yes');
                } else {
                  cordova.InAppBrowser.open(href, '_blank', 'location=yes');
                }
            }
        });
        $("body").delegate("a.inappLink,a.inapp-link,.inappLink[href]","touch",function(e) {
            href=$(this).attr("href");
            if($(this).hasClass("browser") || $(this).hasClass("inbrowser")) {
              cordova.InAppBrowser.open(href, '_blank', 'location=no');  
            } else {
              navigator.app.loadUrl(href, { openExternal:true });
              //cordova.InAppBrowser.open(href, '_system', 'location=yes');
            }
        });
        $("body").delegate(".actionIcon[cmd],.actionCmd[cmd]","touch",function(e) {
            cmd=$(this).attr("cmd");
            if(window[cmd]!=null && typeof window[cmd]=="function") {
                window[cmd](this);
            }
        });
      
        $("body").delegate("*[data-toggle='collapse'][href]","touch",function(e) {
            href=$(this).attr("href");
            $(href).toggle();
        });

	$("body").delegate("*[data-toggle='toggle'][href]", "touch", function(e) {
		href = $(this).attr("href");
		if ($(href).is(":visible")) {
			$(href).hide();
		} else {
			$(this).closest(".toggleContainer").find(".toggleTarget").hide();
			$(href).show();
		}
	});

        $("body").delegate("*[data-toggle='pill'][href]","touch",function(e) {
            $(this).tab("show");
        });
        
        $("body").delegate(".nav.nav-tabs li a","touch",function(e,src) {
            $(this).tab("show");
        });
        
        $("body").delegate(".toast.lgksToast","touch",function() {$(this).detach();});
	
	$("body").delegate(".transferClick", "touch", function(e) {
            $(this).click();
	});

        $("body").delegate(".header .navbar-back","touch",function(e) {
            if(appConfig.DEBUG) console.log("EVENT:Back Button");
            goBack();
        });

        $(".wrapper").on('scroll', function() {
            if($("#mainContainer .showMore").length>0) {
                if(isElementInViewport($("#mainContainer .showMore"))) {
                    //showMorePictures();
                }
            }
        });
    },
    startProcess: function() {
        if(appConfig.DEBUG) console.log("Starting Process Queue : " + new Date());
        setInterval(function() {
                if(appConfig.DEBUG) console.log("Running Uplink Test : " + new Date());
                checkServerUplink();
            },getUserSettings("PING_INTERVAL"));

        setInterval(function() {
            if(appConfig.DEBUG) console.log("Running Process Queue : " + app.processList.length +" @"+ new Date());
            $.each(app.processList,function(e,prs) {
                if(typeof prs == "function") {
                    prs();
                } else if(window[prs]!=null && typeof window[prs] == "function") {
                    window[prs]();
                }
            });
        },getUserSettings("PROCESS_INTERVAL"));
        
        checkServerUplink();
    }
};

$(document).on("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
});
