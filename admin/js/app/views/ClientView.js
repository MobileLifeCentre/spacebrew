define(["jquery", "underscore", "App", "marionette", "models/Client", "views/MessagesView", "text!templates/client.html"],
    function($, _, app, Marionette, Client, MessagesView, template) {
        var ClientView = Marionette.Layout.extend({
            template: _.template(template),

            className: "client",

            model: Client,

            ui: {
            },

            regions: {
                publishers : "#publishers",
                subscribers: "#subscribers"
            },

            initialize: function(msg) {
               
            },

            events: {
            },

            onShow: function() {
                var publishersView = new MessagesView({collection: this.model.get("publishers"), role: "publishers"});
                this.publishers.show(publishersView);

                var subscribersView = new MessagesView({collection: this.model.get("subscribers"), role: "subscribers"});
                this.subscribers.show(subscribersView);
            },

            edit: function(client) {
                var item = client.item;

                this.updateCSS(client);
            },

            templateHelpers: {
                
            },

            remove: function() {

            }
        });

        return ClientView;
    }

);