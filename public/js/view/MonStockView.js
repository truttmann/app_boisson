define(["jquery", "underscore", "backbone", "text!template/mon_stock.html"], function($, _, Backbone, mon_stock_tpl) {
    var MonStockView = Backbone.View.extend({
        
        id: 'mon-stock-view',

        template: _.template(mon_stock_tpl),
        
        initialize: function(options) {
            this.user = options.user;
        },
        
        loadingStart: function(text_show) {
            $.mobile.loading('show', {
                text: text_show,
                textVisible: true,
                theme: 'b',
                html: ""
            });
        },

        loadingStop: function() {
            $.mobile.loading('hide');
        },
        
        render: function(eventName) {
            this.$el.empty();
            this.$el.append(this.template({
                user: this.user.toJSON()
            }));
            this.trigger('render:completed', this);
            return this;
        }
    });
    return MonStockView;
});