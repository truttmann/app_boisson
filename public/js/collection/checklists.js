define(["jquery", "underscore", 'backbone', 'backbone.localStorage'], function($, _, Backbone) {

	var ChecklistCollection = Backbone.Collection.extend({
		localStorage : new Backbone.LocalStorage("checklist"),
		model: Backbone.Model,
	});
	
	return ChecklistCollection;
});