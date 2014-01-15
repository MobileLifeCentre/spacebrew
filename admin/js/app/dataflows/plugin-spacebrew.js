define(["App", "underscore", "dataflow", "collections/ClientCollection", "models/Client", "collections/RouteCollection", "models/Route", "dataflows/plugin-spacebrew-inspector"], 
  function(app, _, Dataflow, ClientCollection, Client, RouteCollection, Route) {
    var Spacebrew = Dataflow.prototype.plugin("spacebrew");

    // ==============
    // CLIENTS / Nodes
    // ==============
    var clients = new ClientCollection();
    app.vent.on("new:client", function(clientJSON) {
      var client = new Client(clientJSON);
      clients.add(client);
      Spacebrew.addNode(client).call();
      Spacebrew.update();
    });

    app.vent.on("delete:client", function(clientJSON) {
      Spacebrew.deleteNode(clientJSON);
    });

    // ==============
    // ROUTES / Edges
    // ==============
    var routes = new RouteCollection();
    var Edge = Dataflow.prototype.module("edge");

    app.vent.on("add:route", function(routeJSON) {
      Spacebrew.createEdge(routeJSON);
    });

    app.vent.on("remove:route", function(routeJSON) {
      // We find route
      var routeTarget = undefined; 
      routes.each(function(route) {
        if (route.equals(routeJSON)) {
          routeTarget = route;
        }
      });
      routes.remove(route);

      var publisher = routeJSON.publisher,
        subscriber = routeJSON.subscriber;

      // We find Edge
      var targetEdge = {};
      Spacebrew.dataflow.currentGraph.edges.each(function(edge) {
        if (edge.source.get("label") == routeJSON.publisher.name &&
            edge.target.get("label") == routeJSON.subscriber.name &&
            edge.source.parentNode.get("label") == routeJSON.publisher.clientName &&
            edge.target.parentNode.get("label") == routeJSON.subscriber.clientName) {
          targetEdge = edge;
        }
      });
      Spacebrew.dataflow.currentGraph.edges.remove(targetEdge);
    });

    // ==============
    // Messages
    // ==============
    app.vent.on("new:message", function(messageJSON) {
        Spacebrew.dataflow.currentGraph.nodes.each(function(node) {
          node.outputs.each(function(output) {
            if (output.get("label") == messageJSON.name) {
              output.view.flickr();
            }
          })
        });
    });

    Spacebrew.initialize = function(dataflow) {
      var $container = $('<div class="dataflow-plugin-overflow">');
      var $Spacebrew = $('<ul class="dataflow-plugin-spacebrew" />');
      $container.append($Spacebrew);
      Spacebrew.dataflow = dataflow;

      // Communication dataflow -> Spacebrew
      dataflow.on("edge:remove", function(graph, edge) {
        app.vent.trigger("delete:route", edge);
      });

      dataflow.on("edge:add", function(graph, edge) {
        app.vent.trigger("create:route", edge);
      });

      Spacebrew.createEdge = function(routeJSON) {
        var route = new Route(routeJSON);
        routes.add(route);

        var publisher = routeJSON.publisher,
            subscriber = routeJSON.subscriber;

        var publisherClient = undefined,
            subscriberClient = undefined;

        // We find publisher and subscriber
        clients.each(function(client) {
          var clientName = client.get("name"),
              clientRemoteAddress = client.get("remoteAddress");

          if (clientName == publisher.clientName 
            && clientRemoteAddress == publisher.remoteAddress) {
            publisherClient = client;
          } 
          if (clientName == subscriber.clientName 
            && clientRemoteAddress == subscriber.remoteAddress) {
            subscriberClient = client;
          }
        });

        // We add the message
        publisherClient.get("publishers").each(function(message) {
          if (message.get("name") == publisher.name) {
            message.get("routes").add(route);
          }
        });

        subscriberClient.get("subscribers").each(function(message) {
          if (message.get("name") == subscriber.name) {
            message.get("routes").add(route);
          }
        });

        // Same for nodes
        var nodeSource,
            nodeTarget;

        Spacebrew.dataflow.currentGraph.nodes.each(function(node) {
          var client = node.get("client");

          if (client == publisherClient) {
            nodeSource = node;
          } 
          if (client == subscriberClient) {
            nodeTarget = node;
          }
        });

        var portSource,
            portTarget;

        nodeSource.outputs.each(function(port) {
          if (port.get("label") == publisher.name) {
            portSource = port;
          }
        });

        nodeTarget.inputs.each(function(port) {
          if (port.get("label") == subscriber.name) {
            portTarget = port;
          }
        });

        var edge = {
          source: {
            node: nodeSource.id,
            port: portSource.id
          },
          target: {
            node: nodeTarget.id,
            port: portTarget.id
          },
          parentGraph: Spacebrew.dataflow.currentGraph,
          preview: false
        };

        edge.id = edge.source.node+":"+edge.source.port+"::"+edge.target.node+":"+edge.target.port;

        Spacebrew.dataflow.currentGraph.edges.add(new Edge.Model(edge));
      }

      Spacebrew.deleteNode = function(client) {
        var targetNode;
        dataflow.currentGraph.nodes.each(function(node) {
          if (node.client.equals(client)) {
            clients.remove(node.client);
            targetNode = node;
          }
        });

        dataflow.currentGraph.nodes.remove(targetNode);
      };

      Spacebrew.addNode = function(client, x, y) {
        return function() {
          // Deselect others
          dataflow.currentGraph.view.$(".dataflow-node").removeClass("ui-selected");

          // Current zoom
          zoom = dataflow.currentGraph.get('zoom');
          Spacebrew.update();
          // Find vacant id
          var id = 1;
          while (dataflow.currentGraph.nodes.get(id)){
            id++;
          }
          // Position
          x = x===undefined ? 500*id : x;
          y = y===undefined ? 200 : y;
          x = x/zoom - dataflow.currentGraph.get("panX");
          y = y/zoom - dataflow.currentGraph.get("panY");

          // Add node
          var newNode = new dataflow.nodes["dataflow-spacebrew"].Model({
            id: id,
            client: client,
            x: x,
            y: y,
            parentGraph: dataflow.currentGraph
          });
          dataflow.currentGraph.nodes.add(newNode);

          // Select and bring to top
          newNode.view.select();
        };
      };

      var itemTemplate = '<li><a class="button add"><i class="icon-<%- icon %>"></i></a><span class="name"><%- name %></span><span class="description"><%-description %></span></li>';

      var addSpacebrewItem = function(client) {
        var name = client.get("name");

        // We just show as an item if it is not added already
        var alreadyAdded = false;
        Spacebrew.dataflow.currentGraph.nodes.each(function (node, nodeName) {
          if (name == node.get("label")) {
            alreadyAdded = true;
            return;
          }
        });
        if (alreadyAdded) return;

        var $item = $(_.template(itemTemplate, {
          name: name,
          description: client.remoteAddress,
          icon: client.icon ? client.icon : 'sign-blank'
        }));
        var addButton = $('.button', $item)
          .attr("title", "click or drag")
          .draggable({
            helper: function(){
              var helper = $('<div class="dataflow-node helper"><div class="dataflow-node-title">'+name+'</div></div>');
              dataflow.$el.append(helper);
              return helper;
            },
            stop: function(event, ui) {
              Spacebrew.addNode(client, ui.position.left, ui.position.top).call();
            }
          })
          .click(Spacebrew.addNode(client));
        $Spacebrew.append($item);
      };

      Spacebrew.update = function(options) {
        options = options ? options : {};

        $Spacebrew.empty();
        clients.each(function (client) {
          addSpacebrewItem(client);
        });
      };
      this.update();

      dataflow.addPlugin({
        id: "spacebrew", 
        label: "spacebrew",
        name: "", 
        menu: $container, 
        icon: "minus",
        pinned: false
      });

      Spacebrew.onSearch = function (text, callback) {
        var results = [];
        _.each(dataflow.nodes, function (node, name) {
          if (Spacebrew.excluded.indexOf(name) !== -1) {
            return;
          }
          if (name.toLowerCase().indexOf(text.toLowerCase()) === -1) {
            return;
          }
          results.push({
            source: 'spacebrew',
            icon: 'fa-connect',
            action: function () {
              Spacebrew.addNode(node).call();
            },
            label: name,
            description: node.description
          });
        });
        callback(results);
      };

      dataflow.plugin('search').addCommand({
        names: ['add', 'a', 'add component', 'add node'],
        args: ['component'],
        preview: function (text, callback) {
          var results = [];
          _.each(dataflow.nodes, function (node, name) {
            if (Spacebrew.excluded.indexOf(name) !== -1) {
              return;
            }
            if (name.toLowerCase().indexOf(text.toLowerCase()) === -1) {
              return;
            }
            results.push({
              icon: 'plus',
              label: name,
              description: node.description,
              item: node
            });
          });
          callback(results);
        },
        execute: function (item) {
          Spacebrew.addNode(item).call();
        }
      });
    };
  }
);