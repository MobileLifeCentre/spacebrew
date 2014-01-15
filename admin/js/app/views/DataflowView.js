define(["App", "marionette", "text!templates/dataflow.html", "dataflow", "dataflows/nodes-spacebrew", "dataflows/plugin-spacebrew", "nodes"],
    function(app, Marionette, template, Dataflow, DataflowSpacebrew) {
        var DataflowView = Marionette.ItemView.extend({
            template: _.template(template),

            ui : {
            },

            initialize: function() {
            	
            },

            onShow: function() {
            	var dataflow = new Dataflow({
		          appendTo: "#graph1",
		          debug: "true"
		        });

		        // Load test graph
		        var g = dataflow.loadGraph(
		          {}
		        );
		        g.trigger("change");
            }
            
        });

        // Returns the View class
        return DataflowView;
    }
);