// DesktopRouter.js
// ----------------
define(["jquery", "backbone", "marionette", "App", "init/Spacebrew", "views/DataflowView"],
    function($, Backbone, Marionette, app, Spacebrew, DataflowView) {
        app.start();
        Spacebrew.start();

        var DesktopRouter = Backbone.Marionette.AppRouter.extend({

            initialize: function() {
                // Tells Backbone to start watching for hashchange events
                Backbone.history.start();
                // TO-DO Move to another place
                
            },

            // All of your Backbone Routes (add more)
            routes: {
                // When there is no hash on the url, the home method is called
                "": "index",
                "*actions": "index"
            },

            index: function() {
                // Instantiates a new view which will render the header text to the page
                app.content.show(new DataflowView());
            }

        });

        // Returns the DesktopRouter class
        return DesktopRouter;
    }

);