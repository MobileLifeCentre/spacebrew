define(["jquery", "underscore", "marionette","App", "models/Route", "text!templates/route.html"],
    function($, _, Marionette, app, Route, template) {
        var RouteView = Marionette.ItemView.extend({
            template: _.template(template),
            className: "route",
            ui: {

            },

            modelEvents: {
                "destroy": "removeRoute"
            },

            initialize: function() {
                this.addRoute();
            },

            events: {
                "click .btn-remove" : "removeRoute"
            },

            addRoute: function() {
                var model = this.model.attributes;

                this.addToJSPlumb(model);
            },

            templateHelpers: {
                
            },

            removeRoute: function() {
                this.close();
            },

            onClose: function() {
                var model = this.model.attributes;
                this.removeFromJSPlumb(model);
            },

            addToJSPlumb: function(model) {
                // We get IDs
                var item = model.publisher;
                var sourceid = this.getCommItemSelector("pub", item.clientName, item.remoteAddress, item.name, item.type);
                item = model.subscriber;
                var targetid = this.getCommItemSelector("sub", item.clientName, item.remoteAddress, item.name, item.type);

                // We get the endpoints
                var source = myPlumb.endpoints[sourceid];
                var target = myPlumb.endpoints[targetid];
                source.setImage("img/node-closed.png");
                target.setImage("img/node-closed.png");

                // We update the binding with jsPlumb
                if (!myPlumb.connections[sourceid]) {
                    myPlumb.connections[sourceid] = {};
                }

                if (!myPlumb.connections[sourceid][targetid]) {
                    var connection = jsPlumb.connect({
                        source: source,
                        target: target
                    }, myPlumb.connectionParams);
                    myPlumb.connections[sourceid][targetid] = connection;
                }

                this.handleSelecting(sourceid, targetid);
                
            },

            removeFromJSPlumb: function(model) {
                // We get IDs
                var item = model.publisher;
                var sourceid = this.getCommItemSelector("pub", item.clientName, item.remoteAddress, item.name, item.type);
                item = model.subscriber;
                var targetid = this.getCommItemSelector("sub", item.clientName, item.remoteAddress, item.name, item.type);

                if (myPlumb.connections[sourceid] && myPlumb.connections[sourceid][targetid]){
                    jsPlumb.detach(myPlumb.connections[sourceid][targetid]);

                    this.handleUnselecting(sourceid, targetid);
                    myPlumb.connections[sourceid][targetid] = undefined;
                }
            },

            handleSelecting: function(sourceid, targetid) {
                // TO-DO Handle selecting, possible to remove 
                $("#" + sourceid).addClass(targetid);
                $("#" + targetid).addClass(sourceid);
            },

            handleUnselecting: function(subId, pubId) {
                var subscriber = $("#" + subId);
                var publisher = $("#" + pubId);
                subscriber.removeClass(pubId);
                publisher.removeClass(subId);

                if (subscriber.attr('class').indexOf('pub_') < 0){
                    myPlumb.endpoints[subId].setImage("img/node-open.png");
                }
                if (publisher.attr('class').indexOf('sub_') < 0){
                    myPlumb.endpoints[pubId].setImage("img/node-open.png");
                }
            },

            getCommItemSelector: function(publisher, clientName, remoteAddress, name, type) {
                return publisher + "_" 
                    + clientName.Safetify() + "_" 
                    + remoteAddress.Safetify() + "_" 
                    + name.Safetify() + "_" 
                    + type.Safetify();
            }
        });

        // Returns the View class
        return RouteView;
    }

);