//Logic Helpers
Handlebars.registerHelper('ifneq', function(v1, v2, options) {
    if (v1 !== v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('ifeq', function(v1, v2, options) {
    str1 = v1.toLowerCase();
    str2 = v2.toLowerCase();
    str1 = str1.replace('\-\g', '');
    str1 = str1.replace('\ \g', '');
    str2 = str2.replace('\-\g', '');
    str2 = str2.replace('\ \g', '');
    if (str1 === str2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('ifgt', function(v1, min, options) {
    if (v1 > min) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

//Misc Helpers
Handlebars.registerHelper('hash', function(txt) {
    if (txt == null) txt = "";
    return md5(txt)
});

Handlebars.registerHelper('link', function(text, url) {
  text = Handlebars.Utils.escapeExpression(text);
  url  = Handlebars.Utils.escapeExpression(url);

  var result = '<a href="' + url + '">' + text + '</a>';

  return new Handlebars.SafeString(result);
});
Handlebars.registerHelper('ling', function(text) {
  if(text==null) return "";
  if(typeof _ling!="function") return text;
  return _ling(text);
});
Handlebars.registerHelper('uppercase', function(str) {
    if (str == null || str <= 0) return "";
    return str.toUpperCase();
});
Handlebars.registerHelper('uppercase', function(str) {
    if (str == null || str <= 0) return "";
    return str.toLowerCase();
});
Handlebars.registerHelper('toTitle', function(str) {
    if (str == null || str.length <= 0) return "";
    return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
});
Handlebars.registerHelper('currency', function(amount) {
    if (amount == null) return "0.00";
    amount = parseFloat(amount);
    return amount.toFixed(2);
});
Handlebars.registerHelper('currencyStr', function(amount) {
    if (amount == null || amount.length <= 0 || amount == 0) return "";
    if (exchangeRate == null) exchangeRate = 1;
    amount = parseFloat(amount);
    switch (exchangeCurrency) {
        case "INR":
            return "₹ " + (amount * exchangeRate).toFixed(2);
            break;
        case "GBP":
            return "£ " + (amount * exchangeRate).toFixed(2);
            break;
        case "EUR":
            return "€ " + (amount * exchangeRate).toFixed(2);
            break;
        case "USD":
            return "$ " + amount.toFixed(2);
            break;
    }
    return "$ " + amount.toFixed(2);
});
Handlebars.registerHelper('stringavatar', function(name) {
    if (name == null || typeof name != "string" || name.length <= 0) {
        return '<div class="imageBlock blueColor"><span>#</span></div>';
    }
    return '<div class="imageBlock blueColor"><span>' + name.trim().charAt(0) + '</span></div>';
});
Handlebars.registerHelper('avatar', function(txt) {
    return _service("avatar") + "&authorid=" + txt;
});
Handlebars.registerHelper('iconimg', function(iconPath) {
    if (iconPath == null) return "";
    //iconPath.indexOf("/")
    if (iconPath.substr(0, 2) == "fa" || iconPath.substr(0, 9) == "glyphicon") {
        return "<i class='" + iconPath + "' aria-hidden='true' ></i>";
    } else {
        return "<img src='" + iconPath + "'>";
    }
});

//Date Time Helpers
Handlebars.registerHelper('formatTime', function(dateStr) {
    if (dateStr == null || dateStr.length <= 0) return "";
    return moment(dateStr).format("HH:mm");
});
Handlebars.registerHelper('formatDate', function(dateStr) {
    if (dateStr == null || dateStr.length <= 0) return "";
    return moment(dateStr).format("DD/MM/YYYY");
});
Handlebars.registerHelper('humanDate', function(dateStr) {
    if (dateStr == null || dateStr.length <= 0) return "";
    return moment(dateStr).fromNow();
});
Handlebars.registerHelper('humanTime', function(time) {
    hrs = Math.floor(time / 60);
    min = time % 60;
    if (hrs <= 0) {
        return min + " min";
    }
    return hrs + " Hrs " + min + " min";
});
Handlebars.registerHelper('humanDateTime', function(dateStr) {
    return moment(dateStr).format("DD/MM/YYYY hh:mm A");
});
Handlebars.registerHelper('humanDateTimeStr', function(dt, type) {
    if (dt == null) return "";
    switch (type) {
        case "date":
            dt = dt.split("T");
            dt = dt[0];
            return moment(dt).format("DD/MM/YYYY");
            break;
        case "time":
            dt = dt.split("T");
            dt = dt[1];
            dt = dt.split("+");
            dt = dt[0];
            dt = dt.split("-");
            dt = dt[0];

            dt = new Date("01-01-2017 " + dt);
            dt = dt.getHours() + ":" + dt.getMinutes();
            break;
        case "zone":
            dt = dt.split("+");
            if (dt[1] == null) {
                dt = dt[0].split("-");
                dt = "-" + dt[dt.length - 1];
            } else {
                dt = "+" + dt[1];
            }
            break;
        default:
            dt = dt.split("+").join("<br>+");
    }
    return dt;
});
Handlebars.registerHelper('humanDuration', function(dt1, dt2) {
    dt1 = new Date(dt1);
    dt2 = new Date(dt2);
    diff = ((dt1 - dt2) / 1000) / 60;
    if (diff > 60) {
        hrs = Math.floor(diff / 60);
        min = diff % 60;
        return hrs + " Hrs " + min + " Mins";
    } else {
        return diff + " Mins";
    }
});

//Special HTML Helpers
Handlebars.registerHelper('tbody', function(dataRow) {
    if (dataRow == null) return "";

    html = [];
    $.each(dataRow, function(a, b) {
        trClz = "";
        if (html.length > 3) {
            trClz = "d-none";
        }
        if (Array.isArray(b)) {
            if (b[0] != null && typeof b[0] != 'object') {
                html.push("<tr class='" + trClz + "'><th>" + getPageTitle(a) + "</th><td class='contentCell'>" + b.join(", ") + "</td></tr>");
            }
        } else if (typeof b == "object") {

        } else {
            html.push("<tr class='" + trClz + "'><th>" + getPageTitle(a) + "</th><td class='contentCell'>" + b + "</td></tr>");
        }
    });
    return html.join("");
});
Handlebars.registerHelper('tagstr', function(tagsStr) {
    if (tagsStr == null || tagsStr.length <= 0 || typeof tagsStr != "string") return "";
    clz = "label-info";

    tagsStr = tagsStr.split(",");
    html = [];
    $.each(tagsStr, function(a, b) {
        html.push("<span class='label " + clz + " " + b.replace(/ /g, "_").replace(/'/g, "") + "'>" + b + "</span>");
    });

    return html.join("");
});
Handlebars.registerHelper('contentstr', function(contentStr) {
    if (contentStr == null || contentStr.length <= 0) return "";

    return contentStr.replace(/\\r/mg, ' ').replace(/\\n/mg, '<br>').replace(/  /mg, ' ');
});