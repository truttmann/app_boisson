define(["jquery", "underscore", "backbone", "backbone.localStorage", "model/question"], function($, _, Backbone, LocalStorage, QuestionModel) {
    var QuestionsCollection = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("questions"),
        model: QuestionModel,
        getFromAudit: function(id) {
            return new Backbone.Collection(this.where({
                'audit_id': id
            }));
        },
        getFromTheme: function(id) {
            return new Backbone.Collection(this.where({
                'theme_id': id
            }));
        },
    });
    return QuestionsCollection;
});