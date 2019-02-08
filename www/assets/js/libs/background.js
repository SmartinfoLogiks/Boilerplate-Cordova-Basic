//Background Mode
function backgroundMode(enable, message) {
	if (message == null) message = 'Click here to go back to the app.';

	if (typeof cordova == "object" && typeof cordova.plugins.backgroundMode == "function") {
		if (enable === false) {
			cordova.plugins.backgroundMode.disable();
		} else {
			cordova.plugins.backgroundMode.on('activate', function() {
				cordova.plugins.backgroundMode.disableWebViewOptimizations();
			});
			cordova.plugins.backgroundMode.setDefaults({
				text: message
			});
			cordova.plugins.backgroundMode.configure({
				silent: true
			});

			cordova.plugins.backgroundMode.excludeFromTaskList();
			cordova.plugins.backgroundMode.overrideBackButton();

			cordova.plugins.backgroundMode.enable();
		}
	}
}