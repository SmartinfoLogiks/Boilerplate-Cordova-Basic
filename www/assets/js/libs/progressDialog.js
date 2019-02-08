//Show progress window
//cordova plugin add cordova-plugin-pdialog

// progressStyle : 'HORIZONTAL',
// progressStyle : 'SPINNER',
// theme : 'DEVICE_LIGHT',
// theme: 'HOLO_DARK'

// cordova.plugin.pDialog.setProgress(50)
// cordova.plugin.pDialog.setTitle('Please Wait...');

function showProgressLoader(params) {
	if(params==null) params = {};
	params = $.extend({
                theme : 'DEVICE_LIGHT',
                progressStyle : 'HORIZONTAL',
                cancelable : false,
                message : 'Sharing your photos'
            },params);
	cordova.plugin.pDialog.init(params);
}

function showProgressLoaderInfinite(params) {
	if(params==null) params = {};
	params = $.extend({
                theme : 'HOLO_DARK',
                progressStyle : 'SPINNER',
                cancelable : false,
                message : 'Your photos are loading ...'
            },params);
	cordova.plugin.pDialog.init(params);
}

function hideProgressLoader() {
	cordova.plugin.pDialog.dismiss();
}