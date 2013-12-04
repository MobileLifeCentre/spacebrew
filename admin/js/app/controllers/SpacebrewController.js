define(["App", "marionette"], function(app, Marionette) {
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
		handleMessageMsg: function(msg) {

		},
		handleRemoveMsg: function(msg) {

		}
	});

	return new SpacebrewController();
});