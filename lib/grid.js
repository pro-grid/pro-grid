'use strict';
var redisClient;
var redis = require('redis');
if (process.env.REDISTOGO_URL) {
  var rtg   = require('url').parse(process.env.REDISTOGO_URL);
  redisClient = redis.createClient(rtg.port, rtg.hostname);
  redisClient.auth(rtg.auth.split(':')[1]);
} else {
  redisClient = redis.createClient();
}

var async = require('async');

var Grid = function(gridDimensions) {
  this.gridDimensions = gridDimensions;
  var self = this;
  self.gridMatrix = [];
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
  redisClient.get('gridSaved', function(err, reply) {
    if (reply) {
      self.loadGridFromRedis(gridDimensions);
    }
    else {
      redisClient.set('gridSaved', 'HELLA_SAVED', redis.print);
    }
  });
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
        redisClient.del(key);
      } else {
        self.gridCol.color = data.color;
        redisClient.set(key, value);
      }
      callback(null);
    }
  ], function(err, result) {
  });
};

Grid.prototype.loadGridFromRedis = function(gridDimensions) {
  var keyList = [];
  var self = this;
  for(var y = 0; y < gridDimensions; y++) {
    for(var x = 0; x < gridDimensions; x++) {
      var key = y + '-' + x;
      keyList.push(key);
    }
  }
  redisClient.mget(keyList, function(err, res) {
    for(var y = 0; y < gridDimensions; y++) {
      for(var x = 0; x < gridDimensions; x++) {
        var index = (gridDimensions * y) + x;
        if (res[index] !== null) {
          self.gridMatrix[y][x].color = res[index];
        }
      }
    }
  });
};

module.exports = Grid;
