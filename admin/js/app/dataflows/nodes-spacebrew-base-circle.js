define(["dataflow", "dataflows/nodes-spacebrew-base"], 
  function(Dataflow) {
  // Dependencies
  var Base = Dataflow.prototype.node("spacebrew-base");
  var BaseCircle = Dataflow.prototype.node("spacebrew-base-circle");

  BaseCircle.Model = Base.Model.extend({
    defaults: function(){
      var defaults = Base.Model.prototype.defaults.call(this);
      defaults.type = "base-circle";
      return defaults;
    },
    initialize: function() {
      Base.Model.prototype.initialize.call(this);
    },
    unload: function(){
      // Stop any processes that need to be stopped
    },
    toJSON: function() {
      var json = Base.Model.prototype.toJSON.call(this);
      return json;
    },
    inputs:[],
    outputs:[]
  });

  BaseCircle.View = Base.View.extend({
    initialize: function(options) {
      Base.View.prototype.initialize.call(this, options);
      // Initial size
      this.$el.css({
        width: 150,
        height: 150
      });
      // Make resizable
    },
    resizeStop: function(event, ui) {
    }
  });
});