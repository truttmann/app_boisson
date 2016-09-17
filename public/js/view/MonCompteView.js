define(["jquery", "underscore", "backbone", "backbone.syphon", "text!template/moncompte.html"], function($, _, Backbone, Syphon, moncompte_tpl) {
    var MonCompteView = Backbone.View.extend({
        
        template: _.template(moncompte_tpl),
        
        id: 'moncompte-view',

        initialize: function(options) {
            this.user = options.user;
            this.listenToOnce(this.user, 'user:endfailureuserupdated', function(event, data) {
                _.delay(this.loadingStop);
                $('error').empty().html(data);
                $('success').empty();
                
            });
            this.listenToOnce(this.user, 'user:endsuccesuserupdated', function() {
                _.delay(this.loadingStop);
                $('error').empty();
                $('success').empty().html('Sauvegarde effectu&eacute;e');
                Backbone.history.navigate("monequipe", true);
            });
            this.bind('render:completed', function() {
                this.loadingStart();
                var _this = this;
                var xhr = $.get(config.api_url + "/rest-user/"+_this.user.get('token'), {"token": _this.user.get('token')}, null, 'jsonp');
                xhr.done( function(data){
                    if(data.data){
                        $('input[name="id"]').val(data.data.id);
                        $('input[name="nom"]').val(data.data.name);
                        $('input[name="prenom"]').val(data.data.firstname);
                        $('input[name="societe"]').val(data.data.societe);
                        $('input[name="adr_societe"]').val(data.data.adresse);
                        $('input[name="cp"]').val(data.data.cp);
                        $('input[name="ville"]').val(data.data.ville);
                        $('input[name="siret"]').val(data.data.siret);
                        $('input[name="tva"]').val(data.data.tva);
                        $('textarea[name="horaire"]').val(data.data.horaire);
                        $('textarea[name="information"]').val(data.data.information);
                        $('input[name="email"]').val(data.data.email);
                        $('input[name="email_conf"]').val(data.data.email);
                    } else {
                        $('#error').empty().html(data);
                    }
                    _this.loadingStop();
                });
                xhr.fail(function(data) {
                    $('#error').empty().html(data);
                    Backbone.history.navigate("home", true);
                });
            });
        },

        loadingStart: function() {
            $.mobile.loading('show', {
                text: 'Chargement des données',
                textVisible: true,
                theme: 'b',
                html: ""
            });
        },

        loadingStop: function() {
            $.mobile.loading('hide');
        },

        saveDemandeUser: function(data) {
            this.listenToOnce(this.user, 'login:failure', function() {
                _.delay(this.loadingStop);
            });
            this.user.update(data);
        },

        onSubmit: function(e) {
            e.preventDefault();
            this.loadingStart();
            var data = Backbone.Syphon.serialize(this);
            this.saveDemandeUser(data);
        },
        
        events: {
            "submit": "onSubmit",
            "click a#submitform": "submitform",
            /*"click a#cancel": "cancel",*/
        },
        
        submitform: function(e) {
            e.preventDefault();
            $('body form').submit();
        },
        
        cancel: function(e) {
            Backbone.history.navigate("#home", true);
        },
        
        render: function(eventName) {
            $(this.el).html(this.template({}));
            this.trigger('render:completed', this);
            return this;
        }
    });
    return MonCompteView;
});