define(["jquery", "underscore", "backbone", "text!template/member_detail.html"], function($, _, Backbone, member_detail_tpl) {
    var MemberAddView = Backbone.View.extend({
        
        id: 'member_add-view',

        template: _.template(member_detail_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.listenToOnce(this.user, 'user:endfailurememberupdated', function(event, data) {
                _.delay(this.loadingStop);
                $('error').empty().html(data);
                $('success').empty();
                
            });
            this.listenToOnce(this.user, 'user:endsuccesmemberupdated', function() {
                _.delay(this.loadingStop);
                $('error').empty();
                $('success').empty().html('Sauvegarde effectu&eacute;e');
                Backbone.history.navigate("monequipe", true);
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
        
        events: {
            "submit": "onSubmit",
            "click a#submitform": "submitform",
        },
        
        onSubmit: function(e) {
            e.preventDefault();
            this.loadingStart();
            var data = Backbone.Syphon.serialize(this);
            data['token'] = this.user.get('token');
            this.saveMember(data);
            Backbone.history.navigate("monequipe", true);
        },
        
        saveMember: function(data) {
            this.user.saveMember(data);
        },
        
        submitform: function(e) {
            e.preventDefault();
            $('body form').submit();
        },
        
        render: function(eventName) {
            this.loadingStart("Chargement des données");
            this.$el.empty();
            this.$el.append(this.template({
                user: this.user.toJSON()
            }));
            this.trigger('render:completed', this);
            return this;
            
            
        }
    });
    return MemberAddView;
});