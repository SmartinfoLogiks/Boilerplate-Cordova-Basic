//Sharing & Print Options

function printResults(printData, opts) {
	opts = $.extend({
		duplex: 'long'
	}, opts);
	cordova.plugins.printer.print(printData, opts, function(res) {
		lgksToast(res ? 'Printing Done' : 'Printing Canceled');
	});
}

function shareResults(exportData, fileOrFileArray, url) {
	window.plugins.socialsharing.share(exportData, appConfig.APPTITLE, fileOrFileArray, url, function(a) {
		//console.log(a);
	}, function(err) {
		console.error(err);
	});
}


//For HTML DOM UI
function shareTable(divBody) {
	eData = [];
	$("table tr:not(.noprint)",divBody).each(function(a, tr) {
			if ($($(tr).find("td")[0]).text().length > 0) eData.push($($(tr).find("td")[0]).text() + "=" + $($(tr).find("td")[1]).text());
		});
	exportData = eData.join("\n");
	
	shareMe(exportData, appConfig.APPTITLE, null, null, function(a) {
			//console.log(a);
		}, function(err) {
			console.error(err);
		});
}
function shareTableAsImage(divBody,withoutBody) {
  eData = [];
	$("table tr:not(.noprint)",divBody).each(function(a, tr) {
			if ($($(tr).find("td")[0]).text().length > 0) eData.push($($(tr).find("td")[0]).text() + "=" + $($(tr).find("td")[1]).text());
		});
  
  var x = 20;
  var y = 70;
  var lineheight = 18;

  $("body").find(".shareCanvas").detach();

  $("body").append("<div class='hidden shareCanvas'><canvas id='shareCanvas' width=500px height="+(lineheight*(eData.length+2)+50)+"px></canvas></div>");

  var shareCanvas = document.getElementById("shareCanvas");
  var ctx = shareCanvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0,0,shareCanvas.width,shareCanvas.height);

  ctx.fillStyle = "black";
  ctx.font = '12px Arial';

  for (var i = 0; i<eData.length; i++) {
    ctx.fillText(eData[i], x, y + (i*lineheight) );
  }

  ctx.textAlign = "center";
  ctx.font = '20px Arial';
  ctx.fillText(appConfig.APPTITLE,shareCanvas.width/3,30);
  
  if(withoutBody) {
    shareMe("", appConfig.APPTITLE, shareCanvas.toDataURL(), null, function(a) {
          //console.log(a);
        }, function(err) {
          console.error(err);
        });
  } else {
    shareMe(eData.join("\n"), appConfig.APPTITLE, shareCanvas.toDataURL(), null, function(a) {
          //console.log(a);
        }, function(err) {
          console.error(err);
        });
  }
}
  
function printTable(divBody) {
//   cordova.plugins.printer.check(function (available, count) {
// 						//alert(available ? 'Found ' + count + ' services' : 'No');
// 				});
  qHTML = ["<div style='width:100%'><h1 class='text-center'>"+appConfig.APPTITLE+"</h1><hr><table class='table table-stripped' style='width:100%'>"];

  $("table",divBody).each(function() {
    qHTML.push($(this).html());
  });

  qHTML.push("</table></div>");
  qHTML.push("<style>img{display:none;}.testiconBox{text-align:center;}.print{display:block;}tr.print{display:table-row;}.noprint{display:none;}.text-right{text-align:right;}.text-center{text-align:center;}</style>");

  cordova.plugins.printer.print(qHTML.join(""), {
          duplex: 'long'
        }, function(res) {
          lgksAlert(res ? 'Printing Done' : 'Printing Canceled');
        });
}