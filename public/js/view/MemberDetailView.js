define(["jquery", "underscore", "backbone", "text!template/member_detail.html"], function($, _, Backbone, member_detail_tpl) {
    var MemberDetailView = Backbone.View.extend({
        
        id: 'member_detail-view',

        template: _.template(member_detail_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.idMembre = options.id;
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
                var _this = this;
                var xhr = $.get(config.api_url + "/rest-member/"+_this.idMembre, null, null, 'jsonp');
                xhr.done( function(data){
                    $('#error').empty();
                    _this.chargementInfosMembre(data);                    
                });
                xhr.fail(function(data) {
                    $('#error').empty().html(data);
                });
            });
        },
        
        chargementInfosMembre : function(members) {
            if(members.data){
                $('input[name="id"]').val(members.data.id);
                $('input[name="name"]').val(members.data.name);
                $('input[name="firstname"]').val(members.data.firstname);
                $('input[name="telephone"]').val(members.data.telephone);
                $('input[name="fonction"]').val(members.data.fonction);
                $('input[name="email"]').val(members.data.email);
                $('input[name="droit_mobile"]').filter('[value='+members.data.droit_mobile+']').prop('checked', true);
            } else {
                $('#error').empty().html(members);
            }
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
    return MemberDetailView;
});