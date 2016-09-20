define(["jquery", "underscore", "backbone", "text!template/mon_stock_historique.html"], function($, _, Backbone, mon_stock_historique_tpl) {
    var MonStockHistoriqueView = Backbone.View.extend({
        
        id: 'mon_stock_historique-view',

        template: _.template(mon_stock_historique_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.lastcommande = options.lastcommande;
            this.message = options.message;
            
            this.bind('render:completed', function() {
                this.loadingStart("Chargement en cours");
                /* recuperation de la derniere commande */
                var _this = this;
                var xhr = $.get(config.api_url + "/rest-stock?a=historique", {token:_this.user.get('token')}, null, 'jsonp');
                xhr.done( function(data){
                    $('#error').empty();
                    _this.chargementHistorique(data.data);                    
                });
                xhr.fail(function(data) {
                    $('#error').empty().html(data);
                });
            });
        },
        
        chargementHistorique: function(data) {
            var chaine = "";                
            
            for (index2 in data) {
                var hist = data[index2];
                chaine+= '<tr data-id="'+hist.id+'" >';
                chaine+= '        <td class="comm_prod_list_product_div1 ffmoreprbold dou_pt" style="width: 15%"><a href="#">'+hist.motif+'</a></td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 30%">'+((hist.montantht != null)?hist.montantht:0)+'</td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 40%">'+hist.user+'</td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 15%">'+hist.created_at+'</td>';
                chaine+= '</tr>';
            }
            
            $('.comm_prod_content table tbody').empty().html(chaine);
            this.loadingStop();
            
            this.bindProductEvent();
        },
        
        bindProductEvent: function() {
            var _this = this;
            $('.comm_prod_content table tbody tr a').unbind('click').on('click', function(e){
                e.preventDefault();
                Backbone.history.navigate("monstockHistoriqueDetail/"+$(this).parents('tr').attr('data-id'), true);
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
    return MonStockHistoriqueView;
});