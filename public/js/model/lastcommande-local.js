define(["jquery", "underscore", "backbone", "backbone.localStorage"], function ($, _, Backbone, LocalStorage) {
    var LastcommandeLocalModel = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage("main-lastcommande"),
        initialize: function () {
            //_.bindAll(this, "onLoginSuccess", "onLoginFailure");
            uid = this.localStorage.records[0];
            if (!uid) {
                this.localStorage.create(this);
            } else {
                this.id = uid;
            }
        },
        defaults: {
        },
        addProduct: function(id, quantity) {
            var t = this.get("product");
            if(t == undefined || t == null) {
                t = new Array();
            }
            t.push({"id":id,"qt": quantity});
            
            this.set('product', t);
            this.save();
        }
    });
    return LastcommandeLocalModel;
});