define(["jquery","backbone", "models/Message"],
  function($, Backbone, Message) {
    var MessageCollection = Backbone.Collection.extend({
    	model: Message
    });

    return MessageCollection;
  }
);