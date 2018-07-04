var logiksWorkers={
	
	workerList:{
		
	},

	initialize: function() {
		if(appConfig.DEBUG) console.log("Initializing Workers");
	},
	addWorker: function(key, workerFile, onMessageCallback, onErrorCallback) {
		logiksWorkers.workerList[key]={
			"file":workerFile,
			"callback":onMessageCallback,
			"error":onErrorCallback,
			"instance":null,
			"running":false
		};
	},
	startWorker: function(key, workerFile, onMessageCallback, onErrorCallback) {
		logiksWorkers.workerList[key]={
			"file":workerFile,
			"callback":onMessageCallback,
			"error":onErrorCallback,
			"instance":null,
			"running":false
		};
		
		vx=new Worker(workerFile);
		
		if(vx!=null) {
			vx.onmessage=function(ex) {
				if(typeof onMessageCallback=="function") onMessageCallback(ex);
				else if(window[onMessageCallback]!=null) window[onMessageCallback](ex);
			}
			vx.onerror=function(ex) {
				if(typeof onErrorCallback=="function") onErrorCallback(ex);
				else if(window[onErrorCallback]!=null) window[onErrorCallback](ex);
			}
			logiksWorkers.workerList[key]["instance"]=vx;
			logiksWorkers.workerList[key]["running"]=true;
		}
		
		return vx;
	},
	startAll: function() {
		if(appConfig.DEBUG) console.log("Start All Stopped Workers");

		$.each(logiksWorkers.workerList,function(k,v) {
			try {
				if(logiksWorkers.workerList[k]==null) {
					logiksWorkers.startWorker(k,v.file,v.callback);
				} else if(logiksWorkers.workerList[k]['running']==false) {
					logiksWorkers.startWorker(k,v.file,v.callback);
				} else {
					
				}
			} catch(e) {

			}
		});
	},
	terminateAll: function() {
		if(appConfig.DEBUG) console.log("Terminated All Workers");

		$.each(logiksWorkers.workerList,function(k,v) {
			try {
				if(v.instance!=null) {
					v.instance.terminate();
					v.instance=null;
					v.running=false;
				}
			} catch(e) {
			}
		});
	},
	terminateWorker: function(key) {
		if(appConfig.DEBUG) console.log("Terminated One Worker "+key);
		
		v=logiksWorkers.workerList[key];
		if(v!=null) {
			if(v.instance!=null) v.instance.terminate();
			v.instance=null;
			v.running=false;
		}
	}
};

//close
//importScripts