define(["jquery", "underscore", "backbone", "backbone.localStorage", "model/audit"], function($, _, Backbone, LocalStorage, AuditModel) {
    
    
    var AuditsCollection = Backbone.Collection.extend({

        localStorage: new Backbone.LocalStorage("audits"),
        model: AuditModel,

        initialize: function(){
        	this.on("add", _.bind(this.formater, this));
        },

        formater: function(model){
        	_(model.get('themes')).map(function(item){
                _(item.children).map(function(leaf){
                    var filtered_questions = _(model.get('questions')).where({ theme_id : leaf.id });
                    leaf.questions = _(filtered_questions).pluck('audit_question');
                    return leaf;
                });
            });
        }
    });
    
    return AuditsCollection
});