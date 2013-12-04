define(["jquery","backbone", "App", "models/Route", "init/Spacebrew"],
  function($, Backbone, app, Route, Spacebrew) {
    appo = app;
    var RouteCollection = Backbone.Collection.extend({
      model: Route,

      changeRoute: function(changeType, fromId, toId) {
      	var selectedPub = fromId.split('_').map(Unsafetify);
	    var selectedSub = toId.split('_').map(Unsafetify);
	    var clientName = 1, 
	        remoteAddress = clientName + 1, 
	        name = remoteAddress + 1, 
	        type = name + 1;

	    if (selectedPub.length == type + 1 && selectedSub.length == type + 1){
	        var m = {
	            route: {
	            	type: changeType,
                    publisher: {
                    	clientName: selectedPub[clientName],
                        name: selectedPub[name],
                        type: selectedPub[type],
                        remoteAddress: selectedPub[remoteAddress]
                    },
	                subscriber: {
	                	clientName: selectedSub[clientName],
                        name: selectedSub[name],
                        type: selectedSub[type],
                        remoteAddress: selectedSub[remoteAddress]
                   	}
                }
	        };

	        Spacebrew.send(JSON.stringify(m));
	    }

      }
    });

	// TO-DO move this to Route level
	var routeEquals = function(a, b) {

        return a.publisher.name == b.publisher.name &&
        a.publisher.clientName == b.publisher.clientName &&
        a.publisher.clientName == b.publisher.clientName &&
        a.subscriber.name == b.subscriber.name &&
        a.subscriber.clientName == b.subscriber.clientName &&
        a.subscriber.clientName == b.subscriber.clientName;
	}


    app.vent.on("add:route", function(routeJSON) {
	  app.routes.add(new Route(routeJSON));
	});

	app.vent.on("remove:route", function(routeJSON) {
		var publisher = routeJSON.publisher,
			subscriber = routeJSON.subscriber;

		var route = undefined; 
		for (var i = 0; i < app.routes.length; ++i) {
			route = app.routes.at(i);

			if (routeEquals(route.attributes, routeJSON)) {
				break;
			}
		};

		route.destroy();
		app.routes.remove(route);
	});

	app.vent.on("create:route", function(routeJSON) {
		app.routes.changeRoute("add", routeJSON.publisher, routeJSON.subscriber);
	});

	app.vent.on("delete:route", function(routeJSON) {
		app.routes.changeRoute("remove", routeJSON.publisher, routeJSON.subscriber);
	});

    return RouteCollection;
  }
);	