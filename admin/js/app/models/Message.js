define(["jquery", "backbone"],
    function($, Backbone) {
        var Message = Backbone.Model.extend({
            initialize: function(msg) {
                var shortRole;

                if (msg.role == "publisher") {
                    shortRole = "pub";
                    this.set("jsPlumbEndpoint", myPlumb.sourceEndpoint);
                } else {
                    shortRole = "sub";
                    this.set("jsPlumbEndpoint", myPlumb.targetEndpoint);
                }
                this.set("ID", shortRole + "_" + msg.client.ID
                        + "_" + msg.name.Safetify() + "_" + msg.type.Safetify());
                this.set("role", msg.role);

                this.model = msg;
            },

            defaults: {

            },
            
            validate: function(attrs) {

            },
        });

        return Message;

    }

);