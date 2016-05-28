define(["jquery", "underscore", "backbone", "backbone.controller", "collection/auditsDist", "text!template/sync.html"], function($, _, Backbone, Controller, AuditsDistCollection, sync_tpl) {
    

    var SyncController = Backbone.Controller.extend({
     
        initialize: function(options) {
            this.view = options.view;
            this.audits = this.view.audits;
            this.listenTo(this.view, 'pull', this.createAudit);
            this.listenTo(this.view, 'push', this.onPushAudit);
            this.listenTo(this.view, 'delete', this.onDeleteAudit);
        },
        
        loadingStart: function(text) {
            $.mobile.loading('show', {
                text: text,
                textVisible: true,
                theme: 'b',
                html: ""
            });
        },

        loadingStop: function() {
            $.mobile.loading('hide');
        },

        onPushAudit: function(options) {
            if (_.isUndefined(options.id)){
                return;
            }
            var self = this;
            var auditLocal = this.audits.get(options.id);
            var auditsDist = new AuditsDistCollection();
            auditsDist.add(auditLocal.toJSON());
            this.loadingStart("Synchronisation de l'audit sur le serveur...");
            auditsDist.get(options.id).save(null, {
                success : function(){
                    auditLocal.destroy();
                    self.loadingStop()
                }
            });
        },

        onDeleteAudit: function(options) {
            if (_.isUndefined(options.id)){
                return;
            }
            var self = this;
            var auditLocal = this.audits.get(options.id);
            auditLocal.destroy();
        },
  
        createAudit: function(options) {
            if (_.isUndefined(options.id)){
                return;
            }
            var auditsDist = new AuditsDistCollection([{ id : options.id }]);
            var self = this;
            this.loadingStart("Récupération de l'audit...");
            auditsDist.get(options.id).fetch({
                success: function() {
                   var auditLocal = self.audits.add(
                       auditsDist.get(options.id).toJSON()
                   );
                   auditLocal.save();
                   self.loadingStop();
                }
            });
        },
    });
    return SyncController;
});