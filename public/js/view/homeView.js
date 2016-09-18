define(["jquery", "underscore", "backbone", "text!template/home.html"], function($, _, Backbone, home_tpl) {
    var HomeView = Backbone.View.extend({
        
        id: 'home-view',

        template: _.template(home_tpl),
        
        initialize: function(options) {
            _.bindAll(this, 'render');             
            this.user = options.user;
            this.message = options.message;
            this.listenToOnce(this.user, 'pointage:failure', function() {
                _.delay(this.loadingStop);
                alert('Erreur de sauvegarde, Veuillez vous déconnecter et recommencer');
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

        loadingStop: function() {
            $.mobile.loading('hide');
        },
        
        render: function(eventName) {
            this.$el.empty();
            this.$el.append(this.template({
                user: this.user.toJSON(),
                message: this.message.getMessage()
            }));
            this.trigger('render:completed', this);
            return this;
        }
    });
    return HomeView;
});