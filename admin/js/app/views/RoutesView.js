define(["App", "marionette", "views/RouteView", "collections/RouteCollection"],
    function(app, Marionette, RouteView, RouteCollection) {
    	app.routes = app.routes || new RouteCollection();

        var RoutesView = Marionette.CollectionView.extend({
            itemView: RouteView,
            collection: app.routes,
            onAfterItemAdded: function(itemView) {
            }
        });

        return RoutesView;
    }
);