define(["jquery", "backbone", "init/Spacebrew"],
    function($, Backbone, Spacebrew) {
        var Route = Backbone.Model.extend({
            initialize: function(msg) {

            },

            
            validate: function(attrs) {

            },

            equals: function(json) {
                var publisher = this.get("publisher"),
                    subscriber = this.get("subscriber");

                return json.publisher.name == publisher.name &&
                json.publisher.clientName == publisher.clientName &&
                json.publisher.clientName == publisher.clientName &&
                json.subscriber.name == subscriber.name &&
                json.subscriber.clientName == subscriber.clientName &&
                json.subscriber.clientName == subscriber.clientName;
            }
        });

        return Route;

    }

);

