// View.js
// -------
define(["jquery", "marionette", "models/Model", "text!templates/test.html"],

    function($, Marionette, Model, template){

        var View = Marionette.ItemView.extend({
            template: Handlebars.compile(template),
            // View Event Handlers
            events: {

            },

            // Renders the view's template to the UI
            render: function() {
                // Dynamically updates the UI with the view's template
                this.$el.html(this.template);
                console.log(this.$el);
                // Maintains chainability
                return this;

            }

        });

        // Returns the View class
        return View;

    }

);