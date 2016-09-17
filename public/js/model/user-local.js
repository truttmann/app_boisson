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
        login: function (options) {
            var xhr = $.get(config.api_url + "/rest-user/" + options.token, null, null, 'jsonp');
            xhr.done(this.onLoginSuccess);
            xhr.fail(this.onLoginFailure);
        },
        saveMember: function(options) {
            var self = this;
            var xhr = null;
            if(options["id"] && options["id"] != "") {
                xhr = $.ajax({
                    url: config.api_url + "/rest-member/"+options['id'],
                    type: 'PUT',
                    data: options,
                    dataType: "jsonp"
                });
            } else {
                xhr = $.ajax({
                    url: config.api_url + "/rest-member",
                    type: 'POST',
                    data: options,
                    dataType: "jsonp"
                });
            }
            xhr.done(function (data) {
                self.trigger('user:endsuccesmemberupdated');
            });
            xhr.fail(function (data) {
                self.trigger('user:endfailurememberupdated', data);
            });
        },
        update : function (options) {
            var self = this;
            var xhr = $.ajax({
                url: config.api_url + "/rest-user/"+options['id'],
                type: 'PUT',
                data: options,
                dataType: "jsonp"
            });
            xhr.done(function (data) {
                self.localStorage._clear();
                self.set(_.pick(data.data, 'id', 'firstname', 'name', 'email', 'societe', 'profil_id', 'token'));
                self.save();
                self.trigger('user:endsuccesuserupdated');
            });
            xhr.fail(function (data) {
                self.trigger('user:endfailureuserupdated', data);
            });
        },
        askNew : function (options) {
            var self = this;
            var xhr = $.post(config.api_url + "/rest-user", options, null, 'jsonp');
            xhr.done(function (data) {
                /*
                    this.localStorage._clear();
                    this.set(_.pick(data.data, 'id', 'firstname', 'name', 'email', 'societe', 'profil_id', 'token'));
                    this.set('is_logged', false);
                    this.set('external_id', data.data.id);
                    this.save();
                 */
                
                self.trigger('user:endusercreated', this);
            });
            xhr.fail(function (data) {
                $('#error').empty().html(data);
                self.trigger('user:endfailureusercreated');
            });
        },
        logout: function() {
            this.trigger('user:logout', this);
        }
    });
    return UserLocalModel;
});