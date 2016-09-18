define(["jquery", "underscore", "backbone", "text!template/mon_stock_add.html"], function($, _, Backbone, mon_stock_add_tpl) {
    var MonStockAddView = Backbone.View.extend({
        
        id: 'mon_stock_add-view',

        template: _.template(mon_stock_add_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.lastcommande = options.lastcommande;
            this.message = options.message;
            
            this.bind('render:completed', function() {
                this.loadingStart("Chargement en cours");
                if(this.lastcommande.get("product") != undefined && this.lastcommande.get("product") != null){
                    var _this = this;
                    var t = "";
                    var o = {};
                    var g = this.lastcommande.get("product");
                    for(e=0; e < g.length; e++) {
                        t+= ((t != "")?"-":"")+g[e].id;
                        o[g[e].id] = g[e].qt
                    }
                    var xhr = $.get(config.api_url + "/rest-produit?l="+t, {token:_this.user.get('token')}, null, 'jsonp');
                    xhr.done( function(data){
                        $('#error').empty();
                        for(i in data.data) {
                            if(o[data.data[i].id]) {
                                data.data[i].qt = o[data.data[i].id];
                            } else {
                                data.data[i].qt = 0;
                            }
                        }
                        _this.chargementProducts(data.data);                   
                    });
                    xhr.fail(function(data) {
                        $('#error').empty().html(data);
                    });
                } else {                
                    /* recuperation de la derniere commande */
                    var _this = this;
                    var xhr = $.get(config.api_url + "/rest-commande?p="+_this.user.get('token'), {token:_this.user.get('token')}, null, 'jsonp');
                    xhr.done( function(data){
                        $('#error').empty();
                        _this.chargementProducts(data.data);                    
                    });
                    xhr.fail(function(data) {
                        $('#error').empty().html(data);
                    });
                }
            });
        },
        
        chargementProducts: function(data) {
            var chaine = "";                
            var somme = 0;   
            
            for (index2 in data) {
                var prod = data[index2];
                chaine+= '<tr data-id="'+prod.id+'" >';
                chaine+= '        <td class="comm_prod_list_product_div1 ffmoreprbold dou_pt" style="width: 40%">'+prod.libelle+'</td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 20%">'+((prod.quantite != null)?prod.quantite:0)+'</td>';
                chaine+= '        <td class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 20%" id="prix_base">'+prod.prix_base+'</td>';
                chaine+= '        <td class="comm_prod_list_product_div4 text-center" style="min-width: 40px; margin: auto;width: 20%">';
                chaine += '            <a href="#" class="produit_moins">-</a>';
                chaine += '            <input type="text" value="'+prod.qt+'" data-role="none" style="float: none;width: 30px;"/>';
                chaine += '            <a href="#" class="produit_plus">+</a>';
                chaine += '       </td>';
                chaine+= '</tr>';
                
                somme += (prod.prix_base * ((prod.qt != null)?prod.qt:0));
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
                _this.lastcommande.changeData();
                var v = parseInt($(this).parent().find('input').val());
                $(this).parent().find('input').val(((v > 1)?v-1:1));      
                _this.recalculMontantTotalHt();
            });
            $('.produit_plus').unbind('click').on('click', function(e){
                e.preventDefault();
                _this.lastcommande.changeData();
                var v = parseInt($(this).parent().find('input').val());
                $(this).parent().find('input').val(v+1);
                _this.recalculMontantTotalHt();
            });
        },
        
        recalculMontantTotalHt: function() {
            var somme = 0;
            $('.comm_prod_content table tbody tr').each(function(){
                var q = $(this).find('input').val();
                var p = parseFloat($(this).find('#prix_base').html());
                somme += (((q > 0)?q:0) * ((p > 0)?p:0));
            });
            $('#somme_entree_ht').empty().html("ENTREE DE STOCK MONTANT H.T. "+somme+" &euro;");
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
            "click a.valid_entree": "valide_livraison"
        },
        
        valide_livraison: function(e) {
            e.preventDefault();
            /* si pas de changement, nous validond la livraison */
            if(this.lastcommande.get('changeProduct') == false) {
                
            } else {
                /* sinon nous passons d'abord à l'étape des motifs */
                Backbone.history.navigate("monstockAddValidate", true);
            }
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
    return MonStockAddView;
});