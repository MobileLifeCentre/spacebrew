define(["jquery", "underscore", "backbone", "marionette", "models/Model", "text!templates/clients.html"],
    function($, _, Backbone, Marionette, Model, template){
        var ClientsView = Backbone.Marionette.CollectionView.extend({
            template: _.template(template),
            className: "hola",

            // The DOM Element associated with this view

            // It binds elements to Jquery
            ui: {

            },

            // View constructor
            initialize: function() {
            },

            // View Event Handlers
            events: {

            },

            onShow: function() {
            },

            templateHelpers: {
              something: function(){
                return "Do stuff with " + this.name + " because it's awesome.";
              }
            },

            remove: function() {

            }

        });

        // Returns the View class
        return ClientsView;

    }

);