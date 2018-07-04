var appLang = "en-GB";
var lingData = {};

//Prototypes
Date.prototype.toYMD = function() {
	var year, month, day;
	year = String(this.getFullYear());
	month = String(this.getMonth() + 1);
	if (month.length == 1) {
			month = "0" + month;
	}
	day = String(this.getDate());
	if (day.length == 1) {
			day = "0" + day;
	}
	return year + "-" + month + "-" + day;
}
Date.prototype.toYMDH = function() {
	var year, month, day, hr, min, sec;
	year = String(this.getFullYear());
	month = String(this.getMonth() + 1);
	if (month.length == 1) {
			month = "0" + month;
	}
	day = String(this.getDate());
	if (day.length == 1) {
			day = "0" + day;
	}
	hr = String(this.getHours());
	if (hr.length == 1) {
			hr = "0" + hr;
	}
	min = String(this.getMinutes());
	if (min.length == 1) {
			min = "0" + min;
	}
	sec = String(this.getSeconds());
	if (sec.length == 1) {
			sec = "0" + sec;
	}
	
	return year + "-" + month + "-" + day + " " + hr + ":" + min + ":" + sec;
}
Array.prototype.inArray = function(value) {
	var i;
	for (i = 0; i < this.length; i++) {
		if (this[i] === value) {
			return true;
		}
	}
	return false;
};

String.prototype.startsWith = function(str) {
	return (this.match("^" + str) == str)
}
String.prototype.endsWith = function(str) {
	return (this.match(str + "$") == str);
}
String.prototype.capitalize =   function() {
	return  this.replace(/\w+/g,  function(a) {
		return  a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
	});
}
String.prototype.toTitle =   function() { 
	a = this.replace("_", " ");
	a = a.capitalize();
	return a;
}
String.prototype.ucwords =   function() { 
	return this.replace(/^([a-z])|\s+([a-z])/g, function($1) {
		return $1.toUpperCase();
	});
}
String.prototype.clean =   function() {
	return this.replace('&', 'and');
}
String.prototype.LTrim =   function() {
	var whitespace = new String(" \t\n\r");
	var s = new String(this);
	if (whitespace.indexOf(s.charAt(0)) != -1) // We have a string with leading blank(s)...
	{
		var j = 0,
			i = s.length;
		while (j < i && whitespace.indexOf(s.charAt(j)) != -1) // Iterate from the far left of string until we don't have any more whitespace...
			j++;
		s = s.substring(j, i); // Get the substring from the first non-whitespace character to the end of the string...
	}
	return s;
}
String.prototype.RTrim =   function() {
	var whitespace = new String(" \t\n\r");
	var s = new String(this);
	if (whitespace.indexOf(s.charAt(s.length - 1)) != -1) // We have a string with trailing blank(s)...
	{
		var i = s.length - 1; // Get length of string
		while (i >= 0 && whitespace.indexOf(s.charAt(i)) != -1) // Iterate from the far right of string until we don't have any more whitespace...
			i--;
		s = s.substring(0, i + 1); // Get the substring from the front of the string to where the last non-whitespace character is...
	}
	return s;
}
String.prototype.trim =   function() {
	return this.LTrim().RTrim();
}

function isArray(what) {
	return Object.prototype.toString.call(what) === '[object Array]';
}

function _ling(str) {
	if(str==null) return "";
	//if(appConfig.DEBUG) console.warn(str+"=>"+lingData[str]);//+" "+lingData[appLang][str]
	if (lingData[str] != null) {
		if ((typeof lingData[str]) == "string") {
			return lingData[str];
		} else if (lingData[str][appLang] != null) {
			return lingData[str][appLang];
		}
	} else if (lingData[appLang] != null) {
		if (lingData[appLang][str] != null) {
			return lingData[appLang][str];
		}
	}
	return str.replace(/_/g, " ");
}

function htmlContentReplacer(match, p1, p2, p3, offset, string) {
	//if(appConfig.DEBUG) console.warn(match);
	match = match.substr(1, match.length - 2);
	// p1 is nondigits, p2 digits, and p3 non-alphanumerics
	return _ling(match);
}

function isElementInViewport(el) {
	if (typeof jQuery === "function" && el instanceof jQuery) {
		el = el[0];
	}

	var rect = el.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
		rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	);
}

function throttle(fn, delay) {
	var timer = null;
	return function() {
		var context = this,
			args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function() {
			fn.apply(context, args);
		}, delay);
	};
}

function requirecss(urls) {
	if (typeof urls == "object") {
		$.each(urls, function(k, v) {
			requirecss(v);
		});
	} else {
		var link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = urls;
		document.getElementsByTagName("head")[0].appendChild(link);
	}
}

function callFuncName(funcName,params) {
	if (funcName != null) {
		if(typeof window[funcName] == "function") {
			return window[funcName](params);
		} else if(typeof funcName=="function") {
			return funcName(params);
		}
	}
	return null;
}