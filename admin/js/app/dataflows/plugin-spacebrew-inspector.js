define(["dataflow", "dataflows/plugin-spacebrew-inputs", "dataflows/plugin-spacebrew-outputs"],
  function (Dataflow, InputStore, OutputStore) {
  var Inspector = Dataflow.prototype.plugin("spacebrew-inspector");

  window.spacebrewInspector = Inspector;
  var _open = false, 
      _inputs = false, 
      _outputs = false,
      returnToOrigin;

  Inspector.initialize = function (dataflow) {
    var template = 
      '<div class="dataflow-plugin-inspector dataflow-card ">' +
        '<div class="dataflow-node-inspector dataflow-node">' +
          '<div class="dataflow-plugin-inspector-title">' +
            '<h1 class="dataflow-node-inspector-label" style="text-align:left; pointer-events: none">Light Bulb</h1>' +
          '</div>' + 
          '<div class="dataflow-node-ports">\
              <div class="dataflow-node-ins">\
                <ul class="undefined">\
                  <li class="dataflow-port dataflow-in all ui-droppable">\
                    <span class="dataflow-port-plug in ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                    <span class="dataflow-port-hole in ui-draggable" title="drag to make new wire"></span>\
                    <span class="dataflow-port-label in" title="">Red</span>\
                  </li>\
                  <li class="dataflow-port dataflow-in string ui-droppable">\
                    <span class="dataflow-port-plug in ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                    <span class="dataflow-port-hole in ui-draggable" title="drag to make new wire"></span>\
                    <span class="dataflow-port-label in" title="">Green</span>\
                  </li>\
                  <li class="dataflow-port dataflow-in int ui-droppable">\
                    <span class="dataflow-port-plug in ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                    <span class="dataflow-port-hole in ui-draggable" title="drag to make new wire"></span>\
                    <span class="dataflow-port-label in" title="">Blue</span>\
                  </li>\
                  <li class="dataflow-port dataflow-in bang ui-droppable">\
                    <span class="dataflow-port-plug in ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                    <span class="dataflow-port-hole in ui-draggable" title="drag to make new wire"></span>\
                    <span class="dataflow-port-label in" title="">Intensity</span>\
                  </li>\
                </ul>\
              </div> \ ' +
             '<div class="dataflow-node-outs">\
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
              </div> \ ' +
            '</div>' +
          '</div>';
    var $inspector = $(template);
    var $dragger = $($inspector.find(".dataflow-plugin-side-dragger"));
    var $title = $($inspector.find(".dataflow-node-inspector-label"));

    dataflow.$el.prepend($inspector);
    var _moving = false;
    
    var max = 100,
        min = -100;

    // Manage drag and drop
    $inspector.on('mousedown touchstart', function (event) {
      event.preventDefault();

      _moving = true;
    });

    returnToOrigin = function() {
      $inspector.css({
        bottom: (_open? -12.5 : -max) + "%",
        left: (_outputs? "-37.5%" : (_inputs? "62.5%"  : "12.5%"))
      });
      $title.css({
        "text-align": (_outputs? "right" : "left")
      });
    };
    returnToOrigin();


    $inspector.on('mouseup touchcancel', function (event) {
      event.preventDefault();

      if (_moving) {
        returnToOrigin();
      }
      _moving = false;
    });

    $inspector.on('mousemove touchmove', function(event) {
      event.preventDefault();

      if (!_moving) return;
      $inspector.css({
        right: (Math.max(Math.min(event.pageX/screen.width*100, max), min) - max) + "%"
      });
    });

    $inspector.on('dblclick touchend', function(event) {
      event.preventDefault();

      _open = !_open;
      returnToOrigin();
      return false;
    });
  };

  Inspector.open = function() {
    _open = true;
    returnToOrigin();
  };

  Inspector.setInputViewOpen = function(open) {
    _inputs = open;
    if (returnToOrigin) returnToOrigin();
  }

  Inspector.setOutputViewOpen = function(open) {
    _outputs = open;
    if (returnToOrigin) returnToOrigin();
  }

  Inspector.closeView = function() {
    _inputs = _outputs = _open = false;
    InputStore.closeView();
    OutputStore.closeView();
    if (returnToOrigin) returnToOrigin();
  }
});
