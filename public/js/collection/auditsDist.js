define(["jquery", "underscore", "backbone", "model/audit"], function($, _, Backbone, AuditModel) {
    
    

    var AuditsDistCollection = Backbone.Collection.extend({
         
     	model: AuditModel,

     	url: config.api_url + "/audit/",

        parse: function(response) {
            if (!response.error) {
                return response.data;
            }
        },


    });
    return AuditsDistCollection;
});