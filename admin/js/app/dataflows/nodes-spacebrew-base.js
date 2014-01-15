define(["dataflow", "dataflows/nodes-spacebrew-node", "dataflows/nodes-spacebrew-node-view"], 
  function(Dataflow) {
  // Dependencies
  var Node = Dataflow.prototype.module("spacebrew-node");
  var Base = Dataflow.prototype.node("spacebrew-base");
  
  Base.Model = Node.Model.extend({
    defaults: function(){
      var defaults = Node.Model.prototype.defaults.call(this);
      defaults.type = "base";
      return defaults;
    },
    initialize: function() {
      Node.Model.prototype.initialize.call(this);
    },
    unload: function(){
      // Stop any processes that need to be stopped
    },
    inputs:[],
    outputs:[]
  });

  Base.View = Node.View.extend({
  });
});