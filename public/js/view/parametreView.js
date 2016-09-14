define(["jquery", "underscore", "backbone", "text!template/parametre_accueil.html"], function($, _, Backbone, parm_acc_tpl) {
    var ParametreView = Backbone.View.extend({
        
        id: 'param-acc-view',

        template: _.template(parm_acc_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.bind('render:completed', function() {
               $('a.ui-btn').removeClass('ui-btn');
            });
        },
        
        /*loadingStart: function(text_show) {
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
        },*/
        
        render: function(eventName) {
            this.$el.empty();
            this.$el.append(this.template({
                user: this.user.toJSON()
            }));
            this.trigger('render:completed', this);
            /*this.$el.find('#entree, #sortie').on('click', _.bind(this.onClickFilter, this));*/
            return this;
        }
    });
    return ParametreView;
});