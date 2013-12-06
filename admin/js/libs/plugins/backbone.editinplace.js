;(function (window, document, undefined) {
    // Checks to make sure Backbone, Backbone.Model and the private validate method are on the page
    if(window.Backbone && window.Backbone.Model && window.Backbone.Model.prototype._validate) {
        // Run validation against the next complete set of model attributes,
        // returning `true` if all is well. If a specific `error` callback has
        // been passed, call that instead of firing the general `"error"` event.
        window.Backbone.EditInPlaceForm = Backbone.View.extend({
            tagName: "form",

            events: {
                "submit": "save"
            },

            initialize: function (options) {
                _.extend(this, options);
            },

            render: function () {
                this.$el.html($("<input>", {
                    value: this.model.get(this.attribute)
                }));
                return this;
            },

            save: function () {
                this.model.set(this.attribute, this.$el.find("input").val());
                return false;
            }
        });

        window.Backbone.EditInPlaceView = Backbone.View.extend({
            attribute: "text",

            initialize: function (options) {
                _.extend(this, options);
                this.model.on("change", this.render, this);
            },

            events: {
                "dblclick": "edit"
            },

            render: function () {
                this.$el.html(this.model.get(this.attribute));
                return this;
            },

            edit: function () {
                this.$el.html(new EditInPlaceForm({
                    model: this.model,
                    attribute: this.attribute
                }).render().el);
                this.$el.find("input").select();
            }
        });
    }
}(window, document));