define(["jquery", "underscore", "backbone", "backbone.localStorage"], function ($, _, Backbone, LocalStorage) {
    var LastcommandeLocalModel = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage("main-lastcommande"),
        initialize: function () {
            //_.bindAll(this, "onLoginSuccess", "onLoginFailure");
            uid = this.localStorage.records[0];
            if (!uid) {
                this.localStorage.create(this);
            } else {
                this.id = uid;
            }
        },
        defaults: {
            changeProduct: false,
            idCommande: null,
        },
        addProduct: function(id, quantity) {
            this.set('changeProduct', true);
            var t = this.get("product");
            if(t == undefined || t == null) {
                t = new Array();
            }
            t.push({"id":id,"qt": quantity});
            
            this.set('product', t);
            this.save();
        },
        changeData: function(){
            this.set('changeProduct', true);
            this.save();
        },
        resetData: function(){
            this.set('product', null);
            this.set('changeProduct', false);
            this.save();
        },
        saveNewStock: function(id, motif) {
            var self = this;
            var xhr = null;
            
            var options = {};
            options['product'] = this.get('product');
            if(this.get('idCommande') != null) {
                options['id_commande'] = this.get('idCommande');
            }
            options['id'] = id;
            options['motif'] = motif;
            
            xhr = $.ajax({
                url: config.api_url + "/rest-stock/"+options['id'],
                type: 'PUT',
                data: options,
                dataType: "jsonp"
            });
            xhr.done(function (data) {
                self.trigger('lastcommande:endsuccesstockupdated');
            });
            xhr.fail(function (data) {
                self.trigger('lastcommande:endfailurestockupdated', data);
            });
        }
    });
    return LastcommandeLocalModel;
});