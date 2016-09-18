define(["jquery", "underscore", "backbone", "text!template/mon_stock_add_validate.html"], function($, _, Backbone, mon_stock_add_validate_tpl) {
    var MonStockAddValidateView = Backbone.View.extend({
        
        id: 'mon_stock_add_validate-view',

        template: _.template(mon_stock_add_validate_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.lastcommande = options.lastcommande;
            this.message = options.message;
            
            this.listenTo(this.lastcommande, 'lastcommande:endsuccesstockupdated', function(model) {
                this.message.addMessage("Stock has been updated");
                Backbone.history.navigate("home", true);
            });
            this.listenTo(this.lastcommande, 'lastcommande:endfailurestockupdated', function(model) {
                alert("Error during saving, please try later");
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
            /* TODO : changement de catégorie */
            "click a.motif": "valide_livraison"
        },
        
        valide_livraison: function(e) {
            e.preventDefault();
            /* envoi des produits et quantité à ajouter au stock */
            this.lastcommande.saveNewStock(this.user.get('id'));
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
    return MonStockAddValidateView;
});