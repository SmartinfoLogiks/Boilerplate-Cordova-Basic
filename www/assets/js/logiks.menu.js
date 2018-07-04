var logiksMenu={
    initialize: function() {
    	if(appConfig.DEBUG) console.log("Menu Initialized");

    	// $("body").delegate("#menuLoader .subMenu>h1", "touch", function(e) {
     //        $(this).closest(".subMenu").toggleClass("open");
     //    });

        $("#menuLoader").addClass("ajaxloading").html("");
    },
    reloadMenu: function() {
	$.getJSON("app.json",function(data) {
            appConfig.MENU=data.MENU;

            loadMenus();
        });
    },
    renderMenu: function() {
    	if(appConfig.DEBUG) console.log("Rendering Menu");

    	if($("#menuLoader").length <= 0) return;
	$("#menuLoader").removeClass("ajaxloading").html("");

	var isLoggedIn = checkLogin(false);

	/*var menus=getUserSettings("APPMENU");
	if(menus==null || menus.length<=0) {
		menus=appConfig.MENU;

		//merge remote menu Items

		setUserSettings("APPMENU",menus);
	} else {
		if(typeof menus=="string") {
			menus=$.parseJSON(menus);
		}
	}*/
	menus=appConfig.MENU;
	logiksMenu.computeMenu(menus);

	$("#menuLoader .subMenu").each(function() {
		if($(this).find("a").length<=0) {
			$(this).detach();
		}
	});

	return menus;
    },

    computeMenu: function(menuData,subMenu) {
			//console.log(menuData);
			$.each(menuData,function(k,v) {
				if(typeof v=="string" && v.substr(0,1)=="@") {
					vx=v.substr(1);
					vx=getUserSettings(vx);

					if(vx!=null && typeof vx=="object") {// && vx.length>0
						menuObjX={};
						$.each(vx,function(a,b) {
							if(b.title!=null) ttl=b.title.replace(/_/g,' ').ucwords();
							else ttl=a.replace(/_/g,' ').ucwords();
							//console.log(ttl);
							menuObjX["#lists/"+a]={
								"title":ttl,
								"rule": "afterlogin"
							};
						});
						menuData[k]=[menuObjX];
					} else {
						delete menuData[k];
					}
				}
			});

			$.each(menuData,function(k,v) {
					if (!checkLinkStatus(k)) return;

					if (typeof v == "object") {
						if (isArray(v)) {
							vx = _ling(k);
							$("#menuLoader").append("<div class='subMenu' data-menu='"+k+"' ><h1 class='subgroup'>" + vx + "<i class='fa fa-angle-right pull-right'></i></h1></div>");

							$.each(v,function(k1,v1) {
								logiksMenu.computeMenu(v1,k);
							});
						} else {
							logiksMenu.addMenuItem(k,v,subMenu);
						}
					} else {
						logiksMenu.addMenuItem(k,v,subMenu);
					}
					});
		},

    addMenuItem: function(k,v,subMenu) {
		if(v.rule==null) v.rule="";
		if(v.icon==null) v.icon="";
		if(v.type==null) v.type="";
		if(v.group==null) v.group="";
		if(v.disabled!=null && v.disabled==true) return;
		if(v.hidden!=null && v.hidden==true) return;

		platform=navigator.platform.toLowerCase();
		if(v.platform!=null && v.platform.length>1 && navigator.platform.toLowerCase().indexOf(v.platform)<0) return;

		switch (v.rule) {
			case "afterlogin":case "postlogin":
				if(!checkUser()) return;
			break;
			case "beforelogin":case "prelogin":
				if(checkUser()) return;
			break;
		}
		if(subMenu==null) {
			subMenu=$("#menuLoader");
		} else {
			if($('.subMenu[data-menu='+subMenu+']',"#menuLoader").length>0) {
				subMenu=$('.subMenu[data-menu='+subMenu+']',"#menuLoader");
			} else {
				subMenu=$("#menuLoader");
			}
		}
		
		if(v.title=="---") v.type="hr";

		switch (v.type) {
			case "hr":
				subMenu.append("<hr>");
			break;
			case "subgroup":
				vt=_ling(v.title);
				subMenu.append("<div class='subgroup' group='"+v.group+"'>"+vt+"</div>");
			break;
			default:
				vt=_ling(v.title);
				subMenu.append("<a href='"+k+"' group='"+v.group+"'>"+vt+v.icon+"</a>");
		}
	}
};