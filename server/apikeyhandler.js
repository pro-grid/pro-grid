// Store for ApiKeys
var ApiKeys = require('memory-cache');
ApiKeys.debug(true);

// Create, verify, update and delete
// Api Keys
// ApiKeyHandler

var async = require('async')
  , validator = require('validator')
  , uuid = require('node-uuid');

var ApiKeyHandler = function (client, key, callback) { // Create
  console.log('called ApiKeyHandler');
  var self = this;
  this.client = client;
  this.clientSession = {};
  this.key = key;
  async.series({
    checkIfExists: function(callback) {
      self.clientSession = ApiKeys.get(client.id);
      callback(!self.clientSession || null);
    },
    throttle: function(callback) {
      var last_check = self.clientSession.createTime;
      var compareTime = process.hrtime(last_check);
      compareTime = (compareTime[0] * 1e9 + compareTime[1]); // convert to nanoseconds
      var rate = 7; // unit: clicks
      var per  = 1000000000; // unit: nanoseconds (1 second)
      self.clientSession.allowance += compareTime * (rate / per);
      console.log('time diff: ' + compareTime);
      if (self.clientSession.allowance > rate) {
        self.clientSession.allowance = rate; // discard extra tokens
      }
      if (self.clientSession.allowance < 1.0) {
        callback("rate limited");
      }
      else {
        self.clientSession.allowance -= 1.0;
        callback(null, self.clientSession.allowance);
      }
      
    }
  },
  function(err, results) {
    console.log('ApiKeyHandler Initialization: \n result: %s \n data: %s', err, JSON.stringify(results));
    if(!err) {
      ApiKeyHandler.newKey(self.client, self.clientSession, callback);
    } else {
      self.client.disconnect();
    }
  });
};

ApiKeyHandler.verify = function(key) {
  return validator.isUUID(key, 4);
};

ApiKeyHandler.newKey = function(client, data, callback) {
  var Client = client.id || client;
  var key = uuid.v4();
  data = (data || {}) // data is optional
  ApiKeys.put(
    Client,
    {
      key: key,
      createTime: process.hrtime(),
      allowance: data.allowance || 7
    },
    3600000); // value sits there for 1 hour if left alone
  console.log('saved');
  if(callback !== undefined) {
    console.log('trying to send fresh api key');
    client.emit('fresh api key', { apiKey: key });
    callback(client);
  }
};

ApiKeyHandler.delete = function(client, callback) {
  ApiKeys.del(client);
  if(callback !== undefined) {
    callback(null, true);
  }
};

module.exports = ApiKeyHandler;
module.exports.ApiKeys = ApiKeys;