define(["App", "marionette", "views/ClientView", "collections/ClientCollection"],
    function(app, Marionette, ClientView, ClientCollection) {
    	app.clients = app.clients || new ClientCollection();
    	var NONE_SELECTED = {},
		    PUB_SELECTED = {},
		    SUB_SELECTED = {},
			self;

        var ClientsView = Marionette.CollectionView.extend({
            itemView: ClientView,

            collection: app.clients,

            selectedItem: {},

            currentState: NONE_SELECTED,

            initialize: function() {
            	self = this;
            	app.vent.on("click:client", this.handleClick);
            },

            handleClick: function(client) {
            	if (self.currentState == NONE_SELECTED) {
            		self.firstClick(client);
            	} else {
            		self.secondClick(client);
            	}
            },

            firstClick: function(client) {
            	var item = client.item;
            	client.clicked = true;

				client.view.select(client);
				selectedItem = client;

				if (client.pub) {
					this.currentState = PUB_SELECTED;
				} else {
					this.currentState = SUB_SELECTED;
				}
            },

            turnOffSelected: function() {
            	// TO-DO move code {
            	$("style#selectedCss").text('');
				$(".item.selected").removeClass('selected');
				$(".clientrow.selected").removeClass('selected');
				// }
            	this.currentState = NONE_SELECTED;
            },

            secondClick: function(client) {
            	var pubSelected = (this.currentState == PUB_SELECTED),
            		pub = client.pub,
            		item = client.item,
            		type = client.type;

				//if we clicked in the same column as the first click,
				//then turn off 'selected' mode
				if ((pubSelected && pub) ||
						(!pubSelected && !pub)) {
					client.clicked = false;
					client.view.edit(client);
				} else {
					//only do something if we clicked on a similar-type item
					if (type == selectedItem.type) {

						//trigger (un)routing
						var activeId = selectedItem.item.prop('id');
						var isSelected = item.hasClass(activeId);
						var myId = item.prop('id');
						var pubId = pubSelected ? activeId : myId;
						var subId = pubSelected ? myId : activeId;

						//if this is selected, then we need to unroute it
						if (isSelected) {
							app.vent.trigger("delete:route", {
								publisher: pubId, 
								subscriber: subId
							});
						} else {
							app.vent.trigger("create:route", {
								publisher: pubId, 
								subscriber: subId
							});
						}
					}
				}
				this.turnOffSelected();
            }
        });

        // Returns the View class
        return ClientsView;
    }
);