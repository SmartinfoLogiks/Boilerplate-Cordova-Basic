var pageParamHash="";
function loadPage(pageRef,pageParam) {
    pageParamHash=pageParam;
    pageRef=pageRef.toLowerCase();
    
    if(!checkLinkStatus(pageRef,true)) return false;
    
    if(appConfig.DEBUG) console.log("New Loader : "+pageRef+" : "+pageParam);

    if(pageRef=="logout" || pageRef=="#logout") {
        pageLogout();
        return true;
    }

    pageLoader();
    
    pageRef=pageRef.replace("#","").toLowerCase();
    $.get("app/pages/"+pageRef+".html",function(html) {
            //Internationalization Of HTML Content
            html=html.replace(/#[a-zA-Z0-9-_,.]+#/gi, htmlContentReplacer);
            /*
            $.each(lingData[appLang],function(k,v) {
                if(k==null || k.length<=0 || v.length<=0) return;
                regx=new RegExp("\\b"+k+"\\b","gi");
                html=html.replace(regx, v);
            });
            */

            $("#mainContainer").html(html);
        }).done(function() {

            }).fail(function() {
                loadPage(appConfig.PAGEERROR,pageParam);
            }).always(function() {
                loadMenus();
                loadUserinfoBar();
            });
    return true;
}


function loadMenus() {
    if($("#menuLoader").length<=0) return;
    $("#menuLoader").removeClass("ajaxloading").html("");
    // menus=window.localStorage.getItem("APPMENU");
    // if(menus==null) {
    //  menus=appConfig.MENU;
    //  window.localStorage.setItem("APPMENU",JSON.stringify(menus));
    // } else {
    //  menus=$.parseJSON(menus);
    // }
    menus=appConfig.MENU;
    $.each(menus,function(k,v) {
            //v1=k.replace("#","").toLowerCase();
            //v2=k.split("/")[0];
            //if((appConfig.AFTERLOGIN[v1]!=null || appConfig.AFTERLOGIN[v2]!=null) && !checkUser()) return;
            if(!checkLinkStatus(k)) return;

            if(typeof v=="object") {
                vx="";
                if(v.title!=null) {
                    vx+=_ling(v.title);
                }
                if(v.icon!=null) vx+=v.icon;
                if(v.clas!=null) $("#menuLoader").append("<a class='"+v.clas+"' href='"+k+"'>"+vx+"</a>");
                else $("#menuLoader").append("<a href='"+k+"'>"+vx+"</a>");
            } else {
                if(v=="---") {
                    $("#menuLoader").append("<div class='subgroup'>"+k+"</div>");
                } else {
                    v=_ling(v);
                    $("#menuLoader").append("<a href='"+k+"'>"+v+"</a>");
                }
            }
        });
    // if(!checkUser()) {
    //     $("#menuLoader").append("<a href='#settings-nologin'>Settings</a>");
    //     $("#menuLoader").append("<a href='#login'>Login</a>");
    //     $("#menuLoader").append("<a href='#register'>Signup</a>");
    // } else {
    //     $("#menuLoader").append("<a href='#logout'>Logout</a>");
    // }
    return menus;
}
function checkLinkStatus(pageRef,takeAction) {
    if(takeAction==null) takeAction=false;
    returnValue=true;
    returnAction="";
    if(appConfig.MENU[pageRef]!=null && (typeof appConfig.MENU[pageRef]=="object") && appConfig.MENU[pageRef]['rule']!=null) {
        switch(appConfig.MENU[pageRef]['rule']) {
            case "afterlogin":
                returnValue=checkUser();
                returnAction="#login";
            break;
            case "beforelogin":
                returnValue=!checkUser();
                returnAction=appConfig.PAGEHOME;
            break;
        }
    }
    if(takeAction && !returnValue && returnAction.length>0) {
        app.route(returnAction);
    }
    return returnValue;
}
function loadUserinfoBar() {
    $("#userProfile").hide();
    if(getUserID().length<=0) {
        return false;
    }
    userData=window.localStorage.getItem("USERKEY-DATA");
    if(userData==null || userData=="undefined") {
        refetchUserData();
    } else {
        userData=$.parseJSON(userData);
        $("#userProfile .thumbnail img").attr("src",userData.avatar+"&APIKEY=erty");
        $("#userProfile .infoData .title").html(userData.full_name);
        $("#userProfile .infoData .small").html(userData.state+", "+userData.country);
    }
    $("#userProfile").show();
}

//All UX Elements
function getLingSelector() {
    html="<div id='lingSelector' class='row' style='margin: 10px;'><div class='modal-content'>";
    html+="<div class='modal-header'><h4 class='modal-title'>Select Prefered Language</h4></div>";
    html+="<div class='modal-body'>";
    html+="<select class='form-control' name='language' id='language'>";
    $.each(appConfig.lang,function(k,v) {
            if(v==appLang) html+="<option value='"+k+"' selected>"+v+"</option>";
            else html+="<option value='"+k+"'>"+v+"</option>";
        });
    html+="</select>";
    html+="</div>";
    html+="<div class='modal-footer'>";
    html+="<button id='saveLingSettings' type='button' class='btn btn-primary'>Save</button>";
    html+="</div>";
    html+="</div></div>";

    $("body").delegate("#saveLingSettings","touch",function(e) {
            saveLingSettings($("#language").val());
        });
    return html;
}