'use strict';

var Q = require('q');
var redis = require('redis');
var gridGenerator = require('./gridgenerator').gridGenerator;

var GridStore = function() {
  var self = this;
  if (process.env.REDISTOGO_URL) {
    var rtg   = require('url').parse(process.env.REDISTOGO_URL);
    self.redisClient = redis.createClient(rtg.port, rtg.hostname);
    self.redisClient.auth(rtg.auth.split(':')[1]);
  } else {
    self.redisClient = redis.createClient();
  }
  return self;
};

GridStore.prototype.key = function(row, col) {
  return row + '-' + col;
};

GridStore.prototype.setGridCoordinate = function(key, color) {
  var self = this;
  var deferred = Q.defer();
  self.redisClient.set(key, color, function() {
    deferred.resolve();
  });
  return deferred.promise;
};

GridStore.prototype.deleteGridCoordinate = function (key) {
  var self = this;
  var deferred = Q.defer();
  self.redisClient.del(key, function() {
    deferred.resolve();
  });
  return deferred.promise;
};

GridStore.prototype.isGridSaved = function() {
  var self = this;
  var deferred = Q.defer();
  self.redisClient.get('gridSaved', function(err, reply) {
    if (reply) {
      deferred.resolve(true);
    }
    else {
      deferred.resolve(false);
    }
  });
  return deferred.promise;
};

GridStore.prototype.getSavedGrid = function(gridDimensions) {
  var gm = gridGenerator(gridDimensions);
  var self = this;
  var keyList = [];
  var deferred = Q.defer();
  for(var y = 0; y < gridDimensions; y++) {
    for(var x = 0; x < gridDimensions; x++) {
      var key = self.key(y, x);
      keyList.push(key);
    }
  }

  self.redisClient.mget(keyList, function(err, res) {
    for(var y = 0; y < gridDimensions; y++) {
      for(var x = 0; x < gridDimensions; x++) {
        var index = (gridDimensions * y) + x;
        if (res[index] !== null) {
          gm[y][x].color = res[index];
        }
      }
    }
    deferred.resolve(gm);
  });

  return deferred.promise;
};

module.exports = GridStore;
