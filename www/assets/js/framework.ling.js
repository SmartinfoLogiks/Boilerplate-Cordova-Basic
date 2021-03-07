const _LING = {
  LINGDATA: {},
  CURRENT_LANG: "en-gb",

  initialize: function (callback) {
    _LING.loadLang(_LING.CURRENT_LANG, callback);
  },

  loadLang: function(lang, callback) {
    $.getJSON("assets/lang/"+lang+".json", function (data) {
        _LING.LINGDATA = $.extend(_LING.LINGDATA, data);
      })
        .fail(function () {
          //console.log( "error" );
        })
        .always(function () {
          $.getJSON("app/lang/"+lang+".json", function (data) {
            _LING.LINGDATA = $.extend(_LING.LINGDATA, data);
          })
            .fail(function () {
              //console.log( "error" );
            })
            .always(function () {
              //console.log( "complete" );
              callback();
            });
        });
  },

  toLing: function(str) {
    if(str==null) return "";
    if(_LING.LINGDATA[str]!=null) return _LING.LINGDATA[str];
    else if(_LING.LINGDATA[str.toLowerCase()]!=null) return _LING.LINGDATA[str.toLowerCase()];
    else return str;
  }
};
