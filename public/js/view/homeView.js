define(["jquery", "underscore", "backbone", "text!template/home.html"], function($, _, Backbone, home_tpl) {
    var HomeView = Backbone.View.extend({
        
        id: 'home-view',

        template: _.template(home_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.audits = options.audits;
        },
        
        render: function(eventName) {
			in_audit = false;
			this.$el.empty();
            this.$el.append(this.template({
                audits: this.audits.toJSON(),
                user: this.user.toJSON(),
            }));
            this.trigger('render:completed', this);
            return this;
        }
    });
    return HomeView;
});