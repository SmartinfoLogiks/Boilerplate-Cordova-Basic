//AJAX UI :: Similar to knockout/angular but simpler
function initAjaxListUI() {
	//console.log("AUTOLOADUI:" + $('.ajaxlist[data-url][data-template]').length);
	$('.ajaxlist[data-url][data-template]').each(function() {
		loadAjaxListUI(this);
	});
	$('.ajaxComponent[data-component]').each(function() {
		$(this).load("app/comps/" + $(this).data("component") + ".html", function() {
			$(this).removeClass("ajaxComponent");
		});
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
		_REMOTE.processAJAXPostQuery(ajaxURI, q, function(ans) {
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
		_REMOTE.processAJAXGetQuery(ajaxURI, function(ans) {
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
