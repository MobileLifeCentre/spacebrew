define(["App", "marionette", "views/ClientView", "collections/ClientCollection", "text!templates/selectcss.html"],
    function(app, Marionette, ClientView, ClientCollection, cssTemplate) {
    	app.clients = app.clients || new ClientCollection();
    	var NONE_SELECTED = {},
		    PUB_SELECTED = {},
		    SUB_SELECTED = {},
			self;

        var ClientsView = Marionette.CollectionView.extend({
            itemView: ClientView,

            collection: app.clients,

            cssTemplate: _.template(cssTemplate),

            selectedItem: {},

            currentState: NONE_SELECTED,

            ui : {
            },

            initialize: function() {
            	self = this;
            	app.vent.on("click:client", this.handleClick);
            },

            handleClick: function(itemView) {
            	if (self.currentState == NONE_SELECTED) {
            		self.firstClick(itemView);
            	} else {
            		self.secondClick(itemView);
            	}
            },

            updateCSS: function(cssData) {
                $("style#selectedCss").text(this.cssTemplate(cssData));
            },

            firstClick: function(itemView) {
				itemView.select();
				selectedItem = itemView;

				if (itemView.model.get("pub")) {
					this.currentState = PUB_SELECTED;
				} else {
					this.currentState = SUB_SELECTED;
				}
				this.updateCSS({
					id: itemView.model.get("ID"),
					type: itemView.model.get("type"),
					clicked: true,
					pub: itemView.model.get("role") == "publisher" ? true : false
				});
            },

            turnOffSelected: function() {
            	// TO-DO move code {
            	$("style#selectedCss").text('');
				$(".item.selected").removeClass('selected');
				$(".clientrow.selected").removeClass('selected');
				// }
            	this.currentState = NONE_SELECTED;
            },

            secondClick: function(itemView) {
            	var pubSelected = (this.currentState == PUB_SELECTED),
            		pub = itemView.model.get("role") == "publisher",
            		type = itemView.model.get("type");
            		
				//if we clicked in the same column as the first click,
				//then turn off 'selected' mode
				if ((pubSelected && pub) ||
						(!pubSelected && !pub)) {
					itemView.edit();
				} else {
					//only do something if we clicked on a similar-type item
					if (type == selectedItem.model.get("type")) {
						//trigger (un)routing
						var activeId = selectedItem.model.get('ID');
						var isSelected = selectedItem.isSelected();
						var myId = itemView.model.get("ID");
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