var triggerEvents={
	eventList: {
			'onapppreload':[], 
			'onappload':[],
			'onfirstpage':[], 
			'onpageload':[],
			'onpagepreload':[],
			'ondeviceready':[],
			'ononline':[],
			'onofline':[],
			'ondevicemotion':[],
			'ondeviceorientation':[],
			'ondeviceorientationabsolute':[],
			'onunload':[],

			'onOnline':[],
			'onOffline':[],
	},
    initialize: function() {

    },
    addTrigger: function(eventName,func) {
        if(eventName==null || eventName.length<=0) return false;
        eventName=eventName.toLowerCase();

    	if(triggerEvents.eventList[eventName]==null) {
    		triggerEvents.eventList[eventName]=[];
    	}
    	triggerEvents.eventList[eventName].push(func);
    },
    runTriggers: function(eventName,params) {
        if(eventName==null || eventName.length<=0) return false;
        eventName=eventName.toLowerCase();

    	if(triggerEvents.eventList[eventName]==null) {
    		triggerEvents.eventList[eventName]=[];
    	}

    	$.each(triggerEvents.eventList[eventName],function(k,v) {
			if(typeof window[v]=="function") {
				window[v](params);
			} else if(typeof v=="function") {
                v(params);
            }
		});
    }
};

triggerEvents.initialize();