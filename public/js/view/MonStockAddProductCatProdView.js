define(["jquery", "underscore", "backbone", "text!template/mon_stock_add_product_cat_prod.html"], function($, _, Backbone, mon_stock_add_product_cat_prod_tpl) {
    var MonStockAddProductCatProdView = Backbone.View.extend({
        
        id: 'mon_stock_add_product_cat_prod-view',

        template: _.template(mon_stock_add_product_cat_prod_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.idCategorie = options.idCategorie;
            this.lastcommande = options.lastcommande;
            
            this.bind('render:completed', function() {
                /* recuperation de la derniere commande */
                this.loadingStart("Chargement des informations");
                var _this = this;
                var xhr = $.get(config.api_url + "/rest-categorie/"+_this.idCategorie, {"token": _this.user.get('token')}, null, 'jsonp');
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
            $('.nav-center').empty().html(data.libelle);
            
            var cat_id = null;
            var chaine = "";
            
            for (index in data.list_produit) {
                var cat = data.list_produit[index];
                if(cat_id != null && cat.ss_cat != null && cat.ss_cat.id != cat_id){
                    chaine += '</div>';
                }
        
                if(cat_id == null || (cat.ss_cat != null && cat.ss_cat.id != cat_id)) {
                    chaine += '<div class="ss_cat_com_prod '+((cat.ss_cat == null)?'no_border':'')+'">';
                    chaine += '<ul class="clear">'; 
                    chaine += '<li style="width: 50%;list-style: none" class="floatl ss_cat_com_prod_title">'+((cat.ss_cat != null)?cat.ss_cat.libelle:'')+'</li>';
                    chaine += '<li style="width: 20%;list-style: none" class="floatl ffmoreprobook dix_pt"><i>P.U.H.T</i></li>';
                    chaine += '<li style="width: 15%;list-style: none" class="floatl ffmoreprobook dix_pt"><i>S&eacute;l&eacute;ctionner</i></li>';
                    chaine += '<li style="width: 14%;list-style: none" class="floatl ">&nbsp;</li>';
                    chaine += '</ul>';
                    if(cat.ss_cat != null) { cat_id = cat.ss_cat.id; } else {cat_id = 0;}
                }
            
                if(cat.produit.length > 0) {
                    chaine+= '<ul class="comm_prod_list_product">';
                    for (index2 in cat.produit) {
                        var prod = cat.produit[index2];
                        chaine+= '<li>';
                        chaine+= '    <div data-id="'+prod.id+'">';
                        chaine+= '        <div class="comm_prod_list_product_div1 ffmoreprbold dou_pt" style="width: 50%">'+prod.libelle+'</div>';
                        chaine+= '        <div class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 20%">'+prod.prix_base+'</div>';
                        chaine+= '        <div class="comm_prod_list_product_div4 text-center" style="min-width: 40px; margin: auto;width: 15%">';
                        chaine += '            <a href="#" class="produit_moins">-</a>';
                        chaine += '            <input type="text" value="1" data-role="none" style="float: none;width: 30px;"/>';
                        chaine += '            <a href="#" class="produit_plus">+</a>';
                        chaine += '       </div>';
                        chaine+= '        <div class="comm_prod_list_product_div6 text-center ffmorepromed huit_pt" style="width: 14%;"><input type="button" value="ajouter" class="addnewproductstock" data-role="none" style="padding: 3px;"/></div>';
                        chaine+= '        <div class="clear"></div>';
                        chaine+= '    </div>';
                        chaine+= '</li>';
                    }
                    chaine+= '</ul>';
                }
            }
        
            if(cat_id != null){
                chaine += '</div>';
            }
            
            $('.comm_2_content').empty().html(chaine);
            this.loadingStop();
            
            this.bindProductEvent();
        },
        
        bindProductEvent: function() {
            var _this = this;
            $('.produit_moins').unbind('click').on('click', function(e){
                e.preventDefault();
                var v = parseInt($(this).parent().find('input').val());
                $(this).parent().find('input').val(((v > 1)?v-1:1));                
            });
            $('.produit_plus').unbind('click').on('click', function(e){
                e.preventDefault();
                var v = parseInt($(this).parent().find('input').val());
                $(this).parent().find('input').val(v+1);                
            });
            $('.addnewproductstock').unbind('click').on('click', function(e){
                e.preventDefault();
                var qt = $(this).parent().parent().find("input").val();
                var id = $(this).parent().parent().attr("data-id");
                
                _this.lastcommande.addProduct(id, qt);
                Backbone.history.navigate("monstockAdd", true);
            });
        },
        
        events: {
            /* TODO : changement de catégorie */
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
    return MonStockAddProductCatProdView;
});