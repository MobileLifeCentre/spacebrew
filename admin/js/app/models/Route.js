define(["jquery", "backbone", "init/Spacebrew"],
    function($, Backbone, Spacebrew) {
        var Route = Backbone.Model.extend({
            initialize: function(msg) {

            },

            
            validate: function(attrs) {

            },

            equals: function(json) {
                var publisher = this.model.get("publisher"),
                    subscriber = this.model.get("subscriber");

                return attr.publisher.name == publisher.name &&
                attr.publisher.clientName == publisher.clientName &&
                attr.publisher.clientName == publisher.clientName &&
                attr.subscriber.name == subscriber.name &&
                attr.subscriber.clientName == subscriber.clientName &&
                attr.subscriber.clientName == subscriber.clientName;
            }
        });

        return Route;

    }

);

