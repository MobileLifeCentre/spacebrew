var Firebase = require('firebase'),
    db = new DB('https://rflea.firebaseio.com/'),
    logger = require('./logger'),
    rflea = exports;

rflea.translateIO = function(version, device, io) {
    return db.getIO(version, device, io);
};

rflea.translateName = function(version, device) {
    return db.getDevice(version, device);
};

rflea.translateMessage = function (message, callback) {
    var version = message["config"]["version"],
        device = message["config"]["device"];

    if (version != undefined && device != undefined) {
        db.getDevice(message["config"]["version"], message["config"]["device"], function(device) { 
            processDevice(message, device, callback);
        });

        return true;
    } else {
        return false;
    }
};

function processDevice(message, device, callback) {
    try {
        publishers = message["config"]["publish"]["messages"],
        subscribers = message["config"]["subscribe"]["messages"],
        newPublishers = [],
        newSubscribers = []; 

        for (var i in publishers) {
            var pub = publishers[i],
                io = device.ios[pub.name];

            if (io != undefined) {
                pub.label = io.name;
                pub.type = io.type;
            }
            newPublishers[i] = pub;

        }
        message["config"]["publish"]["messages"] = newPublishers;

        for (var i in subscribers) {
            var sub = subscribers[i],
                io = device.ios[sub.name];

            if (io != undefined) {
                sub.label = io.name;
                sub.type = io.type;
            }

            newSubscribers[i] = sub;
        }
        message["config"]["subscribe"]["messages"] = newSubscribers;
    } catch (e) {
        logger.log("debug", "[rflea error] something wrong happened when translating " + e);
    }
    callback(message);
}


function DB(url) {
    function getDevice(version, device, callback) {
        new Firebase(url+"versions/"+version+"/devices/"+device).on('value', function(data) {
            callback(data.val());
        });
    }

    function getIO(version, device, io) {
        var connection = new Firebase(url+"versions/"+version+"/devices/"+device+"/ios/"+io).on('value', function(data) {
          return data.name;
        });
    }

    return {
        getDevice: getDevice,
        getIO: getIO
    }
};