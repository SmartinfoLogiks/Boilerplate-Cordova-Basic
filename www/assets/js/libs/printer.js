//Print Options
//cordova plugin add cordova-plugin-printer
function printResults(printData, opts) {
	opts = $.extend({
		duplex: 'long'
	}, opts);
	cordova.plugins.printer.print(printData, opts, function(res) {
		lgksToast(res ? 'Printing Done' : 'Printing Canceled');
	});
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