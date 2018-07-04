var pageParamHash = "";

function loadPage(pageRef, pageParam) {
	pageParamHash = pageParam;
	pageRef = pageRef.toLowerCase();

	if (!checkLinkStatus(pageRef, true)) return false;

	if (appConfig.DEBUG) console.log("New Loader : " + pageRef + " : " + pageParam);

	if (pageRef == "logout" || pageRef == "#logout") {
		logout();
		return true;
	}

	reloadResourceFunc=null;

	pageLoader();

	pageRef = pageRef.split("/");
	pageRef = pageRef[0];

	pageRef = pageRef.replace("#", "").replace("#", "").replace("#", "").toLowerCase();
	pageRef = pageRef.replace("-", "/");

	if($.inArray(pageRef,appConfig.PAGECONFIG.NOHEADER)>=0) {
		$("#wrap>.header").hide();
		$("#wrap>.header").addClass("hidden");
		$("#wrap").addClass("noheader");
	} else {
		$("#wrap>.header").show();
		$("#wrap>.header").removeClass("hidden");
		$("#wrap").removeClass("noheader");
	}

	if($.inArray(pageRef,appConfig.PAGECONFIG.NOFOOTER)>=0) {
		$("#wrap>.footer").hide();
		$("#wrap").addClass("nofooter");
		$("#wrap").addClass("nofooter");
	} else {
		$("#wrap>.footer").show();
		$("#wrap").removeClass("nofooter");
		$("#wrap").removeClass("nofooter");
	}

	if($.inArray(pageRef,appConfig.PAGECONFIG.NOBACKBTN)>=0) {
		$(".header .navbar-back").hide();
	} else {
		if(appPageHistory.length>=1) {
			$(".header .navbar-back").show();
		}
	}

	triggerEvents.runTriggers('onPagePreload',pageRef);

	$.get("app/pages/" + pageRef + ".html", function(html) {
		//Internationalization Of HTML Content
		html = html.replace(/#[a-zA-Z0-9-_,.]+#/gi, htmlContentReplacer);
		/*
		$.each(lingData[appLang],function(k,v) {
		    if(k==null || k.length<=0 || v.length<=0) return;
		    regx=new RegExp("\\b"+k+"\\b","gi");
		    html=html.replace(regx, v);
		});
		*/
		updateTitle(pageRef.toTitle());
		
		$("body").attr("class",pageRef+"-body cbp-spmenu-push app");
		$("#mainContainer").attr("class",pageRef+"-view container").html(html);

		triggerEvents.runTriggers('onPagePostload',pageRef);
	}).done(function() {
		triggerEvents.runTriggers('onFirstPage');
	}).fail(function() {
		loadPage(appConfig.PAGEERROR, pageParam);
	}).always(function() {
		allowUserInteraction();
		loadMenus();
		loadUserinfoBar();

		initUIXtras();

		triggerEvents.runTriggers('onPageLoad',window.location.hash);
	});
	return true;
}

function initUIXtras() {
	$(".component[data-componentid]").each(function() {
		compid=$(this).data("componentid");
		if(compid==null) return;
		$(this).load("./app/comps/"+compid+".html");
	});
	
	initAjaxListUI();
}

function checkLinkStatus(pageRef, takeAction) {
	if (takeAction == null) takeAction = false;
	returnValue = true;
	returnAction = "";
	if (appConfig.MENU[pageRef] != null && (typeof appConfig.MENU[pageRef] == "object") && appConfig.MENU[pageRef]['rule'] != null) {
		switch (appConfig.MENU[pageRef]['rule']) {
			case "afterlogin":
				returnValue = checkUser();
				returnAction = "#auth_login";
				break;
			case "beforelogin":
				returnValue = !checkUser();
				returnAction = appConfig.PAGEHOME;
				break;
		}
	}
	if (takeAction && !returnValue && returnAction.length > 0) {
		app.route(returnAction);
	}
	return returnValue;
}

function loadUserinfoBar() {
	$("#userProfile").show();
	
	if (getUserID().length <= 0) {
		$("#userProfile figure img").attr("src", "assets/media/logos/logo.png");
		$("#userProfile .infoData .userName").html("New User");
		$("#userProfile .infoData .small").html("");
		
		return false;
	}
	userData=getUserSettings("USERKEY-DATA");
	if (userData == null || typeof userData == "undefined") {
		refetchUserData();
	} else {
		avatar=getAvatar(userData.avatar);

		$("#userProfile figure img").attr("src", avatar);
		$("#userProfile .infoData .userName").html(userData.name);
		if(userData.state!=null) {
			$("#userProfile .infoData .small").html(userData.state + ", " + userData.country);
		} else {
			$("#userProfile .infoData .small").html(userData.email);
		}
	}
	//$("#userProfile").show();
}
function getAvatar(avatar) {
	if(avatar==null || avatar.length<=0) {
		return "media/images/user.jpg";
	}
	if(isOffline()) {
		return "media/images/user.jpg";
	}
	if(avatar.indexOf("://")>0) {
		return avatar;
	} else if(avatar=="::") {
		return "media/images/user.jpg";
	} else if(avatar.indexOf("::")>0) {
		return getServiceCMD("avatar")+"&avatar="+avatar;
	} else {
		return avatar;
	}
}
//All UX Elements
function getLingSelector() {
	html = "<div id='lingSelector' class='row' style='margin: 10px;'><div class='modal-content'>";
	html += "<div class='modal-header'><h4 class='modal-title'>Select Preferred Language</h4></div>";
	html += "<div class='modal-body'>";
	html += "<select class='form-control' name='language' id='language'>";
	$.each(appConfig.lang, function(k, v) {
		if (v == appLang) html += "<option value='" + k + "' selected>" + v + "</option>";
		else html += "<option value='" + k + "'>" + v + "</option>";
	});
	html += "</select>";
	html += "</div>";
	html += "<div class='modal-footer'>";
	html += "<button id='saveLingSettings' type='button' class='btn btn-primary' style='padding-top:7px;'>Save</button>";
	html += "</div>";
	html += "</div></div>";

	$("body").delegate("#saveLingSettings", "touch", function(e) {
		saveLingSettings($("#language").val());
	});
	return html;
}

function blockUserInteraction(msg) {
	$("#blockingOverlay").detach();
	$("body").append("<div id='blockingOverlay' class='overlay'><i class='fa-li fa fa-spinner fa-spin'></i><div class='text'></div></div>");
	if(msg!=null && msg.length>0) updateBlockedMsg(msg);
}
function allowUserInteraction() {
	$("#blockingOverlay").detach();
}
function updateBlockedMsg(msg,replace) {
	if(replace===true) {
		$("#blockingOverlay .text").append("<div>"+msg+"</div>");
	} else {
		$("#blockingOverlay .text").html("<div>"+msg+"</div>");
	}
	
}

function updateTitle(ttl) {
	if(ttl==null || ttl.toUpperCase()=="DASHBOARD") {
		ttl=appConfig.APPTITLE;
	}
	$(".header .navbar-header .navbar-brand").html(ttl);
}

function loadMenus() {
  
}

//AJAX UI :: Similar to knockout/angular but simpler
function initAjaxListUI() {
	//console.log("AUTOLOADUI:" + $('.ajaxlist[data-url][data-template]').length);
	$('.ajaxlist[data-url][data-template]').each(function() {
		loadAjaxListUI(this);
	});
}

function reloadAjaxListUI(ele) {
	$(ele).data("page", 0);
	loadAjaxListUI(ele);
}

function loadAjaxListUI(ele) {
	ajaxURL = $(ele).data("url");
	ajaxParams = $(ele).data("params");
	ajaxFilterFunc = $(ele).data("filterfunc");
	ajaxPreLoad = $(ele).data("preload");

	page = $(ele).data("page");
	limit = $(ele).data("limit");

	if (page == null || page == 0) {
		page = 0;
		$(ele).data("page", 0);
	}

	if (limit == null) limit = 20;
	if (ajaxParams == null) ajaxParams = "";

	$(ele).find(".showmore").detach();

	if (page == 0) {
		$(ele).html("<div class='loaderui text-center'><div class='fa fa-spinner fa-spin fa-3x'></div></div>");
	}

	if (ajaxPreLoad != null && ajaxPreLoad.length > 0 && typeof window[ajaxPreLoad] == "function") {
		window[ajaxPreLoad](ele);
	}

	ajaxURI = getServiceCMD(ajaxURL) + "&page=" + page + "&limit=" + limit + ajaxParams;
	if (ajaxFilterFunc != null && ajaxFilterFunc.length > 0 && typeof window[ajaxFilterFunc] == "function") {
		//POST
		q = window[ajaxFilterFunc](ele);
		processAJAXPostQuery(ajaxURI, q, function(ans) {
				try {
					ajaxPostLoad = $(ele).data("postload");
					ajaxShowMore = $(ele).data("showmore");
					ajaxTMPL = $(ele).data("template");

					ajaxTMPL = $("#" + ajaxTMPL).html();
					// console.log([ajaxTMPL, ans.Data]);

					uiRenderer = Handlebars.compile(ajaxTMPL);

					htmlData = uiRenderer({
						"Data": ans.Data
					});
					$(ele).find(".loaderui").detach();
					$(ele).append(htmlData);

					page = $(ele).data("page");
					page++;
					$(ele).data("page", page);

					if ($(ele).children().length > 0 && (ajaxShowMore == "true" || ajaxShowMore === true)) {
						if (ans.Data.length >= limit) {
							$(ele).append("<span class='showmore'>more ...</span>");
						}
					}

					if (ajaxPostLoad != null && ajaxPostLoad.length > 0 && typeof window[ajaxPostLoad] == "function") window[ajaxPostLoad](ele, ans);
				} catch (e) {
					ajaxPostError = $(ele).data("posterror");
					console.error(e);
					if (ajaxPostError != null && ajaxPostError.length > 0 && typeof window[ajaxPostError] == "function") window[ajaxPostError](ele, ans);
				}
			},
			function(e) {
				ajaxPostError = $(ele).data("posterror");

				if (ajaxPostError != null && ajaxPostError.length > 0 && typeof window[ajaxPostError] == "function") window[ajaxPostError](ele);
			}, true, true);
	} else {
		//GET
		processAJAXGetQuery(ajaxURI, function(ans) {
			try {
				ajaxPostLoad = $(ele).data("postload");
				ajaxShowMore = $(ele).data("showmore");
				ajaxTMPL = $(ele).data("template");

				ajaxTMPL = $("#" + ajaxTMPL).html();
				//console.log([ajaxTMPL, ans.Data]);

				uiRenderer = Handlebars.compile(ajaxTMPL);

				htmlData = uiRenderer({
					"Data": ans.Data
				});
				$(ele).find(".loaderui").detach();
				$(ele).append(htmlData);

				page = $(ele).data("page");
				page++;
				$(ele).data("page", page);

				if ($(ele).children().length > 0 && (ajaxShowMore == "true" || ajaxShowMore === true)) {
					$(ele).append("<span class='showmore'>more ...</span>");
				}

				if (ajaxPostLoad != null && ajaxPostLoad.length > 0 && typeof window[ajaxPostLoad] == "function") window[ajaxPostLoad](ele, ans);
			} catch (e) {
				ajaxPostError = $(ele).data("posterror");
				console.error(e);
				if (ajaxPostError != null && ajaxPostError.length > 0 && typeof window[ajaxPostError] == "function") window[ajaxPostError](ele, ans);
			}
		});
	}
}