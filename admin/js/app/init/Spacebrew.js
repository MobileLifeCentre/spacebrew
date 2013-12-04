define(["app", "controllers/spacebrewController"], function(app, spacebrewController) {
	var name = gup('name') || window.location.href; 
	var server = gup('server') || 'localhost';
	var port = gup('port') || '9000';
	var debug = gup('debug') || false;
	var ws;

	var reconnect_timer = undefined;
	var setupWebsocket = function() {
		ws = new WebSocket("ws://"+server+":" + Number(port));

		ws.onopen = function() {
			console.log("WebSockets connection opened");
			var adminMsg = { 
				"admin": [
					{"admin": true}
				]
			};
			ws.send(JSON.stringify(adminMsg));

			///////////////////////////////////////////
			// ADMIN RECONNECT FUNCTIONALITY
			if (reconnect_timer) {
				console.log("[ws.onopen] reconnected successfully - clearing timer");
				reconnect_timer = clearTimeout(reconnect_timer);
				reconnect_timer = undefined;
			}
			///////////////////////////////////////////
		};

		ws.onmessage = function(e) {
			if (debug) console.log("Got WebSockets message:");
			if (debug) console.log(e);

			var json = JSON.parse(e.data);
			if (!handleMsg(json)){
				for(var i = 0, end = json.length; i < end; i++){
					handleMsg(json[i]);
				}
			}
		};

		ws.onclose = function() {
			console.log("[ws.onclose] WebSockets connection closed");

			///////////////////////////////////////////
			// ADMIN RECONNECT FUNCTIONALITY
			if (!reconnect_timer) {
				reconnect_timer = setInterval(function() {
					console.log("[reconnect_timer] attempting to reconnect to spacebrew");
					removeAllClients();
					setupWebsocket();
				}, 5000);			
			}
			///////////////////////////////////////////
		};
	};

	var handleMsg = function(json) {
		if (json.config){
			spacebrewController.handleConfigMsg(json);
		} else if (json.message){
			spacebrewController.handleMessageMsg(json);
		} else if (json.route){
			spacebrewController.handleRouteMsg(json);
		} else if (json.remove){
			spacebrewController.handleRemoveMsg(json);
		} else if (json.admin){
			//do nothing
		} else {
			return false;
		}
		return true;
	};

	// Pampallugues
	var handleMessageMsg = function(msg) {
		app.vent.trigger("spacebrew:msg:message", msg);
	};

	var handleConfigMsg = function(msg) {
		app.vent.trigger("spacebrew:msg:config", msg);
	};

	var handleRemoveMsg = function(msg) {
		app.vent.trigger("spacebrew:msg:remove", msg);
	};

	var handleRouteMsg = function(msg) {
		app.vent.trigger("spacebrew:msg:route", msg);
	};

	//get the value of the requested key in the querystring
	//if the key does not exist in the query string, returns the empty string
	function gup( name ) {
	  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	  var regexS = "[\\?&]"+name+"=([^&#]*)";
	  var regex = new RegExp( regexS );
	  var results = regex.exec( window.location.href );
	  if( results == null )
	    return "";
	  else
	    return results[1];
	};


	return {
		start: setupWebsocket,
		send: function(message) {
			if (debug) {
				console.log("Sending", message);
			}
			ws.send(message);
		}
	}
});