define(["jquery", "underscore", "backbone", "backbone.localStorage"], function ($, _, Backbone, LocalStorage) {
    var CommandeLocalModel = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage("main-categorie"),
        initialize: function () {
            this.categorieFirstLevel = new Array();
            /*_.bindAll(this, "onPointageSuccess", "onPointageFailure");
            uid = this.localStorage.records[0];
            if (!uid) {
                this.localStorage.create(this);
            } else {
                this.id = uid;
            }*/
        },
        onCategorieSuccess: function (data) {
            if((typeof data != "object" && data.substr(0,2) == 'ko') || (data.result.length == 0)){
                this.onCategorieFailure(data);
            } else {
                console.log(data);
                this.categorieFirstLevel = data.result;
            }
        },
        onCategorieFailure: function (data) {
            this.categorieFirstLevel = false;
            $('#error').empty().html(data);
            this.trigger('categorie:failure');
        },
        getCategorie: function (user) {
            var xhr = $.get(config.api_url + "/rest-categorie", {"token": user.get('token')}, null, 'jsonp');
            xhr.done(this.onCategorieSuccess);
            xhr.fail(this.onCategorieFailure);
        },
    });
    return CommandeLocalModel;
});