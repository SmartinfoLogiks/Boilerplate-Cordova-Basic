// This Object is used to run subprocess in main thread.

var logiksProcess={
	
	processList: {
		//5 mins
	},
	microList: {
		//2.5 min
	},
	nanoList: {
		//1 min
	},
	macroList: {
		//10 mins
	},
	
	initialize: function() {
		if(appConfig.DEBUG) console.log("Initializing Processlist");
	
		//Setup Normal Process List
		setInterval(function() {
            if(appConfig.DEBUG) console.log("Running Normal ProcessList @ " + new Date());

            $.each(logiksProcess.processList,function(key,funcObj) {
            	funcName=funcObj['funcName'];
                if(funcName != null && typeof funcName == "function") {
                    funcName(key);
                } else if(window[funcName]!=null && typeof window[funcName] == "function") {
                    window[funcName](key);
                }
                logiksProcess.processList[key]['lastCalled']=new Date();
                logiksProcess.processList[key]['callCount']++;
            });
        },getUserSettings("PROCESS_INTERVAL"));
		
		//Setup Micro Process List
		setInterval(function() {
            if(appConfig.DEBUG) console.log("Running Micro ProcessList @ " + new Date());

            $.each(logiksProcess.microList,function(key,funcObj) {
            	funcName=funcObj['funcName'];
                if(funcName != null && typeof funcName == "function") {
                    funcName(key);
                } else if(window[funcName]!=null && typeof window[funcName] == "function") {
                    window[funcName](key);
                }
                logiksProcess.microList[key]['lastCalled']=new Date();
                logiksProcess.microList[key]['callCount']++;
            });
        },getUserSettings("PROCESS_INTERVAL_MICRO"));
		
		//Setup Nano Process List
		setInterval(function() {
            if(appConfig.DEBUG) console.log("Running Nano ProcessList @ " + new Date());

            $.each(logiksProcess.nanoList,function(key,funcObj) {
            	funcName=funcObj['funcName'];
                if(funcName != null && typeof funcName == "function") {
                    funcName(key);
                } else if(window[funcName]!=null && typeof window[funcName] == "function") {
                    window[funcName](key);
                }
                logiksProcess.nanoList[key]['lastCalled']=new Date();
                logiksProcess.nanoList[key]['callCount']++;
            });
        },getUserSettings("PROCESS_INTERVAL_NANO"));
		
		//Setup Macro Process List
		setInterval(function() {
            if(appConfig.DEBUG) console.log("Running Macro ProcessList @ " + new Date());

            $.each(logiksProcess.macroList,function(key,funcObj) {
            	funcName=funcObj['funcName'];
                if(funcName != null && typeof funcName == "function") {
                    funcName(key);
                } else if(window[funcName]!=null && typeof window[funcName] == "function") {
                    window[funcName](key);
                }
                logiksProcess.macroList[key]['lastCalled']=new Date();
                logiksProcess.macroList[key]['callCount']++;
            });
        },getUserSettings("PROCESS_INTERVAL_MACRO"));
	},
	addFunc: function(key, funcName) {
		logiksProcess.processList[key]={
			"funcName":funcName,
			"lastCalled":false,
			"callCount":0
		};
	},
	addFuncMicro: function(key, funcName) {
		logiksProcess.microList[key]={
			"funcName":funcName,
			"lastCalled":false,
			"callCount":0
		};
	},
	addFuncNano: function(key, funcName) {
		logiksProcess.nanoList[key]={
			"funcName":funcName,
			"lastCalled":false,
			"callCount":0
		};
	},
	addFuncMacro: function(key, funcName) {
		logiksProcess.macroList[key]={
			"funcName":funcName,
			"lastCalled":false,
			"callCount":0
		};
	},
	removeFunc: function(key,type) {
		switch(type) {
			case "nano":
				if(logiksProcess.nanoList[key]!=null) {
					delete logiksProcess.nanoList[key];
				}
				break;
			case "micro":
				if(logiksProcess.microList[key]!=null) {
					delete logiksProcess.microList[key];
				}
				break;
			case "macro":
				if(logiksProcess.macroList[key]!=null) {
					delete logiksProcess.macroList[key];
				}
				break;
			case "normal":
			case "general":
			default:
				if(logiksProcess.processList[key]!=null) {
					delete logiksProcess.processList[key];
				}
				break;
		}
	},
	getList: function() {
		return {
			"macro":[logiksProcess.macroList,getUserSettings("PROCESS_INTERVAL_MACRO")],
			"default":[logiksProcess.processList,getUserSettings("PROCESS_INTERVAL")],
			"micro":[logiksProcess.microList,getUserSettings("PROCESS_INTERVAL_MICRO")],
			"nano":[logiksProcess.nanoList,getUserSettings("PROCESS_INTERVAL_NANO")],
		};
	}
};
