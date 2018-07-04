var storage = {
	
	dataSrc : null,

	initialize : function(srcName) {
		if(srcName==null) srcName="appdb";

		return;

		//prefixes of implementation that we want to test
		window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

		//prefixes of window.IDB objects
		window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
		window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

		if (!window.indexedDB) {
			showError("Your mobile doesn't support a stable version of IndexedDB. Application can store data locally.")
		}

		var request=request = window.indexedDB.open(srcName, 1);

		request.onerror = function(event) {
			console.error(event);
		};

		request.onsuccess = function(event) {
			storage.dataSrc = request.result;
		};

		request.onupgradeneeded = function(event) {
			storage.dataSrc = event.target.result;
		}
	},
	getData : function(key) {
		
	},
	setData : function(key,value) {

	},
	getDataset : function(gid,key) {

	},
	setDataset : function(gid,key,value) {

	},
	setDatasetAll : function(gid,value) {

	},
	removeDB :function(srcName) {

	}
};

