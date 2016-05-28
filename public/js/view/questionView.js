define(["jquery", "underscore", "backbone", "backbone.syphon", "text!template/question.html", "text!template/question_with_patch.html"], function($, _, Backbone, Syphon, question_tpl, question_with_patch) {
    var QuestionView = Backbone.View.extend({
        
        id: 'question-view',

        events: {
            'change #comment': "onCommentChange",
            'change #patchComment': "onPatchCommentChange",
            'click #defaultCommentBtn': 'onDefaultCommentSelected'
        },

        getTemplate: function() {
            return (_.isUndefined(this.patch)) ? _.template(question_tpl) : _.template(question_with_patch)
        },
        
        initialize: function(options) {
            this.options = options;
            this.audit = options.audit;
            this.patches = this.audit.get('patches');
            this.theme = options.theme;
            this.question = options.question;
            this.questions = options.questions;
            this.checklists = options.audit.get('checklists');
            this.filters = options.filters;
            this.once('render:completed', _.bind(this.onRenderCompleted, this));
            $(this.$el).on("swipeleft", _.bind(this.onSwipeLeft, this));
            $(this.$el).on("swiperight", _.bind(this.onSwipeRight, this));
        },

        onSwipeLeft: function() {
            var href = $("#next", this.$el).attr('href');
            if (href) {
                location.hash = href;
            }
        },

        onSwipeRight: function() {
            var href = $("#next", this.$el).attr('href');
            if (href) {
                location.hash = href;
            }
        },

        onRenderCompleted: function() {
            this.$el.find("#auditResponse input[type='radio']").on('change', _.bind(this.onRadioResponseChange, this));
            this.$el.find("#patchAuditorResponse input[type='radio']").on('change', _.bind(this.onRadioResponseChange, this));
            if (this.audit.get('state_id') >= 4) {
                this.$el.find("#auditResponse, #patchResponse").on('click', function(event) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                });
            }
        },

        onRadioResponseChange: function(event) {

            var response = $(event.currentTarget).val();
            var attr_name = $(event.currentTarget).attr('name');
            var pos = { index : false };
            if (attr_name == "patch[auditor_response]") {
                var patch = this.audit.findPatchByAuditQuestionId({
                    audit_question_id : this.question.audit_question
                }, pos);
                if (patch.auditor_response == response) {
                    response = "empty";
                    $(event.currentTarget).prop("checked", false).checkboxradio('refresh');
                }
                patch.auditor_response = response;
                this.audit.set('patches.' + pos.index, patch); 
            } else if (attr_name == "response") {

                var question = this.audit.findQuestionByAuditQuestion({
                    audit_question : this.question.audit_question
                }, pos);
                if (question.response == response) {
                    response = "empty";
                    $(event.currentTarget).prop("checked", false).checkboxradio('refresh');
                }
                question.response = response;
                this.audit.set('question.' + pos.index, question);
            }

            this.audit.save();
        },

        onCommentChange: function(event) {
            var data = Backbone.Syphon.serialize(this);
            var pos = { index : false};
            var question = this.audit.findQuestionByAuditQuestion({
                audit_question : this.question.audit_question
             }, pos);
            question.comment = data.comment;
            this.audit.save();
        },
        
        onPatchCommentChange: function(event) {
            var data = Backbone.Syphon.serialize(this);
            var pos = { index : false};
            var patch = this.audit.findPatchByAuditQuestionId({
                audit_question_id : this.question.audit_question
            }, pos);
            patch.comment = data.patch.comment;
            this.audit.set('patches.' + pos.index, patch);
            this.audit.save();
        },

        onDefaultCommentSelected: function(event) {
            $(this.el).find('#comment').val(this.question.get('default_comment'));
            $(this.el).find('#comment').trigger('change');
            event.preventDefault();
        },

        next: function() {
            var ids_questions = _(this.questions).pluck('audit_question');
            var index = _(ids_questions).indexOf(this.question.audit_question);
            return this.questions[index + 1];
        },

        prev: function() {
            var ids_questions = _(this.questions).pluck('audit_question');
            var index = _(ids_questions).indexOf(this.question.audit_question);
            return this.questions[index - 1];
        },

        render: function() {
            this.$el.empty();
            var checklist_ids = [];/*_(this.question.checklists).pluck('id');*/
            this.patch = _(this.patches).findWhere({
                audit_question_id: this.question.audit_question
            });
            this.template = this.getTemplate();
            this.$el.append(this.template({
                audit: this.audit.toJSON(),
                theme: this.theme,
                question: this.question,
                checklists: this.checklists,
                patch: this.patch,
                prev: this.prev(),
                next: this.next(),
            }));
            var mixin = _.extend(this.question, {
                patch : this.patch
            });
            Backbone.Syphon.deserialize(this, mixin);
            this.trigger('render:completed', this);
            return this;
        }
    });
    return QuestionView;
});