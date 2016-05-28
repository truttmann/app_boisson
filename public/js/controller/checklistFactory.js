define(["backbone", "backbone.controller", "collection/checklists"], function(Backbone, Controller, ChecklistCollection) {
   
    var ChecklistFactory = Backbone.Controller.extend({
        
        collection: new ChecklistCollection(),

        _createOnCollection: function(result){
        	if (result.error === false){
        		this.collection.create(_(result.data).omit('id'));
        	}
        },

       /* _syncChecklist: function(data){
        	if (!this.collection.get(data.checklist_id)){
        		var cbCreator = _.bind(this._createOnCollection, this);
        		$.getJSON(config.api_url + "/checklist/" + data.checklist_id, cbCreator);
        	}
        }, */

        create: function(modelSrc){
            var questions = modelSrc.get('questions');
           /* var questions_checklists = _.chain(questions).map(function(question){
            	if (!_.isEmpty(question.checklists)){
            		return _(question.checklists).map(function(checklist){
            			return { question_id : question.id, checklist_id : checklist.id, number : checklist.number };
            		});
            	}
            }).compact().flatten().value(); */
           /* _(questions_checklists).each(_.bind(this._syncChecklist, this));	*/
        }
    });

 	return ChecklistFactory;
});