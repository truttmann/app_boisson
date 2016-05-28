define(["jquery", "underscore", "backbone", "backbone.syphon", "text!template/checklists.html"], function($, _, Backbone, Syphon, checklists_tpl) {
   
    var ChecklistsView = Backbone.View.extend({
        
        template: _.template(checklists_tpl),

        id: 'checklists-view',

        initialize: function(options) {
            this.options = options;
            this.current_question = options.audit.findQuestionByQuestionId(options.question);
            if(typeof this.current_question != "undefined") {
                this.checklists = this.current_question.checklists;
                this.theme = this.current_question.theme_id;
            } else {
                this.checklists = null;
                this.theme = null;
            }

            this.audit_number = options.audit.id;
            this.question = options.question;
         },

        render: function() {

           	this.$el.empty();

            this.$el.append(this.template({
                checklists: this.checklists,
                audit_question_id : this.current_question.audit_question,
                audit_number : this.audit_number,
                question : this.question,
                theme : this.theme
            }));

            return this;
        }
    });
    return ChecklistsView;
});