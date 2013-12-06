define(["marionette", "models/Message", "text!templates/message.html"],
    function(Marionette, Message, template) {
        var MessageView = Marionette.ItemView.extend({
            template: _.template(template),
            model: Message,

            initialize: function() {
                this.el.className = "itemwrapper " + this.model.get("role");
            },

            onShow: function() {
                this.addToJSPlumb();
            },

            addToJSPlumb: function() {
                var id = this.model.get("ID");
                var newEndpoint = jsPlumb.addEndpoint(id, this.model.get("jsPlumbEndpoint"));

                myPlumb.endpoints[id] = newEndpoint;
            }
        });

        return MessageView;
    }
);