define(["App", "marionette", "models/Message", "text!templates/message.html"],
    function(app, Marionette, Message, template) {
        var MessageView = Marionette.ItemView.extend({
            template: _.template(template),
            model: Message,

            initialize: function() {
            },

            onShow: function() {
                this.addToJSPlumb();
            },

            events: {
                "click .item": "onClickItem",
            },

            onClickItem: function(click) {
                app.vent.trigger("click:client", this);
            },

            select: function() {
                this.$el
                    .addClass("selected")
                    .closest(".clientrow")
                        .addClass("selected");
            },

            edit: function() {

            },

            isSelected: function() {
                return this.$el.hasClass("selected");
            },

            unselect: function() {
                this.$el
                    .removeClass("selected")
                    .closest(".clientrow")
                        .removeClass("selected");
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