define(["dataflow"],
  function (Dataflow) {
  var Outputs = Dataflow.prototype.plugin("spacebrew-inputs");
  var _open = false,
      $outputs,
      $dragger,
      max;

  var returnToOrigin = function() {
    window.spacebrewInspector.setOutputViewOpen(_open);
    $outputs.css({
      right: (_open? 0 : -max) + "%"
    });
    $dragger.css({
      left: (_open? 0 : -52) + "px"
    });
  };

  Outputs.initialize = function (dataflow) {
    var template = 
      '<div class="dataflow-plugin-inputs dataflow-card">' +
        '<div class="dataflow-plugin-side-dragger dataflow-card"><i class="icon-info"></i></div>' + 
        '<div class="dataflow-node-inspector">' +
          '<div class="dataflow-plugin-inspector-title">' +
            '<h1 class="dataflow-node-inspector-label" style="text-align:right">Inputs</h1>' +
          '</div>' + 
          '<div class="dataflow-node-inspector-inputs">' + 
              '<div class="dataflow-node"  style="height: 250px">\
                <div class="outer">\
                </div>\
                <div class="dataflow-node-header">\
                  <h1 class="dataflow-node-title" title="test: test">Light bulb at ML</h1>\
                </div>\
                <div class="dataflow-node-ports">\
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
                  </div> \
                </div> \
              </div>' + 
              '<div class="dataflow-node"  style="height: 100px">\
                <div class="outer">\
                </div>\
                <div class="dataflow-node-header">\
                  <h1 class="dataflow-node-title" title="test: test">Lab Lights at ML</h1>\
                </div>\
                <div class="dataflow-node-ports">\
                  <div class="dataflow-node-ins">\
                    <ul class="undefined">\
                      <li class="dataflow-port dataflow-in all ui-droppable">\
                        <span class="dataflow-port-plug in ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                        <span class="dataflow-port-hole in ui-draggable" title="drag to make new wire"></span>\
                        <span class="dataflow-port-label in" title="">On</span>\
                      </li>\
                    </ul>\
                  </div> \
                </div> \
              </div>' + 
              '<div class="dataflow-node"  style="height: 250px">\
                <div class="outer">\
                </div>\
                <div class="dataflow-node-header">\
                  <h1 class="dataflow-node-title" title="test: test">Light bulb at ML</h1>\
                </div>\
                <div class="dataflow-node-ports">\
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
                  </div> \
                </div> \
              </div>' + 
              '<div class="dataflow-node"  style="height: 100px">\
                <div class="outer">\
                </div>\
                <div class="dataflow-node-header">\
                  <h1 class="dataflow-node-title" title="test: test">Lab Lights at ML</h1>\
                </div>\
                <div class="dataflow-node-ports">\
                  <div class="dataflow-node-ins">\
                    <ul class="undefined">\
                      <li class="dataflow-port dataflow-in all ui-droppable">\
                        <span class="dataflow-port-plug in ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                        <span class="dataflow-port-hole in ui-draggable" title="drag to make new wire"></span>\
                        <span class="dataflow-port-label in" title="">On</span>\
                      </li>\
                    </ul>\
                  </div> \
                </div> \
              </div>' + 

              '<div class="dataflow-node"  style="height: 250px">\
                <div class="outer">\
                </div>\
                <div class="dataflow-node-header">\
                  <h1 class="dataflow-node-title" title="test: test">Light bulb at ML</h1>\
                </div>\
                <div class="dataflow-node-ports">\
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
                  </div> \
                </div> \
              </div>' + 
              '<div class="dataflow-node"  style="height: 100px">\
                <div class="outer">\
                </div>\
                <div class="dataflow-node-header">\
                  <h1 class="dataflow-node-title" title="test: test">Lab Lights at ML</h1>\
                </div>\
                <div class="dataflow-node-ports">\
                  <div class="dataflow-node-ins">\
                    <ul class="undefined">\
                      <li class="dataflow-port dataflow-in all ui-droppable">\
                        <span class="dataflow-port-plug in ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                        <span class="dataflow-port-hole in ui-draggable" title="drag to make new wire"></span>\
                        <span class="dataflow-port-label in" title="">On</span>\
                      </li>\
                    </ul>\
                  </div> \
                </div> \
              </div>' + 
              '<div class="dataflow-node"  style="height: 250px">\
                <div class="outer">\
                </div>\
                <div class="dataflow-node-header">\
                  <h1 class="dataflow-node-title" title="test: test">Light bulb at ML</h1>\
                </div>\
                <div class="dataflow-node-ports">\
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
                  </div> \
                </div> \
              </div>' + 
              '<div class="dataflow-node"  style="height: 100px">\
                <div class="outer">\
                </div>\
                <div class="dataflow-node-header">\
                  <h1 class="dataflow-node-title" title="test: test">Lab Lights at ML</h1>\
                </div>\
                <div class="dataflow-node-ports">\
                  <div class="dataflow-node-ins">\
                    <ul class="undefined">\
                      <li class="dataflow-port dataflow-in all ui-droppable">\
                        <span class="dataflow-port-plug in ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                        <span class="dataflow-port-hole in ui-draggable" title="drag to make new wire"></span>\
                        <span class="dataflow-port-label in" title="">On</span>\
                      </li>\
                    </ul>\
                  </div> \
                </div> \
              </div>' + 
              '<div class="dataflow-node"  style="height: 250px">\
                <div class="outer">\
                </div>\
                <div class="dataflow-node-header">\
                  <h1 class="dataflow-node-title" title="test: test">Light bulb at ML</h1>\
                </div>\
                <div class="dataflow-node-ports">\
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
                  </div> \
                </div> \
              </div>' + 
              '<div class="dataflow-node"  style="height: 100px">\
                <div class="outer">\
                </div>\
                <div class="dataflow-node-header">\
                  <h1 class="dataflow-node-title" title="test: test">Lab Lights at ML</h1>\
                </div>\
                <div class="dataflow-node-ports">\
                  <div class="dataflow-node-ins">\
                    <ul class="undefined">\
                      <li class="dataflow-port dataflow-in all ui-droppable">\
                        <span class="dataflow-port-plug in ui-draggable ui-draggable-disabled" title="drag to edit wire"></span>\
                        <span class="dataflow-port-hole in ui-draggable" title="drag to make new wire"></span>\
                        <span class="dataflow-port-label in" title="">On</span>\
                      </li>\
                    </ul>\
                  </div> \
                </div> \
              </div>' + 

          '</div>' + 
        '</div>' +
      '</div>';
    $outputs = $(template);
    $dragger = $($outputs.find(".dataflow-plugin-side-dragger"));

    dataflow.$el.prepend($outputs);
    var _moving = false,
        min = -35.5;
    
    max = 35.5;

    // Manage drag and drop
    $outputs.on('mousedown touchstart', function (event) {
      event.preventDefault();

      _moving = true;
    });

    returnToOrigin();


    $outputs.on('mouseup touchcancel', function (event) {
      event.preventDefault();

      if (_moving) {
        returnToOrigin();
      }
      _moving = false;
    });

    $outputs.on('mousemove touchmove', function(event) {
      event.preventDefault();

      if (!_moving) return;
      $outputs.css({
        right: (Math.max(Math.min(event.pageX/screen.width*100, max), min) - max) + "%"
      });
    });

    $outputs.on('dblclick touchend', function(event) {
      event.preventDefault();

      _open = !_open;
      returnToOrigin();
      return false;
    });

    // dragger
    $dragger.on("click", function(event) {
      event.preventDefault();

      _open = !_open;
      returnToOrigin();
    });
  };

  Outputs.closeView = function() {
    _open = false;
    returnToOrigin();
  }

  return Outputs;
});
