define(["jquery", "underscore", "backbone", "backbone.localStorage"], function ($, _, Backbone, LocalStorage) {
    var CommandeLocalModel = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage("main-commande"),
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
            "product": []
        },
        addProduct: function(id, quantity, price) {
            var t = this.get("product");
            if(t == undefined || t == null) {
                t = new Array();
            }
            t.push({"id":id,"qt": quantity,"price":price});
            
            this.set('product', t);
            this.save();
        },
        resetData: function(){
            this.set('product', null);
            this.save();
        },
        saveCommande: function(id, motif) {
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
        },
    });
    return CommandeLocalModel;
});