define(["jquery", "underscore", "backbone", "backbone.syphon", "text!template/creationcompte.html"], function($, _, Backbone, Syphon, creationcompte_tpl) {
    var CreationCompteView = Backbone.View.extend({
        
        template: _.template(creationcompte_tpl),
        
        id: 'creationcompte-view',

        initialize: function(options) {
            this.user = options.user;
            this.listenTo(this.user, 'user:endusercreated', function(model) {
                Backbone.history.navigate("monequipehc", true);
            });
            this.listenTo(this.user, 'user:endfailureusercreated', function(model) {
                //Backbone.history.navigate("monequipehc", true);
                loadingStop();
                Backbone.history.navigate("monequipehc", true);
            });
            this.bind('render:completed', function() {
                jQuery('form').validate({
                    rules: {
                        email: {
                            required: true,
                            email: true
                        }
                    }
                });
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
            if(data.email != data.email_conf) {
                $('form').validate().showErrors({
                    "email": "La valeur de votre email doit être identique à la confirmation d'email"
                });
                this.loadingStop();
                return; 
            }
            if(data.password != data.password_conf) {
                $('form').validate().showErrors({
                    "password": "La valeur de votre mot de passe doit être identique à la confirmation du mot de passe"
                });
                this.loadingStop();
                return; 
            }
            this.saveDemandeUser(data);
            /*Backbone.history.navigate("monequipehc", true);*/
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