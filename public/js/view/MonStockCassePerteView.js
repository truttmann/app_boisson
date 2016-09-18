define(["jquery", "underscore", "backbone", "text!template/mon_stock_casse_perte.html"], function($, _, Backbone, mon_stock_casse_perte_tpl) {
    var MonStockCassePerteView = Backbone.View.extend({
        
        id: 'casse-perte-produit-view',

        template: _.template(mon_stock_casse_perte_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.message = options.message;
            this.stock = options.stock;
            
            /* initialisation du stock a null */
            this.stock.setProduct({});
            
            this.bind('render:completed', function() {
                this.loadingStart("Chargement en cours");
                var _this = this;
                var xhr = $.get(config.api_url + "/rest-stock/"+_this.user.get('id'), {token:_this.user.get('token')}, null, 'jsonp');
                xhr.done( function(data){
                    $('#error').empty();
                    _this.chargementProducts(data.data);                   
                });
                xhr.fail(function(data) {
                    $('#error').empty().html(data);
                });
            });
        },
        
        chargementProducts: function(data) {
            var chaine = "";                
            var somme = 0;   
            
            for (index2 in data) {
                var prod = data[index2];
                chaine+= '<tr data-id="'+prod.id+'" >';
                chaine+= '        <td class="comm_prod_list_product_div1 ffmoreprbold dou_pt" style="width: 40%">'+prod.libelle+'</td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" id="qtemax" style="width: 20%">'+((prod.quantite != null)?prod.quantite:0)+'</td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 20%" id="prix_base">'+prod.prix_base+'</td>';
                chaine+= '        <td class="comm_prod_list_product_div4 text-center" style="min-width: 40px; margin: auto;width: 20%">';
                chaine += '            <a href="#" class="produit_moins">-</a>';
                chaine += '            <input type="text" value="0" data-role="none" style="float: none;width: 30px;" readOnly/>';
                chaine += '            <a href="#" class="produit_plus">+</a>';
                chaine += '       </td>';
                chaine+= '</tr>';
                
                somme += (prod.prix_base * ((prod.quantite != null)?prod.quantite:0));
            }
            
            $('.comm_prod_content table tbody').empty().html(chaine);
            this.recalculMontantTotalHt();
            
            this.loadingStop();
            
            this.bindProductEvent();
        },
        
        bindProductEvent: function() {
            var _this = this;
            $('.produit_moins').unbind('click').on('click', function(e){
                e.preventDefault();
                var v = parseInt($(this).parent().find('input').val());
                $(this).parent().find('input').val(((v > 0)?v-1:0));      
                _this.recalculMontantTotalHt();
            });
            $('.produit_plus').unbind('click').on('click', function(e){
                e.preventDefault();
                var v = parseInt($(this).parent().find('input').val());
                var m = parseInt($(this).parent().parent().find('#qtemax').html());
                
                if(v+1 <= m) {
                    $(this).parent().find('input').val(v+1);
                    _this.recalculMontantTotalHt();
                }
            });
        },
        
        recalculMontantTotalHt: function() {
            var somme = 0;
            $('.comm_prod_content table tbody tr').each(function(){
                var q = $(this).find('input').val();
                var p = parseFloat($(this).find('#prix_base').html());
                somme += (((q > 0)?q:0) * ((p > 0)?p:0));
            });
            $('#somme_entree_ht').empty().html("SORTIE DE STOCK MONTANT H.T. "+somme+" &euro;");
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
            "click a.valid_sortie": "valide_sortie"
        },
        
        valide_sortie: function(e) {
            e.preventDefault();
            /* si pas de changement, nous validond la livraison */
            this.loadingStart("Chargement en cours");
            var _this = this;
            
            var options = {};
            options['product'] = [];
            $('.comm_prod_content table tbody tr').each(function(){
                var q = parseInt($(this).find('input').val());
                if(q > 0) {
                    options['product'].push({"id":$(this).attr('data-id'), "qt":-q});
                }
            });
            
            this.stock.setProduct(options);
            Backbone.history.navigate("monstockCassePerteValidate", true);
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
    return MonStockCassePerteView;
});