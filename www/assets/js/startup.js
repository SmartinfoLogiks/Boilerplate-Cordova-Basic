requirejs.config({
            baseUrl: 'assets/js',
            shim: {
                'libs/backbone': {
                    deps: ['libs/jquery','libs/underscore'],
                    exports: 'Backbone'
                },
                'libs/knockout': {
                    deps: ['libs/jquery','libs/bootstrap'],
                },
                'libs/bootstrap': {
                    deps: ['libs/jquery'],
                },
                'libs/jquery.ui': {
                    deps: ['libs/jquery'],
                },
                
                "libs/jquery.sparkline":{
                    deps: ['libs/jquery'],
                },
                "libs/jquery.validate":{
                    deps: ['libs/jquery'],
                },

                "libs/bootstrap.bootbox":{
                    deps: ['libs/bootstrap'],
                },
                "libs/bootstrap.contextmenu":{
                    deps: ['libs/bootstrap'],
                },
                "libs/bootstrap.datepicker":{
                    deps: ['libs/bootstrap'],
                },
                "libs/bootstrap.datetimepicker":{
                    deps: ['libs/bootstrap'],
                },
                "libs/bootstrap.multiselect":{
                    deps: ['libs/bootstrap'],
                },
                "libs/bootstrap.switch":{
                    deps: ['libs/bootstrap'],
                },
            },
            paths: {
                libs: '../../assets/js/libs',
                lang: '../../assets/lang',
                app: '../../app',
                appjs: '../../app/js',
            }
        });
        requirejs([
            'libs/jquery',
            'libs/bootstrap',
            'libs/jquery.ui',

            'libs/quo.standalone',

            'libs/jquery.validate',
            
//             'libs/underscore',
//             'libs/backbone',
        ], function(util1) {
//             require(["libs/knockout"], function (ko) {
//                 window.ko = ko;
//             });
//             require(["libs/pouchdb"],function(pdb) {
//                   window.PouchDB=pdb;
//             });
            require(["libs/moment"], function(obj) {
                window.moment = obj;
            });
            require([
                    'libs/base64',
                    'libs/md5',
                    'libs/bootstrap.switch',
                    // 'libs/filesaver',

                    'commons',
                    'logiks',
                    'logiks.storage',
                    'logiks.triggers',
                    'logiks.dialogs',
                    'logiks.remote',
                    'logiks.plugins',
                    'logiks.menu',
                    'logiks.ux',
                    'logiks.geolocation',
                    'logiks.process',
                    'logiks.workers',
                    'logiks.cmds',
                    'logiks.app',
                ],function(util2) {
//                     require(["libs/knockout"], function (ko) {
//                         window.ko = ko;
//                     });
                    require(["libs/handlebars"], function (ko) {
                        window.handleBars = ko;

                        require(["app.js"]);//'appjs/misc','app/app'
                    });
            });
        });
