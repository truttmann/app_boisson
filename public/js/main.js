requirejs.config({


    deps: ['Modernizr', 'config/bootstrap'],

    paths: {
        "jquery": 'lib/jquery',
        "jqm-config": './jqm-config',
        "jquery-mobile": "lib/jquery.mobile-1.4.2",
        "underscore": "lib/underscore",
        "backbone": "lib/backbone",
        "backbone.controller": "lib/backbone.controller",
        "backbone.localStorage": "lib/backbone.localStorage-min",
        "backbone.syphon": "lib/backbone.syphon",
        "backbone.token": "lib/backbone.token",
        "backbone.deep-model": "lib/backbone.deep-model.min",
        "backbone.queryparams": "lib/backbone.queryparams",
        "backbone.route-filter": "lib/backbone-route-filter",
        "moment": "lib/moment.min",
        "Chance": "lib/chance.min",
        "Modernizr": "lib/modernizr",
        "text": "lib/text",
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.localStorage': {
            deps: ['backbone']
        },
        'backbone.syphon': {
            deps: ['backbone']
        },
        'backbone.controller': {
            deps: ['backbone']
        },
        "backbone.queryparams": {
            deps: ['backbone']
        },
        "jqm-config": ['jquery'],
        "jquery-mobile": {
            deps: ['jquery', 'jqm-config'],
        },
        'underscore': {
            exports: '_'
        },
    }
});

requirejs(["router/app", "jqm-config", "jquery-mobile", "jquery"], function(AppRouter, jqm_config, jqm, $) {
    app = new AppRouter();
    Backbone.history.start();
});