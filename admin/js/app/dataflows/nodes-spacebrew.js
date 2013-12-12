define(["dataflow"], 
  function(Dataflow) {
    var BaseResizable = Dataflow.prototype.node("base-resizable");
    var DataflowSpacebrew = Dataflow.prototype.node("dataflow-spacebrew");
  
    var Input = Dataflow.prototype.module("input");
    var Output = Dataflow.prototype.module("output");
    var Graph = Dataflow.prototype.module("graph");

    DataflowSpacebrew.icon = 'fa-rocket';

    DataflowSpacebrew.Model = BaseResizable.Model.extend({
      defaults: function() {
        var defaults = BaseResizable.Model.prototype.defaults.call(this);
        defaults.label = "subgraph";
        defaults.icon = DataflowSpacebrew.icon;
        defaults.type = "dataflow-spacebrew";
        defaults.graph = {
          nodes:[
            {id: "1", label: "in", type:"dataflow-input",  x:180, y: 15},
            {id: "99", label:"out", type:"dataflow-output", x:975, y:500}
          ]
        };
        return defaults;
      },
      initialize: function(options) {
        BaseResizable.Model.prototype.initialize.call(this);

        this.set("remoteAddress", options.client.get("remoteAddress"));
        this.client = options.client;

        this.client.get("subscribers").each(function(message) {
          message.get("routes").bind("add", function(route) {
          });
        });

        var self = this;
        this.client.get("publishers").each(function(message) {
          message.get("routes").bind("add", function(route) {
            
            self.outputs.each(function(message) {
              if (message.get("label") == route.get("publisher").name) {
                
              }
            });
            
          });
        });

        this.set("label", this.client.get("name"));

        var graph = this.get("graph");
        graph.parentNode = this;
        graph.dataflow = this.parentGraph.dataflow;
        this.graph = new Graph.Model(graph);

        // Initialize i/o from subgraph
        var inputs = this.client.get("subscribers");
        inputs.each(this.addInput, this);

        var outputs = this.client.get("publishers");
        outputs.each(this.addOutput, this);

        // Listen for new i/o
        inputs.on("add", function(node) {
            this.addInput(node);
        }, this);
        outputs.on("add", function(node) {
            this.addOutput(node);
        }, this);

        // Listen for removing i/o
        inputs.on("remove", function(node) {
            this.removeOutput(node);
        }, this);
        outputs.on("remove", function(node) {
            this.removeOutput(node);
        }, this);
      },
      addInput: function(input) {
        var newInput = new Input.Model({
          id: input.get("ID"),
          label: input.get("name"),
          type: input.get("type"),
          parentNode: this,
          inputNode: input
        });
        this.inputs.add(newInput);
      },
      recieve: function (name, value) {
        // Forward data to subgraph
        var inputNode = this.inputs.get(name).get("inputNode");
        if (inputNode) {
          inputNode.send("data", value);
        }
      },
      addOutput: function(output) {
        
        var newOutput = new Output.Model({
          id: output.get("ID"),
          label: output.get("name"),
          type: output.get("type"),
          parentNode: this,
          outputNode: output
        });

        this.outputs.add(newOutput);
        output.set("parentNode", this);

        // TO-DO create proper adaptation of size to label
        var size = newOutput.get("label").length*20;
        if (this.get("w") < size) this.set({"w": size});
        
      },
      removeInput: function(node) {
        var input = this.inputs.get(node.id);
        input.remove();
        this.inputs.remove(input);
      },
      removeOutput: function(node) {
        var output = this.outputs.get(node.id);
        output.remove();
        this.outputs.remove(output);
      },
      remove: function() {
        BaseResizable.Model.prototype.remove.call(this);
        this.graph.remove();
      },
      inputs:[
      ],
      outputs:[
      ]
    });


    DataflowSpacebrew.View = BaseResizable.View.extend({
      events: function() {
        var events = BaseResizable.View.prototype.events.call(this);
        events["click .show-subgraph"] = "showSubgraph";
        return events;
      },
      initialize: function(options) {
        BaseResizable.View.prototype.initialize.call(this, options);
        this.model.graph.view = new Graph.View({model: this.model.graph});

        // Listen for label changes
        this.model.inputs.each(this.addInput, this);
        this.model.inputs.on("add", this.addInput, this);
        this.model.outputs.each(this.addOutput, this);
        this.model.outputs.on("add", this.addOutput, this);
      },
      addInput: function(input){
        // Listen for label changes
        if (!input.get('inputNode')) {
          return;
        }
        input.get("inputNode").on("change:label", function(i){
          input.view.$(".label").text(i.get("label"));
        }, this);
      },
      addOutput: function(output) {
        // Listen for label changes
        if (!output.get('outputNode')) {
          return;
        }
        output.get("outputNode").on("change:label", function(o){
          output.view.$(".label").text(o.get("label"));
        }, this);
      },
      showSubgraph: function(){
        this.model.graph.dataflow.showGraph(this.model.graph);
      }
    });
});