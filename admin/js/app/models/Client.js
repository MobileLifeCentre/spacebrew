// Client.js
// --------
define(["jquery", "backbone", "collections/MessageCollection", "models/Message"],
    function($, Backbone, MessageCollection, Message) {
        var Client = Backbone.Model.extend({
            initialize: function(msg) {
                msg.ID = msg.name.Safetify() + "_" + msg.remoteAddress.Safetify();

                this.model = msg;

                this.set("ID", msg.ID);
                this.config = msg;

                this.set("subscribers", new MessageCollection());
                this.set("publishers", new MessageCollection());

                this.addMessageTo("subscriber", this.model.subscribe.messages);
                this.addMessageTo("publisher", this.model.publish.messages);
            },

            addMessageTo: function(type, messages) {
                var target = this.get(type + "s");

                for (var i = 0; i < messages.length; ++i) {
                    var message = messages[i];
                    message.client = this.model;
                    message.role = type;
                    target.add(new Message(message));
                }
            },

            defaults: {

            },
            
            validate: function(attrs) {

            },
        });

        return Client;

    }

);
