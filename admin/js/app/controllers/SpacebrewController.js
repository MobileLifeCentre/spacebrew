define(["App", "marionette", "init/Spacebrew"], 
function(app, Marionette, Spacebrew) {
	var SpacebrewController = Marionette.Controller.extend({
		handleConfigMsg: function(msg) {
			app.vent.trigger("new:client", msg.config);
		}, 
		handleRouteMsg: function(msg) {
			switch (msg.route.type) {
				case "add":
					app.vent.trigger("add:route", msg.route);
				break;
				case "remove":
					app.vent.trigger("remove:route", msg.route);
				break;
			}
		},
		handleRemoveMsg: function(msg) {
			msg = msg.remove;
			
			for (var i = 0; i < msg.length; ++i) {
				app.vent.trigger("delete:client", msg[i]);
			};
		},
		handleMessageMsg: function(msg) {
			app.vent.trigger("new:message", msg.message);
		},
		createRoute: function(route) {
			this.sendRouteMsg("add", route);
		}, 
		deleteRoute: function(route) {
			this.sendRouteMsg("remove", route);
		},
		sendRouteMsg: function(changeType, route) {
			var m = {
	            route: {
	            	type: changeType,
                    publisher: {
                    	clientName: route.source.parentNode.get("label"),
                        name: route.source.get("label"),
                        type: route.source.get("type"),
                        remoteAddress: route.source.parentNode.get("remoteAddress")
                    },
	                subscriber: {
	                	clientName: route.target.parentNode.get("label"),
                        name: route.target.get("label"),
                        type: route.target.get("type"),
                        remoteAddress: route.target.parentNode.get("remoteAddress")
                   	}
                }
	        };

	        window.spacebrew.send(JSON.stringify(m));
		}
	});

	var spacebrewController = new SpacebrewController();
	// Comunication dataflow -> Spacebrew
	app.vent.on("create:route", spacebrewController.createRoute, spacebrewController);
	app.vent.on("delete:route", spacebrewController.deleteRoute, spacebrewController);

	return spacebrewController;
});