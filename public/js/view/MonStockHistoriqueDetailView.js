define(["jquery", "underscore", "backbone", "text!template/mon_stock_historique_detail.html"], function($, _, Backbone, mon_stock_historique_detail_tpl) {
    var MonStockHistoriqueDetailView = Backbone.View.extend({
        
        id: 'mon_stock_historique_detail-view',

        template: _.template(mon_stock_historique_detail_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.lastcommande = options.lastcommande;
            this.message = options.message;
            this.historique_id = options.id;
            
            this.bind('render:completed', function() {
                this.loadingStart("Chargement en cours");
                /* recuperation de la derniere commande */
                var _this = this;
                var xhr = $.get(config.api_url + "/rest-stock?a=historique", {id:_this.user.get('id'), "idH": this.historique_id}, null, 'jsonp');
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
            var somme = parseInt(0);
            var sommeT = parseInt(0);
            for (index2 in data) {
                var hist = data[index2];
                chaine+= '<tr>';
                chaine+= '        <td class="comm_prod_list_product_div1 ffmoreprbold dou_pt" style="width: 15%"><a href="#">'+hist.produit+'</a></td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 30%">'+hist.quantite+'</td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 40%">'+hist.prix_base+'</td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 15%">'+hist.total+'</td>';
                chaine+= '</tr>';
                
                somme += parseInt(hist.quantite);
                sommeT += parseInt(hist.total);
            }
            
            chaine+= '<tr>';
                chaine+= '        <td class="comm_prod_list_product_div1 ffmoreprbold dou_pt" style="width: 15%"><a href="#">TOTAL</a></td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 30%">'+somme+'</td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 40%">-</td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 15%">'+sommeT+'</td>';
                chaine+= '</tr>';
            
            $('.comm_prod_content table tbody').empty().html(chaine);
            this.loadingStop();
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
    return MonStockHistoriqueDetailView;
});