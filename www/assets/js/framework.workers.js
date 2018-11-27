// This Object is used to run subprocess in parallel thread to handle heavy lifting tasks.
// These are based on WebWorkers.

var logiksWorkers={
	
	workerList:{},

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
	runWorker: function(key, workerFile, onMessageCallback, onErrorCallback) {
		logiksWorkers.workerList[key]={
			"file":workerFile,
			"callback":onMessageCallback,
			"error":onErrorCallback,
			"instance":null,
			"running":false
		};
		
		return logiksWorkers.startWorker(key);
	},
	startWorker: function(key) {
		if(logiksWorkers.workerList[key]!=null) {
			workerObj=logiksWorkers.workerList[key];
			
			workerFile=workerObj.file;
			onMessageCallback=workerObj.callback;
			onErrorCallback=workerObj.error;
			
			vx=new Worker(workerFile);
		
			if(vx!=null) {
				vx.onmessage=function(ex) {
					
					call1=logiksWorkers.workerList[key].callback;
					
					if(typeof call1=="function") call1(key,ex);
					else if(window[call1]!=null) window[call1](key,ex);
				}
				vx.onerror=function(ex) {
					
					call1=logiksWorkers.workerList[key].error;
					
					if(typeof call1=="function") call1(key,ex);
					else if(window[call1]!=null) window[call1](key,ex);
				}
				
				logiksWorkers.workerList[key]["instance"]=vx;
				logiksWorkers.workerList[key]["running"]=true;
			}

			return vx;
		}
		return null;
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