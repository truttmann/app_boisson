define(["jquery", "underscore", "backbone", "backbone.localStorage"], function ($, _, Backbone, LocalStorage) {
    var StockLocalModel = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage("main-stock"),
        initialize: function () {
            uid = this.localStorage.records[0];
            if (!uid) {
                this.localStorage.create(this);
            } else {
                this.id = uid;
            }
        },
        defaults: {
            product: ""
        },
        setProduct: function (prod) {
            this.set('product', prod);
            this.save();
        },
        getProduct: function () {
            return this.get('product');
        },
    });
    return StockLocalModel;
});