'use strict';

// Store for ApiKeys
var ApiKeys = require('memory-cache');

// Create, verify, update and delete
// Api Keys
// ApiKeyHandler

var async = require('async')
  , validator = require('validator')
  , uuid = require('node-uuid');

var ApiKeyHandler = function (client, key, callback) { // Create
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
      var lastCheck = self.clientSession.createTime;
      var compareTime = process.hrtime(lastCheck);
      compareTime = (compareTime[0] * 1e9 + compareTime[1]); // convert to nanoseconds
      var rate = 7; // unit: clicks
      var per  = 1000000000; // unit: nanoseconds (1 second)
      self.clientSession.allowance += compareTime * (rate / per);
      if (self.clientSession.allowance > rate) {
        self.clientSession.allowance = rate; // discard extra tokens
      }
      if (self.clientSession.allowance < 1.0) {
        callback('rate limited');
      }
      else {
        self.clientSession.allowance -= 1.0;
        callback(null, self.clientSession.allowance);
      }
      
    }
  },
  function(err, results) {
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
  data = (data || {}); // data is optional
  ApiKeys.put(
    Client,
    {
      key: key,
      createTime: process.hrtime(),
      allowance: data.allowance || 7
    },
    3600000); // value sits there for 1 hour if left alone
  if(callback !== undefined) {
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
