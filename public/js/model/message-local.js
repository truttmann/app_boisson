define(["jquery", "underscore", "backbone", "backbone.localStorage"], function ($, _, Backbone, LocalStorage) {
    var MessageLocalModel = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage("main-message"),
        initialize: function () {
            uid = this.localStorage.records[0];
            if (!uid) {
                this.localStorage.create(this);
            } else {
                this.id = uid;
            }
        },
        defaults: {
            message: ""
        },
        addMessage: function (mess) {
            this.set('message', (this.get('message')+mess));
            this.save();
        },
        getMessage: function() {
            var mess  = this.get('message');
            this.set('message', "");
            this.save();
            return mess;
        }
    });
    return MessageLocalModel;
});