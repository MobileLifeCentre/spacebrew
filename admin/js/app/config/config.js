// Require.js Configurations
// -------------------------
require.config({
  // Sets the js folder as the base directory for all future relative paths
  baseUrl: "./js/app",

  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths: {

      // Core Libraries
      // --------------
      "jquery": "../libs/jquery",

      "jqueryui": "../libs/jqueryui",

      "jquerymobile": "../libs/jquery.mobile",

      "underscore": "../libs/lodash",

      "backbone": "../libs/backbone",

      "jsplumbjquery": "../libs/jsplumb/jquery.jsPlumb-1.3.13-RC1",

      // Spacebrew old Libraries
      // --------------
      "spacebrew.utils": "init/utils",
      "spacebrew.wsevents": "init/wsevents",
      "spacebrew.userevents": "init/userevents",
      "spacebrew.plumbing": "init/plumbing",
      "handlebars": "../libs/handlebars-v1.1.2",

      // Plugins
      // -------
      "backbone.validateAll": "../libs/plugins/Backbone.validateAll",

      "bootstrap": "../libs/plugins/bootstrap",

      "text": "../libs/plugins/text",

      "jasminejquery": "../libs/plugins/jasmine-jquery",

      // Flat-UI

      //"jquery.ui.custom" : "../libs/flat-ui/jquery-ui-1.10.3.custom.min",

      //"jquery.ui.touch-punch" : "../libs/flat-ui/jquery.ui.touch-punch.min",

      //"bootstrap.select": "../libs/flat-ui/bootstrap-select",

      //"bootstrap.switch": "../libs/flat-ui/bootstrap-switch",

      //"flatui.checkbox" : "../libs/flat-ui/flatui-checkbox",

      //"flatui.radio" : "../libs/flat-ui/flatui-radio",

      //"jquery.tagsinput" : "../libs/flat-ui/jquery.tagsinput",

      //"jquery.placeholder" : "../libs/flat-ui/jquery.placeholder",

      //"jquery.stacktable" : "../libs/flat-ui/jquery.stacktable",

      // Marionette

      "localstorage": "../libs/plugins/Backbone.localStorage",

      "wreqr": "../libs/plugins/backbone.wreqr",

      "babysitter": "../libs/plugins/backbone.babysitter",

      "json2": "../libs/plugins/json2",

      "marionette": "../libs/plugins/backbone.marionette",

      // jsPlumb
      "jsplumb": "../libs/jsplumb/jsPlumb-1.3.13-RC1",

      "jsplumb.util": "../libs/jsplumb/jsPlumb-util-1.3.13-RC1",

      "jsplumb.dom.adapter" : "../libs/jsplumb/jsPlumb-dom-adapter-1.3.13-RC1",
  
      "jsplumb.renderers.svg": "../libs/jsplumb/jsPlumb-renderers-svg-1.3.13-RC1",
       
      "jsplumb.connectors": "../libs/jsplumb/jsPlumb-connectors-statemachine-1.3.13-RC1",

      "jsplumb.defaults": "../libs/jsplumb/jsPlumb-defaults-1.3.13-RC1",

      "jsplumb.drag": "../libs/jsplumb/jsPlumb-drag-1.3.13-RC1",

      "jsplumb.overlays.guidelines": "../libs/jsplumb/jsPlumb-overlays-guidelines-1.3.13-RC1"

  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {
      // Spacebrew old
      "spacebrew.utils": ["handlebars"],
      "spacebrew.plumbing": ["jsplumb", "jsplumb.drag", "jsplumb.defaults", 
                            "jsplumb.overlays.guidelines", "jsplumb.renderers.svg",
                            "jsplumb.connectors", "jsplumbjquery"],
      "spacebrew.wsevents": ["spacebrew.utils"],

      // jQuery Mobile
      "jquerymobile": ["jquery"],

      // Twitter Bootstrap jQuery plugins
      "bootstrap": ["jquery"],

      // jQueryUI
      "jqueryui": ["jquery"],

      // Backbone
      "backbone": {

        // Depends on underscore/lodash and jQuery
        "deps": ["underscore", "jquery"],

        // Exports the global window.Backbone object
        "exports": "Backbone"

      },

      "bootstrap.select": ["bootstrap"],

      "bootstrap.switch": ["bootstrap"],

      "jquery.tagsinput": ["jquery"],

      "jquery.placeholder": ["jquery"],

      "jquery.stacktable": ["jquery"],

      // Flat-UI
      "flatui": ["jquery", "bootstrap", "jquery.ui.custom", 
                  "jquery.ui.touch-punch", "bootstrap.select", 
                  "bootstrap.switch", "flatui.checkbox", "flatui.radio",
                  "jquery.tagsinput", "jquery.placeholder", "jquery.stacktable"],

      // Backbone.validateAll plugin that depends on Backbone
      "backbone.validateAll": ["backbone"],

      // Jasmine-jQuery plugin
      "jasminejquery": ["jquery"],

      // Marionette
      "marionette": {
        "deps": ["jquery", "underscore", "backbone", "wreqr", "babysitter", "json2"],
        "exports": "Marionette"
      },

      "wreqr": ["backbone"],

      "babysitter": ["backbone"],

      // jsPlumb
      "jsplumb": ["jsplumb.util", "jsplumb.dom.adapter"],

      "jsplumbjquery": ["jquery", "jsplumb"],

      "jsplumb.renderers.svg": ["jsplumb"],

      "jsplumb.connectors": ["jsplumb"],

      "jsplumb.defaults": ["jsplumb"],

      "jsplumb.drag": ["jsplumb"],

      "jsplumb.overlays.guidelines": ["jsplumb"]
  }

});