define(["jquery", "underscore", "backbone", "text!template/stock_cat_produit.html"], function($, _, Backbone, stock_cat_produit_tpl) {
    var StockProduitView = Backbone.View.extend({
        
        id: 'stock-produit-view',

        template: _.template(stock_cat_produit_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.bind('render:completed', function() {
                var _this = this;
                var xhr = $.get(config.api_url + "/rest-member?p="+_this.user.get('token'), null, null, 'jsonp');
                xhr.done( function(data){
                    $('#error').empty();
                    _this.chargementMembre(data.data);                    
                });
                xhr.fail(function(data) {
                    $('#error').empty().html(data);
                });
            });
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
    return StockProduitView;
});