define(["jquery", "underscore", "backbone", "backbone.localStorage"], function ($, _, Backbone, LocalStorage) {
    var UserLocalModel = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage("main-user"),
        initialize: function () {
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
        onLoginSuccess: function (data) {
            if(data.substr(0,2) == 'ko'){
                this.onLoginFailure(data);
            } else {
                this.set(_.pick(data.data, 'id', 'firstname', 'name', 'login', 'token'));
                this.set('is_logged', true);
                this.set('external_id', data.id),
                        this.save();
                this.trigger('user:logged', this);
            }
        },
        onLoginFailure: function (data) {
            $('#error').empty().html(data);
            this.trigger('login:failure');
        },
        login: function (options) {
            var xhr = $.get(config.api_url + "/rest-login/" + options.login, null, null, 'jsonp');
            xhr.done(this.onLoginSuccess);
            xhr.fail(this.onLoginFailure);
        },
        logout: function() {
            this.trigger('user:logout', this);
        }
    });
    return UserLocalModel;
});