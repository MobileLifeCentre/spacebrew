define(["jquery", "backbone", "init/Spacebrew"],
    function($, Backbone, Spacebrew) {
        var Route = Backbone.Model.extend({
            initialize: function(msg) {

            },

            
            validate: function(attrs) {

            },

            /*destroy: function() {
                console.log("destroy");
                Spacebrew.send(JSON.stringify({
                    route: {
                        type:'remove',
                        publisher: this.get("publisher"),
                        subscriber: this.get("subscriber")
                    }
                }));

                // TO-DO Add result from Spacebrew send?
                return { successs: "ok"};
            },*/

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

