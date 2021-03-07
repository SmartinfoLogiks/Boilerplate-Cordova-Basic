var appLang = "en-GB";
var lingData = {};

//JQUERY Additional Functions
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

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

Array.prototype.diff = function(a) {
    return this.filter(function(i) { return a.indexOf(i) < 0; });
};
String.prototype.startsWith = function(str) {
    return (this.match("^" + str) == str)
}
String.prototype.endsWith = function(str) {
    return (this.match(str + "$") == str);
}
String.prototype.capitalize =   function() {
    if(this==null || typeof this != "string") return "";
    return  this.replace(/\w+/g,  function(a) {
        return  a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
    });
}
String.prototype.toTitle =   function() { 
    if(this==null || typeof this != "string") return "";
    a = this.replace("_", " ");
    a = a.capitalize();
    return a;
}
String.prototype.ucwords =   function() { 
    if(this==null || typeof this != "string") return "";
    return this.replace(/^([a-z])|\s+([a-z])/g, function($1) {
        return $1.toUpperCase();
    });
}
String.prototype.clean =   function() {
    if(this==null || typeof this != "string") return "";
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
    if (str == null) return "";
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

//Flips JSON Objects
function flip(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
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

function human_filesize($size, $precision = 2) {
    for ($i = 0;
        ($size / 1024) > 0.9; $i++, $size /= 1024) {}
    return Math.round($size, $precision) + " " + ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][$i];
}

function callFuncName(funcName, params) {
    if (funcName != null) {
        if (typeof window[funcName] == "function") {
            return window[funcName](params);
        } else if (typeof funcName == "function") {
            return funcName(params);
        }
    }
    return null;
}

function localStorageSize() {
    var allStrings = '';
    for (var key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
            allStrings += window.localStorage[key];
        }
    }
    return allStrings ? Math.ceil(3 + ((allStrings.length * 16) / (8 * 1024))) + ' KB' : 'Empty (0 KB)';
}
function getMarketLink() {
    if (window['device'] != null) {
        switch (device.platform.toLowerCase()) {
            case "android":
                lx = "market://details?id=" + appConfig.MARKETS.ANDROID;
                return lx;
                break;
            case "ios":
                //lx="https://itunes.apple.com/app/id"+appConfig.MARKETS.IOS;
                lx = "itms-apps://itunes.com/apps/id" + appConfig.MARKETS.IOS;
                return lx;
                break;
            case "wince":
                lx = "ms-windows-store:PDP?PFN=" + appConfig.MARKETS.WINDOWS;
                return lx;
                break;
            case "blackberry":
                lx = "appworld://content/" + appConfig.MARKETS.BLACKBERRY + "/";
                return lx;
                break;
        }
    }
    return "";
}
function flattenTree(data) {
    fData = {};
    $.each(data, function(a1, bObj) {
        $.each(bObj, function(a2, row) {
            fData[a2] = row;
        });
    });

    return fData;
}
function getUserToken() {
	authToken = localStorage.getItem("AUTH_TOKEN");
	if(authToken==null) return "";
	return authToken;
}
