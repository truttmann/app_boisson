define(["jquery", "underscore", "backbone", "text!template/delete.html"], function($, _, Backbone, delete_tpl) {
    

    var DeleteView = Backbone.View.extend({
        template: _.template(delete_tpl),
        
        id: 'delete-view',

        initialize: function(options) {
            this.audits = options.audits;
            _.bindAll(this, 'render');
            this.audits.on('add', this.render);
            this.audits.on('destroy', this.render);
        },

        onDelete: function(event) {
            event.preventDefault();
            this.trigger('delete', {
                id: $(event.currentTarget).data('id')
            });
        },

        events: {
            'click #delete>li': 'onDelete',
        },

        render: function(eventName) {
            $(this.el).html(this.template({
                audits: this.audits.toJSON()
            }));
            $(this.el).trigger( "create" );
            return this;
        }
    });
    return DeleteView;
});