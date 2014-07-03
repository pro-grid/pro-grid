'use strict';
var async = require('async');
var Q = require('q');

var Grid = function(gridDimensions, redisClient) {
  var self = this;
  this.gridDimensions = gridDimensions;
  var deferred = Q.defer();
  self.gridMatrix = [];
  self.redisClient = redisClient;
  for(var y = 0; y < gridDimensions; y++) {
    self.gridMatrix.push(new Array(gridDimensions));
    for(var x = 0; x < gridDimensions; x++) {
      self.gridMatrix[y][x] = {
        row: y,
        col: x,
        color: ''
      };
    }
  }
  self.redisClient.get('gridSaved', function(err, reply) {
    if (reply) {
      self.loadGridFromRedis(gridDimensions)
        .then(function () {
          deferred.resolve(self);
        });
    }
    else {
      self.redisClient.set('gridSaved', self.gridDimensions, function () {
        deferred.resolve(self);
      });
    }
  });

  return deferred.promise;
};

Grid.prototype.getGrid = function () {
  return this.gridMatrix;
};

Grid.prototype.updateGrid = function(client, data) {
  var self = this;
  self.client = client;
  self.data = data;
  self.gridCol = self.gridMatrix[self.data.row][self.data.col];
  async.series([
    // update grid matrix with new data
    function(callback) {
      self.gridCol = self.gridMatrix[self.data.row][self.data.col];
      if(self.gridCol.color === '') {
        self.gridCol.color = data.color;
      } else {
        self.gridCol.color = '';
      }
      callback(null);
    },
    // emit msg to client about new data
    function(callback) {
      self.client.broadcast.emit('update', self.gridCol);
      callback(null);
    },
    // update redis store with new data
    function(callback) {
      var key = self.data.row + '-' + self.data.col;
      var value = self.data.color;
      if(self.gridCol.color === '') {
        self.redisClient.del(key);
      } else {
        self.gridCol.color = data.color;
        self.redisClient.set(key, value);
      }
      callback(null);
    }
  ]);
};

Grid.prototype.loadGridFromRedis = function(gridDimensions) {
  var self = this;
  var keyList = [];
  var deferred = Q.defer();
  for(var y = 0; y < gridDimensions; y++) {
    for(var x = 0; x < gridDimensions; x++) {
      var key = y + '-' + x;
      keyList.push(key);
    }
  }
  self.redisClient.mget(keyList, function(err, res) {
    for(var y = 0; y < gridDimensions; y++) {
      for(var x = 0; x < gridDimensions; x++) {
        var index = (gridDimensions * y) + x;
        if (res[index] !== null) {
          self.gridMatrix[y][x].color = res[index];
        }
      }
    }
    deferred.resolve(self.gridMatrix);
  });

  return deferred.promise;
};

module.exports = Grid;
