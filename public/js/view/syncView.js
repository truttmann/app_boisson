define(["jquery", "underscore", "backbone", "backbone.syphon", "collection/auditsDist", "text!template/sync.html",  "text!template/upload.html"], function($, _, Backbone, Syphon, AuditsDistCollection, sync_tpl, upload_tpl) {
    

    var SyncView = Backbone.View.extend({

        template: function(){
            if (this.mode == "push"){
                return _.template(upload_tpl);
            }
            return _.template(sync_tpl);
        },
            
        tabActive: 0,
       
        id: 'sync-view',

        initialize: function(options) {
            this.audits = options.audits;
            this.mode = options.mode;
            this.audits_unsync = new AuditsDistCollection();
            this.audits_unsync.fetch({
                url: config.api_url + "/audits",
                async: false
            });
            _.bindAll(this, 'render');
            this.audits.on('add', this.render);
            this.audits.on('destroy', this.render);
        },

        onPush: function(event) {
            event.preventDefault();
            this.trigger('push', {
                id: $(event.currentTarget).data('id')
            });
           
        },

        onPull: function(event) {
            event.preventDefault();
            this.trigger('pull', {
                id: $(event.currentTarget).data('id')
            });
        },

        events: {
            'click #syncPull>li': 'onPull',
            'click #syncPush>li': 'onPush',
            'click .ui-navbar': "selectedTab",
        },

        render: function(eventName) {
            var tpl = this.template();
            $(this.el).html(tpl({
                audits: this.audits.toJSON(),
                audits_unsync: this.audits_unsync.toJSON()
            }));
            $(this.el).trigger( "create" );
            return this;
        }
    });
    return SyncView;
});