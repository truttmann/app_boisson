define(["jquery", "underscore", "backbone", "model/question"], function($, _, Backbone, QuestionModel) {
    var ThemeModel = Backbone.Model.extend({
        defaults: {},
        prevQuestion: function(question) {
            var questions = this.get('questions');
            var index = 0;
            var next = _.find(questions, function(q) {
                index++;
                return question.id === q.id;
            });
            return new QuestionModel(questions[index - 2]);
        },
        nextQuestion: function(question) {
            var questions = this.get('questions');
            var index = 0;
            var next = _.find(questions, function(q) {
                index++;
                return question.id === q.id;
            });
            return new QuestionModel(questions[index]);
        }
    });
    return ThemeModel;
});