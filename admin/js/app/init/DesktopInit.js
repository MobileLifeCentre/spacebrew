// DesktopInit.js
// --------------

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["jquery", "backbone", "routers/DesktopRouter", "jqueryui", "bootstrap", "backbone.validateAll", "spacebrew.utils"],

  function($, Backbone, DesktopRouter) {
    new DesktopRouter();
  }

);