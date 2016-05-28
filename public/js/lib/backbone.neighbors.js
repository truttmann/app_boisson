(function(root, factory) {
    // Set up Backbone appropriately for the environment.
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['underscore', 'backbone'], function(_, Backbone) {
            factory(root, _, Backbone);
        });
    } else {
        // Browser globals
        factory(root, root._, root.Backbone);
    }
}(this, function(root, _, Backbone) {

    Backbone.Model = Backbone.Model.extend({
        nextModel: function() {
            
            if (this.collection) {
                return this.collection.at(this.collection.indexOf(this) + 1);
            }
        },
        prevModel: function() {
            
            if (this.collection) {
                return this.collection.at(this.collection.indexOf(this) - 1);
            }
        }
    });

    return Backbone;
}));