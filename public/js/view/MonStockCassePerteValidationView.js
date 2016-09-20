define(["jquery", "underscore", "backbone", "text!template/mon_stock_casse_perte_validation.html"], function($, _, Backbone, mon_stock_casse_perte_validation_tpl) {
    var MonStockCassePerteValidationView = Backbone.View.extend({
        
        id: 'casse-perte-produit-view',

        template: _.template(mon_stock_casse_perte_validation_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.message = options.message;
            this.stock = options.stock;
            
            this.listenTo(this, 'stockdestock:endsuccesstockupdated', function(model) {
                this.message.addMessage("Stock has been updated");
                Backbone.history.navigate("home", true);
            });
            this.listenTo(this, 'stockdestock:endfailurestockupdated', function(model) {
                alert("Error during saving, please try later");
                this.loadingStop();
            });
            this.bind('render:completed', function() {
                
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
        
        events: {
            "click a.motif": "valide_sortie"
        },
        
        valide_sortie: function(e) {
            e.preventDefault();
            var _this= this;
            var options = this.stock.getProduct();            
            
            options["motif"] = $(e.currentTarget).attr("data-motif");
            var xhr = $.ajax({
                url: config.api_url + "/rest-stock/"+_this.user.get('id'),
                type: 'PUT',
                data: options,
                dataType: "jsonp"
            });
            xhr.done(function (data) {
                _this.trigger('stockdestock:endsuccesstockupdated');
            });
            xhr.fail(function (data) {
                _this.trigger('stockdestock:endfailurestockupdated', data);
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
    return MonStockCassePerteValidationView;
});