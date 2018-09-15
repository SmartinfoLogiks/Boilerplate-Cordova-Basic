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
require(["npmjs/vue/dist/vue"], function(obj1) {
        window.Vue = obj1;
      });
require(["npmjs/handlebars/dist/handlebars.min"], function (ko) {
        window.Handlebars = ko;
        require(["commons_hbars"], function(obj1) {
          
        });
    });
requirejs([
  "npmjs/jquery/dist/jquery",
], function(obj1) {
  requirejs([
    "npmjs/bootstrap/dist/js/bootstrap.bundle.min",
    "npmjs/jquery-ui/build/release",
    
    "commons",
    "framework.remote",
    "framework.triggers",
  ], function(obj1) {
    requirejs([
        "framework",
        "npmjs/bootbox/bootbox.min",
      ], function(obj1) {
        window.bootbox = obj1;
        $.getJSON("app.json",function(data) {
              appConfig=data;

              $("#pageWrapper").load("app/app.html", function() {
                loadAppCore();
              });
          });
      });
  });
});