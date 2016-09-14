define(["jquery", "underscore", "backbone", "backbone.syphon", "text!template/creationcompte.html"], function($, _, Backbone, Syphon, creationcompte_tpl) {
    var CreationCompteView = Backbone.View.extend({
        
        template: _.template(creationcompte_tpl),
        
        id: 'creationcompte-view',

        initialize: function(options) {
            this.user = options.user;
            this.listenTo(this.user, 'user:asknew', function(model) {
                Backbone.history.navigate("login", true);
            });
        },

        loadingStart: function() {
            $.mobile.loading('show', {
                text: 'Tentative de connexion',
                textVisible: true,
                theme: 'b',
                html: ""
            });
        },

        loadingStop: function() {
            $.mobile.loading('hide');
        },

        saveDemandeUser: function(data) {
            this.listenToOnce(this.user, 'login:failure', function() {
                _.delay(this.loadingStop);
            });
            this.user.askNew(data);
        },

        onSubmit: function(e) {
            e.preventDefault();
            this.loadingStart();
            var data = Backbone.Syphon.serialize(this);
            this.saveDemandeUser(data);
            Backbone.history.navigate("login", true);
        },
        
        events: {
            "submit": "onSubmit",
            "click a#submitform": "submitform",
            "click a#cancel": "cancel",
        },
        
        submitform: function(e) {
            e.preventDefault();
            $('body form').submit();
        },
        
        cancel: function(e) {
            Backbone.history.navigate("login", true);
        },
        
        render: function(eventName) {
            $(this.el).html(this.template({}));
            $('body').removeClass("ui-panel-page-container-themed");
            $('body').removeClass("ui-panel-page-container-b");
            $('body').removeClass("ui-panel-page-container");
            return this;
        }
    });
    return CreationCompteView;
});