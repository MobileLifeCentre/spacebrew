define(["marionette", "App", "views/ClientsView", "views/RoutesView", "text!templates/clients.html"],
    function(Marionette, app, ClientsView, RoutesView, template) {
        var AdminView = Marionette.Layout.extend({
        	template: _.template(template),
            regions: {
            	clientList: "#client_list",
                routeList: "#routes_list"
            },
            onShow: function() {
                // TO-DO move this behaviour to its own controller
                app.clientsView = new ClientsView();
            	this.clientList.show(app.clientsView);

                app.routesView = new RoutesView();
                this.routeList.show(app.routesView);

                setupPlumbing();
            },
        });

        return AdminView;
    }
);