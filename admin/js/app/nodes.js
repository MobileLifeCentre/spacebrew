define(["d3.v3.min"],
  function(d3) {
    var w = 480,
        h = 800,
        node,
        link,
        root;

    var force = d3.layout.force()
        .on("tick", tick)
        .charge(-300)
        .linkDistance(function(d) { return d.target._children ? 200 : 100; })
        .size([w, h - 160]);


    var vis = d3.select("#d3").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .on('mouseup', mouseup)
        .on('dblclick', dblclick)
        .on('click touch', click);

    // to put images
    var defs = vis.append("svg:defs");
    defs.append('svg:filter')
            .attr('id', 'hue')
            .attr('primitiveUnits', "userSpaceOnUse")
            .append('svg:feImage')
              .attr('xlink:href', '/images/hue.jpg');
    
    var selectNode = {},
        $selectNode = jQuery("#selectNode");

    selectNode.$element = $selectNode;
    selectNode.radius = parseFloat($selectNode.css("width"));
    selectNode.top = $selectNode.position().top;
    selectNode.highlighted = false;
    selectNode.center = {
      y : selectNode.top + selectNode.radius/2,
      x : screen.width/2 
    };

    selectNode.contains = function(d) {
      return Math.pow(d.x - this.center.x, 2) + 
              Math.pow(d.y - this.center.y, 2) < Math.pow(this.radius, 2);
    };

    d3.json("js/flare.json", function(json) {
      root = json;
      root.fixed = true;
      root.x = w / 2;
      root.y = h / 2 - 80;
      update();
    });


    function update() {
      var nodes = flatten(root),
          links = d3.layout.tree().links(nodes);

      // Restart the force layout.
      force
          .nodes(nodes)
          .links(links)
          .start();

      // Update the links…
      link = vis.selectAll("line.link")
          .data(links, function(d) { return d.target.id; });

      // Enter any new links.
      link.enter().insert("svg:line", ".node")
          .attr("class", "link")
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      // Exit any old links.
      link.exit().remove();

      // Update the nodes…
      node = vis.selectAll("circle.node")
          .data(nodes, function(d) { return d.id; });

      node.transition()
          .attr("r", function(d) { 
            if (d == _selectedNode) {
              return 30;
            }
            return d.children ? 4.5 : Math.sqrt(d.size) / 5; 
          });

      // Enter any new nodes.
      node.enter().append("svg:circle")
          .attr("class", function(d) { return "node id" + d.index})
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) { return (d.children ? 4.5 : Math.sqrt(d.size) / 5); })
          .on("click", click)
          .on("mousedown", mousedown)
          .on("mousemove", mousemove)
          .on("drag", mousemove)
          .style("fill", color)
          .call(force.drag()
            // Attracting force towards the selecting node
            .on("drag.force", function(d, i) {
              d.px = d3.event.x, 
              d.py = d3.event.y;
              if (d == _selectedNode) {
                selectNode.highlighted = (d3.event.y - selectNode.top) >= -100;
                selectNode.$element.toggleClass("open", selectNode.highlighted);
                
                if (selectNode.highlighted) {
                  var distanceToCenterX = selectNode.center.x - d.x,
                      distanceToCenterY = selectNode.center.y - d.y;

                  d.px = selectNode.center.x - distanceToCenterX/1.4;
                  d.py = selectNode.center.y - distanceToCenterY/1.4;
                }
              }
              force.resume(); // restart annealing
            }));
      // Exit any old nodes.
      node.exit().remove();
    }

    function tick() {
      link.attr("x1", function(d) { return ( false && selectNode.highlighted && d.source == _selectedNode? selectNode.center.x: d.source.x); })
          .attr("y1", function(d) { return (false && selectNode.highlighted && d.source == _selectedNode? selectNode.center.y: d.source.y); })
          .attr("x2", function(d) { return (false && selectNode.highlighted && d.target == _selectedNode? selectNode.center.x: d.target.x); })
          .attr("y2", function(d) { return (false && selectNode.highlighted && d.target == _selectedNode? selectNode.center.y: d.target.y); });

      node.attr("cx", function(d) { return (false && selectNode.highlighted && d == _selectedNode? selectNode.center.x: d.x); })
          .attr("cy", function(d) { return(false && selectNode.highlighted && d == _selectedNode? selectNode.center.y: d.y); });
    }

    // Color leaf nodes orange, and packages white or blue.
    function color(d) {
      return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
    }

    // Toggle children on click.
    function click(d) {

      // click after drag on node
      if (d3.event.defaultPrevented && _selectedNode != undefined) {
        mouseup(d);
        return; // ignore drag
      }

      // clicking background
      if (d == undefined)  {
        window.spacebrewInspector.closeView();
        return;
      }


      // click on node
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update();
    }

    var _mousedown = false,
        _selectedNode = null;

    // Toggle children on click.
    function mousedown(d) {
      _selectedNode = d;
      _mousedown = true;

      update();
    }

    // Toggle children on click.
    function mouseup(d) {
      if (_selectedNode == null) {
        click();
        return;
      }
      selectNode.highlighted = false;
      selectNode.$element.toggleClass("open", false);
      if (selectNode.contains(_selectedNode)) {
        window.spacebrewInspector.open();
        _selectedNode = d;
      } 
      _mousedown = false;
      _selectedNode = null;
      update();
    }

    // Toggle children on click.
    function mousemove(d) {
      if (d == _selectedNode) {
        if (selectNode.highlighted) {
          // SELECTED CIRCLE
          vis.select("circle.id" + d.index)
          .attr("r", 30);
        } 

        if (!_mousedown) return;
      }
      update();
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {
      var nodes = [], i = 0;

      function recurse(node) {
        if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
        if (!node.id) node.id = ++i;
        nodes.push(node);
        return node.size;
      }

      root.size = recurse(root);
      return nodes;
    }

    // Manage clicks to background to bring it to the front
    function dblclick(event) {
      console.log("double");
    }
  });

    