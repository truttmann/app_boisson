define(["jquery", "underscore", "backbone", "backbone.localStorage"], function ($, _, Backbone, LocalStorage) {
    var PointageLocalModel = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage("main-user"),
        initialize: function () {
            _.bindAll(this, "onPointageSuccess", "onPointageFailure");
            uid = this.localStorage.records[0];
            if (!uid) {
                this.localStorage.create(this);
            } else {
                this.id = uid;
            }
        },
        onPointageSuccess: function (data) {
            alert("Sauvegarde réussie");
            Backbone.history.navigate("logout", true);
        },
        onPointageFailure: function () {
            this.trigger('pointage:failure');
        },
        pointage: function (data, user) {
            var xhr = $.post(config.api_url + "/rest-pointage/"+user.get('login'), {"token": user.get('token'), "action": data}, null, 'jsonp');
            xhr.done(this.onPointageSuccess);
            xhr.fail(this.onPointageFailure);
        },
    });
    return PointageLocalModel;
});