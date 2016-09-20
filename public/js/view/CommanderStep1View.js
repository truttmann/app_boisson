define(["jquery", "underscore", "backbone", "text!template/commander_step1.html"], function($, _, Backbone, commander_step1_tpl) {
    var CommanderStep1View = Backbone.View.extend({
        
        id: 'commander_step1-view',

        template: _.template(commander_step1_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            
            this.bind('render:completed', function() {
               $('a.ui-btn').removeClass('ui-btn');
            });
            
            this.bind('render:completed', function() {
                /* recuperation de la derniere commande */
                this.loadingStart("Chargement des informations");
                var _this = this;
                var xhr = $.get(config.api_url + "/rest-categorie", {"token": _this.user.get('token')}, null, 'jsonp');
                xhr.done( function(data){
                    $('#error').empty();
                    _this.chargementCategories(data.data);
                });
                xhr.fail(function(data) {
                    $('#error').empty().html(data);
                });
            });
        },
        
        chargementCategories: function(data) {
            var chaine = "";
            var index = 0;
            var passe = 0;
            
            for (cat in data) {
                if (index == 0) {
                    chaine += '<div class="ligne '+((passe != 0)?'bg_haut':'')+'">';
                    index = 0;                    
                }
                index += 1;
                chaine += '<div data-id="'+data[cat].id+'" class="comm_1_cat '+((index ==1)?'bg_droite':'')+'"><div>'+data[cat].libelle+'</div></div>';
                if (index == 2) {
                    chaine += '</div><div class="clear"></div> ';
                    index = 0;
                    passe += 1;
                }
            }
            if(index == 1) { 
                chaine += '<div class="comm_1_cat">&nbsp;</div>';
                chaine += '</div>';
            }
            chaine += '<div class="clear"></div>';
            
            $('.comm_1_content').empty().html(chaine);
            
            this.loadingStop();
        },
        
        events: {
            "click div.comm_1_cat": "goToPageListProduit",
        },
        
        goToPageListProduit: function(e){
            e.preventDefault();
            Backbone.history.navigate("commanderStep2/"+$(e.target).parent().attr('data-id'), true);
            
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
    return CommanderStep1View;
});