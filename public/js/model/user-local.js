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
            if(typeof data != "object" && data.substr(0,2) == 'ko'){
                this.onLoginFailure(data);
            } else {
                this.localStorage._clear();
                this.set(_.pick(data.data, 'id', 'firstname', 'name', 'email', 'societe', 'profil_id', 'token'));
                this.set('is_logged', true);
                this.set('external_id', data.data.id);
                this.save();
                this.trigger('user:logged', this);
            }
        },
        onLoginFailure: function (data) {
            $('#error').empty().html(data);
            this.trigger('login:failure');
        },
        onAskNewSuccess: function (data) {
              this.trigger('user:asknew', this);
        },
        onAskNewFailure: function (data) {
            $('#error').empty().html(data);
            this.trigger('login:failure');
        },
        login: function (options) {
            var xhr = $.get(config.api_url + "/rest-login/" + options.token, null, null, 'jsonp');
            xhr.done(this.onLoginSuccess);
            xhr.fail(this.onLoginFailure);
        },
        askNew : function (options) {
            var xhr = $.post(config.api_url + "/rest-login", options, null, 'jsonp');
            xhr.done(this.onAskNewSuccess);
            xhr.fail(this.onAskNewFailure);
        },
        logout: function() {
            this.trigger('user:logout', this);
        }
    });
    return UserLocalModel;
});