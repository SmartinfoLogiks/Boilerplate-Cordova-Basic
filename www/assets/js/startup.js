requirejs.config({
	baseUrl: 'assets/js',
	paths: {
		libs: '../../assets/js/libs',
		lang: '../../assets/lang',
		app: '../../app',
		appjs: '../../app/js',
		npmjs: '../../node_modules',
	}
});
require(["npmjs/moment/moment"], function(obj) {
	window.moment = obj;
});

/*require(["npmjs/vue/dist/vue.min"], function(obj1) {
        window.Vue = obj1;
      });*/
require(["npmjs/handlebars/dist/handlebars.min"], function(ko) {
	window.Handlebars = ko;
	require(["commons_hbars"], function(obj1) {

	});
});
require(["md5"], function(obj1) {
	window.md5 = obj1;
});
requirejs([
	"npmjs/jquery/dist/jquery",
], function(obj1) {
	requirejs([
		"npmjs/bootstrap/dist/js/bootstrap.bundle.min",
		// "npmjs/jquery-ui/build/release",
		"base64",

		"commons",
		"framework.commons",
		"framework.storage",
		"framework.security",
		"framework.ui",
		"framework.ling",
		"framework.remote",
		"framework.triggers",
		"framework.workers",
		"uikit",
	], function(obj1) {
		requirejs([
			"framework",
			"app/app"
		], function(obj1) {
			require(["npmjs/bootbox/bootbox.min"], function(obj1) {
				window.bootbox = obj1;
			});

			$.getJSON("app.json", function(data) {
				appConfig = data;
				if (appConfig.CONFIG[appConfig.appstatus] != null) {
					appConfig = $.extend(appConfig, appConfig.CONFIG[appConfig.appstatus]);
				}
				_REMOTE.initialize();
				
				_LING.initialize(function() {
				$("#pageWrapper").load("app/app.html", function() {
					loadAppCore();
					});
				});
			});
		});
	});
});
