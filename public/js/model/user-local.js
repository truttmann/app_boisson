define(["jquery", "underscore", "backbone", "backbone.localStorage"], function($, _, Backbone, LocalStorage) {
    var UserLocalModel = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage("main-user"),
        initialize: function() {
            _.bindAll(this, "onLoginSuccess", "onLoginFailure");
            uid = this.localStorage.records[0];
            if (!uid) {
                this.localStorage.create(this);
            } else {
                this.id = uid;
            }
            
        },

        defaults: {
            is_logged: false
        },
        
        onLoginSuccess: function(data) {
            if (data.error) {
                this.onLoginFailure(data);
            } else {
                this.set(_.pick(data.data, 'firstname', 'name', 'username', 'profil_id', 'created', 'company', 'access_token'));
                this.set('is_logged', true);
                this.set('external_id', data.data.id),
                this.save();
                this.trigger('user:logged', this);
            }
        },

        onLoginFailure: function(){
            this.trigger('login:failure');
        },

        login: function(options) {
            var xhr = $.post(config.api_url + "/login", _.pick(options, 'username', 'password'), null, 'json');
            xhr.done(this.onLoginSuccess);
            xhr.fail(this.onLoginFailure);
        },
        logout: function() {
            this.trigger('user:logout', this);
        }
    });
    return UserLocalModel;
});