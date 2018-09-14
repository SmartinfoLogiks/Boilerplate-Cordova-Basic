$.get("./app/comps/topbar/index.html", function(html) {
	new Vue({
        el: '#topbar',
        data: {
          title: appConfig.APPTITLE
        },
        template: html
      })
});