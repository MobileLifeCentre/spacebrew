define(["jquery", "underscore", "App", "marionette", "models/Client", "text!templates/client.html", "text!templates/selectcss.html"],
    function($, _, app, Marionette, Client, template, cssTemplate) {
        var ClientView = Marionette.ItemView.extend({
            template: _.template(template),

            cssTemplate: _.template(cssTemplate),

            className: "client",

            model: Client,

            ui: {

            },

            cssDiv: undefined,

            initialize: function() {
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
                var model = this.model.attributes;
                this.processEndpoints("pub", myPlumb.sourceEndpoint, model.publish.messages);
                this.processEndpoints("sub", myPlumb.targetEndpoint, model.subscribe.messages);
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

            updateCSS: function(item) {
                this.cssDiv.text(this.cssTemplate(item));
            },

            processEndpoints: function(type, endpoint, messages) {
                var model = this.model.attributes,
                    newEndpoint, id, currM, i;

                if (messages) {
                    i = messages.length;

                    while (i--) {
                        currM = messages[i];
                        id = this.getCommItemSelector(type, model.name, model.remoteAddress, currM.name, currM.type);
                        newEndpoint = jsPlumb.addEndpoint(id, endpoint);
                        myPlumb.endpoints[id] = newEndpoint;
                    }
                }
            },

            templateHelpers: {
                
            },

            remove: function() {

            },

            getCommItemSelector: function(publisher, clientName, remoteAddress, name, type) {
                return publisher + "_" + clientName.Safetify() + "_" + remoteAddress.Safetify() + "_" + name + "_" + type.Safetify();
            }
        });

        return ClientView;
    }

);