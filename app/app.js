var app = {
	initialize: function() {
        currentUser=window.localStorage.getItem("USERKEY-USER");
        pageLoader("Initiating...");

        app.registerEvents();
        $(window).on('hashchange', $.proxy(this.route, this));

        $.getJSON("apps.json",function(data) {
            appConfig=data;
            app.loadDataSystem();
        });
    },
    loadDataSystem: function() {
        cleanupDate=window.localStorage.getItem("LAST_UPDATED");
        if(cleanupDate==null) {
            window.localStorage.setItem("LAST_UPDATED",new Date());
        }
        var self = this;
        
        appLang=window.localStorage.getItem("APP-LANG");
        if(appLang==null) {
            html=getLingSelector();

            $("#wrap").html(html);
            return;
        }

        $.get("app/app.html",function(html) {
        	//html=html.replace(/#[a-zA-Z0-9-_,.]+#/gi, htmlContentReplacer);
        	$("#wrap").html(html);
        }).done(function() {
        		if(window.location.hash==null || window.location.hash.length<=2) {
		            if(cleanupDate==null) {
		                app.route("#login");
		            } else {
		                app.route(appConfig.PAGEHOME);
		            }
		        } else {
		            app.route();
		        }
			}).fail(function() {
				console.error("Page Function Not Found : "+pageRef);
                loadPage(appConfig.PAGEHOME,pageParam);
			}).always(function() {
				loadMenus();
            	loadUserinfoBar();
			});

        this.startProcess();
    },
    route: function(hash) {
    	if(hash==null || typeof hash=="object") {
            hash = window.location.hash.toString();
        } else {
            window.location.hash=hash;
            return;
        }
        if(appConfig.DEBUG) console.debug("ROUTER-HASH:"+hash);

        hashArr=hash.split("/");
        pg=hashArr[0];

        currentUser=getUserID();

        loadPage(pg.toLowerCase());

        if(hash!="#logout") appPageHistory.push(hash);
        if(window.tapstream!=null) {
            window.tapstream.fireEvent('PAGE-'+pg.substr(1).toUpperCase(),false,{
              'userid':currentUser
            });
        }
        trackApp("pageview",pg.substr(1).toUpperCase());

        $(".cbp-spmenu").removeClass("cbp-spmenu-open");

        if($(".overlay").length>0) {
            $(".overlay").fadeOut("slow",function() {$(".overlay").detach();});
        }
    },
    startProcess: function() {
        // setInterval(function() {
        //         checkNotifications();
        //     },getUserSettings("NOTIFICATION_INTERVAL"));
    },
    registerEvents: function() {
        var self = this;
        //window.onerror=errorReporter;
        
        //Physical Button Events
        document.addEventListener("deviceready", function() {
                // window.plugins.webintent.getExtra(window.plugins.webintent.EXTRA_TEXT, 
                //         function(data) {
                //              console.log(data)
                //             }, function(e) {
                //                 console.warn(data)
                //                 // There was no extra supplied.
                //             }
                //     );
                document.addEventListener("backbutton", function(e) {
                        if(appConfig.DEBUG) console.log("EVENT:Back Button");
                        goBack();
                        return true;
                    }, false);
                
                document.addEventListener("resume", function(e) {
                    //if(appConfig.DEBUG) console.log("EVENT:App Resume");
                }, false);
                
                document.addEventListener("pause", function(e) {
                    //if(appConfig.DEBUG) console.log("EVENT:App Pause");
                }, false);

                document.addEventListener("menubutton", function(e) {
                        if(appConfig.DEBUG) console.log("EVENT:App Menu");
                        e.preventDefault();
                        classie.toggle(document.getElementById('cbp-spmenu-s1') , 'cbp-spmenu-open');
                    }, false);

                window.plugin.notification.local.onclick=function(nid, state, json) {
                        if(allNotifications[nid]=="alerts") {
                            pageNotfications();
                        } else if(allNotifications[nid]=="explore") {
                            pageExplorer();
                        }
                    };
                window.plugin.notification.local.oncancel=function(nid, state, json) {
                        delete(allNotifications[nid]);
                    };

             }, false);
        

        //All Primary button ids
        $("body").delegate("a.pageLink","touch",function(e) {
            href=$(this).attr("href");
            if(href.charAt(0)=="#") {
                app.route(href);
            } else {
                navigator.app.loadUrl(href, { openExternal:true });
            }
        });
        $(".wrapper").on('scroll', function() {
            if($("#mainContainer .showMore").length>0) {
                if(isElementInViewport($("#mainContainer .showMore"))) {
                    showMorePictures();
                }
            }
        });
    }
};

app.initialize();