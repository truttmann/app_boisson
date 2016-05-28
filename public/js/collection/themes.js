define(["jquery", "underscore", "backbone", "backbone.localStorage", "model/theme"], function($, _, Backbone, LocalStorage, ThemeModel) {
    
    var ThemesCollection = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("themes"),
        model: ThemeModel,
        getFromAudit: function(id) {
            return new Backbone.Collection(this.where({
                'audit_id': id
            }));
        },
        getTree: function(id) {
            var themes = this.getFromAudit(id);
            roots = new Backbone.Collection(themes.where({
                'parent_id': null
            }));
            roots.each(function(root) {
                leafs = new Backbone.Collection(themes.where({
                    'parent_id': root.get('id')
                }));
                root.set('children', leafs.toJSON());
            })
            return roots;
        }
    });
    return ThemesCollection;
});