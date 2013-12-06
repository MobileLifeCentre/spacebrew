define(["App", "marionette", "views/MessageView", "collections/MessageCollection"],
    function(app, Marionette, MessageView, MessageCollection) {
        var MessagesView = Marionette.CollectionView.extend({
            itemView: MessageView,

            selectedItem: {},

            initialize: function() {
            }
        });

        return MessagesView;
    }
);