define(["dataflow"],
  function (Dataflow) {
  var Inputs = Dataflow.prototype.plugin("spacebrew-outputs");
  var _open = false,
      $inputs,
      $dragger,
      max;

  var returnToOrigin = function() {
    window.spacebrewInspector.setInputViewOpen(_open);
    $inputs.css({
      left: (_open? 0 : -max) + "%"
    });
    $dragger.css({
      right: (_open? 0 : -52) + "px"
    });
  };

  var InputItem = Backbone.Model.extend({
    defaults: {
      source: '',
      icon: '',
      action: null,
      label: '',
      description: ''
    }
  });

  var InputCollection = Backbone.Collection.extend({
    model: InputItem,
    initialize: function (models, options) {
      if (!options) {
        options = {};
      }
      this.search = options.search;
    }
  });

  var InputView = Backbone.View.extend({
    tagName: 'li',
    template: '<i class="icon-<%- icon %>"></i><span class="name"><%- label %></span><span class="description"><%- description %></span>',
    events: {
      'click': 'clicked'
    },
    render: function () {
      this.$el.html(_.template(this.template, this.model.toJSON()));
    },
    clicked: function () {
      if (!this.model.get('action')) {
        return;
      }
      this.model.get('action')();
    }
  });

  Inputs.initialize = function (dataflow) {
    var template = 
      '<div class="dataflow-plugin-inputs dataflow-card outputs">' +
        '<div class="dataflow-plugin-side-dragger dataflow-card"><i class="icon-circle"></i></div>' + 
        '<div class="dataflow-node-inspector">' +
          '<div class="dataflow-plugin-inspector-title">' +
            '<h1 class="dataflow-node-inspector-label" style="text-align:left">Outputs</h1>' +
          '</div>' + 
          '<div class="dataflow-node-inspector-inputs">' + 
              '<div class="dataflow-node" style="height:200px">\
                <div class="outer">\
                </div>\
                <div class="dataflow-node-header">\
                  <h1 class="dataflow-node-title" title="test: test">PSMove</h1>\
                </div>\
                <div class="dataflow-node-ports">\
                  <div class="dataflow-node-outs">\
                    <ul class="undefined">\
                      <li class="dataflow-port dataflow-out all ui-droppable">\
                        <span class="dataflow-port-plug out ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                        <span class="dataflow-port-hole out ui-draggable" title="drag to make new wire"></span>\
                        <span class="dataflow-port-label out" title="">AccX</span>\
                      </li>\
                      <li class="dataflow-port dataflow-out string ui-droppable">\
                        <span class="dataflow-port-plug out ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                        <span class="dataflow-port-hole out ui-draggable" title="drag to make new wire"></span>\
                        <span class="dataflow-port-label out" title="">AccY</span>\
                      </li>\
                      <li class="dataflow-port dataflow-out int ui-droppable">\
                        <span class="dataflow-port-plug out ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                        <span class="dataflow-port-hole out ui-draggable" title="drag to make new wire"></span>\
                        <span class="dataflow-port-label out" title="">AccZ</span>\
                      </li>\
                    </ul>\
                  </div> \
                </div> \
              </div>' + 
              '<div class="dataflow-node" style="height: 100px">\
                <div class="outer">\
                </div>\
                <div class="dataflow-node-header">\
                  <h1 class="dataflow-node-title" title="test: test">Lab\'s Presence Sensor </h1>\
                </div>\
                <div class="dataflow-node-ports">\
                  <div class="dataflow-node-outs">\
                    <ul class="undefined">\
                      <li class="dataflow-port dataflow-out all ui-droppable">\
                        <span class="dataflow-port-plug out ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                        <span class="dataflow-port-hole out ui-draggable" title="drag to make new wire"></span>\
                        <span class="dataflow-port-label out" title="">Presence</span>\
                      </li>\
                    </ul>\
                  </div> \
                </div> \
              </div>' + 
          '</div>' + 
        '</div>' +
      '</div>';
    $inputs = $(template);
    $dragger = $($inputs.find(".dataflow-plugin-side-dragger"));

    dataflow.$el.prepend($inputs);
    var _moving = false,
        min = -35.5;
    max = 35.5;
       

    // Manage drag and drop
    $inputs.on('mousedown', function (event) {
      _moving = true;
    });

    returnToOrigin();

    $inputs.on('mouseup', function (event) {
      if (_moving) {
        returnToOrigin();
      }
      _moving = false;
    });

    $inputs.on('mousemove', function(event) {
      if (!_moving) return;
      $inputs.css({
        left: (Math.max(Math.min(event.pageX/screen.width*100, max), min) - max) + "%"
      });
    });

    $inputs.on('dblclick', function(event) {
      _open = !_open;
      returnToOrigin();
      event.preventDefault();
      return false;
    });

    // dragger
    $dragger.on("click", function(event) {
      _open = !_open;
      returnToOrigin();
      event.preventDefault();
    });
  };

  Inputs.closeView = function() {
    _open = false;
    returnToOrigin();
  }

  return Inputs;
});
