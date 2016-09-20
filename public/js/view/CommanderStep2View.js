define(["jquery", "underscore", "backbone", "text!template/commander_step2.html"], function($, _, Backbone, commander_step2_tpl) {
    var CommanderStep2View = Backbone.View.extend({
        
        id: 'commander_step2-view',

        template: _.template(commander_step2_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.commande = options.commande;
            this.idCategorie = options.categorie_id;
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
                    chaine += '<li style="width: 40%;list-style: none" class="floatl ss_cat_com_prod_title">'+((cat.ss_cat != null)?cat.ss_cat.libelle:'')+'</li>';
                    chaine += '<li style="width: 18%;list-style: none" class="floatl ffmoreprobook dix_pt"><i>P.U.H.T</i></li>';
                    chaine += '<li style="width: 27%;list-style: none" class="floatl ffmoreprobook dix_pt"><i>S&eacute;l&eacute;ctionner</i></li>';
                    chaine += '<li style="width: 14%;list-style: none" class="floatl ">&nbsp;</li>';
                    chaine += '</ul>';
                    if(cat.ss_cat != null) { cat_id = cat.ss_cat.id; } else {cat_id = 0;}
                }
            
                if(cat.produit.length > 0) {
                    chaine+= '<ul class="comm_prod_list_product" >';
                    for (index2 in cat.produit) {
                        var prod = cat.produit[index2];
                        chaine+= '<li>';
                        chaine+= '    <div data-id="'+prod.id+'" data-price="'+prod.prix_base+'">';
                        chaine+= '        <div class="comm_prod_list_product_div1 ffmoreprbold dou_pt" style="width: 40%">'+prod.libelle+'</div>';
                        chaine+= '        <div class="comm_prod_list_product_div1 text-center ffmoreprobook dix_pt" style="width: 18%" id="prix_base">'+prod.prix_base+'</div>';
                        chaine+= '        <div class="comm_prod_list_product_div4 text-center" style="min-width: 40px; margin: auto;width: 27%">';
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
            
            this.recalculMontantTotalHt();
        },
        
        bindProductEvent: function() {
            var _this = this;
            $('.produit_moins').unbind('click').on('click', function(e){
                e.preventDefault();
                var v = parseInt($(this).parent().find('input').val());
                $(this).parent().find('input').val(((v > 0)?v-1:0));                
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
                var pr = $(this).parent().parent().attr("data-price");
                
                _this.commande.addProduct(id, qt, pr);
                
                _this.recalculMontantTotalHt();
            });
        },
        
        recalculMontantTotalHt: function() {
            var somme = 0;
            var t = this.commande.get('product');
            for (i in t){
                var q = t[i].qt;
                var p = t[i].price;
                somme += (((q > 0)?q:0) * ((p > 0)?p:0));
            }
            $('#motant_panier').empty().html("MON STOCK MONTANT H.T "+somme+" &euro;");
        },
        
        events: {
            /* TODO : changement de catégorie */
            "click .nav-right-a":"gotonextCategorie",
            "click .nav-left-a":"gotopreviousCategorie",
        },
        
        gotonextCategorie: function(e){
            e.preventDefault();
            this.loadingStart("Chargement en cours");
            var _this = this;
            var xhr = $.get(config.api_url + "/rest-categorie/"+_this.idCategorie, {"token": _this.user.get('token'), "action": "next"}, null, 'jsonp');
                xhr.done( function(data){
                    $('#error').empty();
                    if(data.data) {
                        Backbone.history.navigate("commanderStep2/"+data.data.id, true);
                    }
                });
                xhr.fail(function(data) {
                    $('#error').empty().html(data);
                });
        },
        
        gotopreviousCategorie: function(e){
            e.preventDefault();
            this.loadingStart("Chargement en cours");
            var _this = this;
            var xhr = $.get(config.api_url + "/rest-categorie/"+_this.idCategorie, {"token": _this.user.get('token'), "action": "previous"}, null, 'jsonp');
                xhr.done( function(data){
                    $('#error').empty();
                    if(data.data) {
                        Backbone.history.navigate("commanderStep2/"+data.data.id, true);
                    }
                });
                xhr.fail(function(data) {
                    $('#error').empty().html(data);
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
        
        onClickFilter: function(e){
            e.preventDefault();
            var el = e.target;
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
    return CommanderStep2View;
});