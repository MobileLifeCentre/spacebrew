define(["marionette", "handlebars", "spacebrew.plumbing"],
    function(Marionette, Handlebars) {
        var App = Marionette.Application,
            app = new App();

        app.addRegions({
            "content": "#content"
        });

        app.addInitializer(function(options) {
            
        });

        window.app = app;

        // Returns the View class
        return app;
    }
);