define(["jquery", "underscore", "backbone", "text!template/mon_equipe.html"], function($, _, Backbone, mon_equipe_tpl) {
    var MonEquipeView = Backbone.View.extend({
        
        id: 'mon_equipe-view',

        template: _.template(mon_equipe_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.bind('render:completed', function() {
                var _this = this;
                var xhr = $.get(config.api_url + "/rest-member?p="+_this.user.get('token'), null, null, 'jsonp');
                xhr.done( function(data){
                    $('#error').empty();
                    _this.chargementMembre(data.data);                    
                });
                xhr.fail(function(data) {
                    $('#error').empty().html(data);
                });
            });
        },
        
        chargementMembre : function(members) {
            var chaine = "";
            for(i in members) {
                chaine += "<div class='member_div' ><div class='detailmember' attr-id='"+members[i].id+"'>"+members[i].name+' '+members[i].firstname+"</div></div>";
            }
            $('.moneq_1_content > div.tablerow').remove();
            $('.moneq_1_content').append(chaine);
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
            "click div.detailmember": "goToDetailMember",
            "click a#addmember": "addMember",
        },
        
        addMember: function(e){
            e.preventDefault();
            Backbone.history.navigate("memberAdd", true);
        },

        goToDetailMember: function(e) {
            e.preventDefault();
            Backbone.history.navigate("member/"+$(e.target).attr('attr-id'), true);
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
    return MonEquipeView;
});