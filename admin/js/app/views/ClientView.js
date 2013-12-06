define(["jquery", "underscore", "App", "marionette", "models/Client", "views/MessagesView", "text!templates/client.html", "text!templates/selectcss.html"],
    function($, _, app, Marionette, Client, MessagesView, template, cssTemplate) {
        var ClientView = Marionette.Layout.extend({
            template: _.template(template),

            cssTemplate: _.template(cssTemplate),

            className: "client",

            model: Client,

            ui: {
            },

            regions: {
                publishers : "#publishers",
                subscribers: "#subscribers"
            },

            cssDiv: undefined,

            initialize: function(msg) {
                this.cssDiv = $("style#selectedCss");

            },

            events: {
                "click .item": "onClickItem",
                "click .deletebutton": "onClickDelete"
            },

            onClickItem: function(click) {
                var item = $(click.currentTarget);

                var event = {
                    id: item.prop("id"),
                    item: item,
                    model: this.model,
                    pub: item.hasClass("publisher"),
                    type: this.getItemType(item),
                    view: this
                };

                app.vent.trigger("click:client", event);
            },

            onClickDelete: function(click) {
                click.currentTarget = $(click.currentTarget).parent();
                this.onClickItem(click);

                return false;
            },

            getItemType: function(item) {
                // TO-DO remove type hardcoding
                return item.hasClass("boolean") ? "boolean" 
                        : item.hasClass("string") ? "string" 
                        : item.hasClass("number") ? "number" 
                        : "range";
            },

            onShow: function() {
                var publishersView = new MessagesView({collection: this.model.get("publishers"), role: "publishers"});
                this.publishers.show(publishersView);

                var subscribersView = new MessagesView({collection: this.model.get("subscribers"), role: "subscribers"});
                this.subscribers.show(subscribersView);
            },

            select: function(client) {
                client.item.addClass("selected");
                client.item.closest(".clientrow")
                    .addClass("selected");

                this.updateCSS(client);
            },

            unselect: function(client) {
                client.item.removeClass("selected");
                client.item.closest(".clientrow")
                    .removeClass("selected");

                this.updateCSS(client);
            },

            edit: function(client) {
                var item = client.item;

                this.updateCSS(client);
            },

            updateCSS: function(item) {
                this.cssDiv.text(this.cssTemplate(item));
            },

            templateHelpers: {
                
            },

            remove: function() {

            }
        });

        return ClientView;
    }

);