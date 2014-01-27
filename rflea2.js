var MongoClient = require('mongodb').MongoClient,
    db = new DB("mongodb://localhost:27017"),
    logger = require('./logger'),
    rflea = exports;

rflea.translateIO = function(version, device, io) {
    return db.getIO(version, device, io);
};

rflea.translateName = function(version, device) {
    return db.getDevice(version, device);
};

rflea.translateMessage = function (message, callback) {
    db.getDevice(message["config"]["version"], message["config"]["device"], function(device) { 
        processDevice(message, device, callback);
    });
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

            pub.name = io.name;
            pub.type = io.type;

            newPublishers[i] = pub;
        }
        message["config"]["publish"]["messages"] = newPublishers;

        for (var i in subscribers) {
            var sub = subscribers[i],
                io = device.ios[sub.name];

            sub.name = io.name;
            sub.type = io.type;

            newSubscribers[i] = sub;
        }
        message["config"]["subscribe"]["messages"] = newSubscribers;
    } catch (e) {
        logger.log("debug", "[rflea error] something wrong happened when translating " + message);
    }

    callback(message);
}


function DB(url) {
    var _rflea = undefined; 
    // Connect to the db
    MongoClient.connect(url, function(err, db) {
      if(!err) {
        _rflea = db.collection('rflea');
        console.log("We are connected");
      }
    });

    function getDevice(version, device, callback) {
        var result = rflea.find({});
        console.log(result);
    }

    function getIO(version, device, io) {
        var connection = new Firebase(url+"versions/"+version+"/devices/"+device+"/ios/"+io).once('value', function(data) {
          return data.name;
        });
    }

    return {
        getDevice: getDevice,
        getIO: getIO
    }
};