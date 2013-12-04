// Client.js
// --------
define(["jquery", "backbone"],
    function($, Backbone) {
        var Client = Backbone.Model.extend({
            initialize: function(msg) {
                this.config = msg;
                this.set("ID", msg.name.Safetify() + "_" + msg.remoteAddress.Safetify());
            },

            defaults: {

            },
            
            validate: function(attrs) {

            },
        });

        return Client;

    }

);
