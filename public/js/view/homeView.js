define(["jquery", "underscore", "backbone", "text!template/home.html"], function($, _, Backbone, home_tpl) {
    var HomeView = Backbone.View.extend({
        
        id: 'home-view',

        template: _.template(home_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.pointeuse = options.pointeuse;
            this.listenToOnce(this.user, 'pointage:failure', function() {
                _.delay(this.loadingStop);
                alert('Erreur de sauvegarde, Veuillez vous déconnecter et recommencer');
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
            if($(el).attr("name") == "entree") {
                this.loadingStart("Sauvegarde de votre pointage ...");
                this.pointeuse.pointage("entree", this.user);
            } else if($(el).attr("name") == "sortie") {
                this.pointeuse.pointage("sortie", this.user);
            }
        },
        
        render: function(eventName) {
            this.$el.empty();
            this.$el.append(this.template({
                user: this.user.toJSON()
            }));
            this.trigger('render:completed', this);
            this.$el.find('#entree, #sortie').on('click', _.bind(this.onClickFilter, this));
            return this;
        }
    });
    return HomeView;
});