const _STORAGE = {
    cacheData: true,
    headerCache: null,

    //Binary Cache
	getBinaryCache: function(url, callBack) {
		if (callBack != null && typeof callBack == "function") {
			callBack(_STORAGE.getRemoteCache(url, ""));
		}
		return _STORAGE.getRemoteCache(url, "", "BINARY");
	},
	addBinaryCache: function(url, data) {
		return _STORAGE.addRemoteCache(url, "", data, "BINARY");
	},
	deleteBinnaryCache: function(url) {
		_STORAGE.deleteRemoteCache(url, "", data, "BINARY");
	},

	//Remote Cache
	getRemoteCacheID: function (url, q, prefix) {
		if (typeof q == "object") q = JSON.serialize(q);
		else if(q==null) q = "";

		if(prefix==null) prefix = "REMOTE";

		urlHash = prefix + "-" + md5(url + q);
		return urlHash;
	},
	isCached: function(url, q, prefix) {
		cacheID = _STORAGE.getRemoteCacheID(url, q, prefix);
		cacheData = window.localStorage.getItem(urlHash);
		
		if(cacheData!=null) return true;
		else return false;
	},
	getRemoteCache: function (url, q, prefix) {
		if(appConfig.DEBUG) console.debug("USING REMOTE CACHE", url, q);

		urlHash = _STORAGE.getRemoteCacheID(url, q, prefix);
		cacheData = window.localStorage.getItem(urlHash);

		if (cacheData == null) return false;
		else {
            if(cacheData.charAt(0)=="{") {
                try {
                    tempData = JSON.parse(cacheData);
                    cacheData = tempData;
                } catch(e) {}
            }
			return cacheData;
		}
	},
	addRemoteCache: function (url, q, data, prefix) {
		if (typeof q == "object") q = JSON.stringify(q);
		if (typeof data == "object") data = JSON.stringify(data);

		urlHash = _STORAGE.getRemoteCacheID(url, q, prefix);
		window.localStorage.setItem(urlHash, data);

		return data;
	},
	deleteRemoteCache: function (url, q, prefix) {
		urlHash = _STORAGE.getRemoteCacheID(url, q, prefix);
		window.localStorage.removeItem(urlHash);
	}
}