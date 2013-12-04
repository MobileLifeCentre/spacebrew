var setupUserEvents = function(){
	//clicking & hovering over publishers and subscribers is handled when
	//the publishers and subscribers are created in wsevents.js

	//setup click handler when nothing else is clicked
	$(document.body).click(clickBody);
};

var clickInfo = function(event){
	if (debug) console.log("clicked!");
	$("#"+event.target.id.substr("button_".length)).toggleClass('show');
};

var clickBody = function(event){
	event.preventDefault();
	//if we are in a selected state, then when we click somewhere innocuous, 
	//we should go to an unselected state
	if (currState != NONE_SELECTED){
		if (!event.target.classList.contains("itemwrapper")){
			turnOffSelected();
		}
	}
};

var overItem = function(event){
	event.preventDefault();
	if (currState == NONE_SELECTED){
		var item = $(event.target).children(".item");
		var pub = item.hasClass("publisher");
		var type = getItemType(item);
		var itemId = item.prop('id');
		var pieces = itemId.split('_');
		var context = {
			type:type,
			id:item.prop('id'),
			pub:pub,
			clientid:pieces[1]+'_'+pieces[2]
		};
		if (debug) console.log(pieces[1]+'_'+pieces[2]);
		$("style#selected").text(cssSelectedTemplate(context));
	}
};

var outItem = function(event){
	event.preventDefault();
	if (currState == NONE_SELECTED){
		$("style#selected").text('');
	}
};

var clickItem = function(event){
	//event.preventDefault();
	var item;
	if (event.target.classList.contains("deletebutton")){
		item = $(event.target).parent();
	} else {
		item = $(event.target).children(".item");
	}
	var pub = item.hasClass("publisher");
	var type = getItemType(item);
	selectedItem = item;
	if (currState == NONE_SELECTED){
		firstClick(item, type, pub);
	} else {
		secondClick(item, type, pub);
	}
};

var firstClick = function(item, type, pub){
	item.addClass("selected");
	item.closest(".clientrow").addClass("selected");
	var context = {
		clicked:true,
		type:type,
		id:item.prop('id'), 
		pub:pub
	};
	var cssFile = cssTypeTemplate(context);
	if (debug) console.log('turning on ' + cssFile);
	$("style#selected").text(cssSelectedTemplate(context));// attr('href',cssFile);
	if (pub){
		currState = PUB_SELECTED;
	} else {
		currState = SUB_SELECTED;
	}
};

var turnOffSelected = function(){
	if (debug) console.log('turning off');
	$("style#selected").text('');
	$(".item.selected").removeClass('selected');
	$(".clientrow.selected").removeClass('selected');
	currState = NONE_SELECTED;
}

var secondClick = function(item, type, pub){
	var pubSelected = (currState == PUB_SELECTED);
	//if we clicked in the same column as the first click,
	//then turn off 'selected' mode
	if ((pubSelected && pub) ||
			(!pubSelected && !pub)) {
		turnOnEdit(item, type, pub);
		return;
	} else {
		var activeItem = $(pubSelected ? ".publisher.selected" : ".subscriber.selected");
		var activeType = getItemType(activeItem);
		//only do something if we clicked on a similar-type item
		if (type == activeType){
			//trigger (un)routing
			var activeId = activeItem.prop('id');
			var isSelected = item.hasClass(activeId);
			var myId = item.prop('id');
			var pubId = pubSelected ? activeId : myId;
			var subId = pubSelected ? myId : activeId;
			//if this is selected, then we need to unroute it
			if (isSelected){
				removeRoute(pubId, subId);
			} else {
			//otherwise, route it
				addRoute(pubId, subId);
			}
		}
	}
	turnOffSelected();
};

var firstClick = function(item, type, pub){
	item.addClass("selected");
	item.closest(".clientrow").addClass("selected");
	var context = {
		clicked:true,
		type:type,
		id:item.prop('id'), 
		pub:pub
	};
	var cssFile = cssTypeTemplate(context);
	if (debug) console.log('turning on ' + cssFile);
	$("style#selected").text(cssSelectedTemplate(context));// attr('href',cssFile);
	if (pub){
		currState = PUB_SELECTED;
	} else {
		currState = SUB_SELECTED;
	}
};

var turnOnEdit = function(item, type, pub) {
	item.addClass("editing");
	console.log("pepe");
	var context = {
		editing: true,
		type:type,
		id:item.prop('id'), 
		pub:pub
	};
	$("style#selected").text(cssSelectedTemplate(context));
};

var turnOffEdit = function() {
	if (debug) console.log('turning off editing');
	$("style#editing").text('');
	$(".item.editing").removeClass('editing');
};

var getItemType = function(_item){
	return _item.hasClass("boolean") ? "boolean" : _item.hasClass("string") ? "string" : _item.hasClass("number") ? "number" : "range";
};

var cssTypeTemplate = Handlebars.compile("css/{{pub}}_{{type}}.css");
var cssSelectedTemplate = Handlebars.compile(document.getElementById( 'active_css_handlebar' ).textContent);
