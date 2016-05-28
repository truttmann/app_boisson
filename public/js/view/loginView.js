define(["jquery", "underscore", "backbone", "backbone.syphon", "text!template/login.html"], function($, _, Backbone, Syphon, login_tpl) {
    var LoginView = Backbone.View.extend({
        
        template: _.template(login_tpl),
        
        id: 'login-view',

        initialize: function(options) {
            this.user = options.user;
            this.listenTo(this.user, 'user:logged', function(model) {
                model.save();
                Backbone.history.navigate("home", true);
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

        getUser: function(data) {
            this.listenToOnce(this.user, 'login:failure', function() {
                _.delay(this.loadingStop);
            });
            this.user.login(data);
        },

        onSubmit: function(e) {
            e.preventDefault();
            this.loadingStart();
            var data = Backbone.Syphon.serialize(this);
            this.getUser(data);
        },
        
        events: {
            "submit": "onSubmit"
        },
        
        render: function(eventName) {
            $(this.el).html(this.template({}));
            $('body').removeClass("ui-panel-page-container-themed");
            $('body').removeClass("ui-panel-page-container-b");
            $('body').removeClass("ui-panel-page-container");
            return this;
        }
    });
    return LoginView;
});