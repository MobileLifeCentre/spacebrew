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

    // Taken from: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color
    function shadeColor(color, percent) {   
        var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    }

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
      node = vis.selectAll("g.node")
          .data(nodes, function(d) { return d.id; });


      // Animation of grabbing a circle
      node.select("circle")
          .transition()
          .attr("r", function(d) { 
            if (d == _selectedNode) {
              return 50;
            }
            return d.children ? 4.5 : d.size; 
          })
          .style("fill", function(d) { 
            if (d == _selectedNode) {
              return shadeColor(color(d), 20);
            }

            return color(d); 
          });
          

      // Enter any new nodes.
      var newNodes = node.enter().append("g")
        .attr("class", function(d) { return "node id" + d.index})
        .attr("transform", function(d){ return "translate("+d.x+","+ d.y+")"})
        .on("click", click)
        .on("mousedown", mousedown)
        .call(force.drag()
            // Attracting force towards the selecting node
            .on("drag.force", function(d, i) {
              d.px = d3.event.x, 
              d.py = d3.event.y;

              // Magnetic field when approaching selectNode
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
            }));

        newNodes.append("svg:circle")
          .attr("r", function(d) { return (d.children ? 4.5 : d.size); })
          .style("fill", color);

        newNodes.append("text")
          .attr("dx", 12)
          .attr("dy", ".35em")
          .attr("fill", "white")
          .text(function(d) { return d.name });

      // Exit any old nodes.
      node.exit().remove();
    }

    function tick() {
      link.attr("x1", function(d) { return d.source.x;})
          .attr("y1", function(d) { return d.source.y;})
          .attr("x2", function(d) { return d.target.x;})
          .attr("y2", function(d) { return d.target.y;});

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
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

    var _selectedNode = null;

    // Toggle children on click.
    function mousedown(d) {
      _selectedNode = d;

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
      _selectedNode = null;
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
  });

    