define(["jquery", "underscore", "backbone", "text!template/mon_equipe.html"], function($, _, Backbone, mon_equipe_tpl) {
    var MonEquipeView = Backbone.View.extend({
        
        id: 'mon_equipe_hc-view',

        template: _.template(mon_equipe_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.commande = options.commande;
            this.bind('render:completed', function() {
               $('a.ui-btn').removeClass('ui-btn');
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
            if($(el).parent().hasClass("comm_1_cat")) {
                Backbone.history.navigate("commanderProduit/"+$(el).parent().attr('data-id'), true);
            }
        },
        
        render: function(eventName) {
            
            /* TODO : verifier que l'utilisateur existe bien sinon redirection HOME */
            
            this.$el.empty();
            this.$el.append(this.template({
                user: this.user.toJSON()
            }));
            this.trigger('render:completed', this);
            //this.$el.find('.comm_1_cat').on('click', _.bind(this.onClickFilter, this));
            return this;
            
            
        }
    });
    return MonEquipeView;
});