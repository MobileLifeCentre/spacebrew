define(["jquery","backbone", "App", "models/Client"],
  function($, Backbone, app, Client) {
    var ClientCollection = Backbone.Collection.extend({
      model: Client
    });

    app.vent.on("new:client", function(clientJSON) {
      app.clients.add(new Client(clientJSON));
    });

    return ClientCollection;
  }
);