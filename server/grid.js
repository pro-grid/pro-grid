'use strict';

var redis = require('redis')
  , redisClient = redis.createClient()
  , async = require('async');

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
      console.log('THE GRID EXISTS');
      console.log(reply);
      self.loadGridFromRedis(gridDimensions);
    }
    else {
      redisClient.set('gridSaved', 'HELLA_SAVED', redis.print);
      console.log('THE GRID DID NOT EXIST PRIOR TO THIS MOMENT');
    }
  });
};

Grid.prototype.updateGrid = function(client, data) {
  var self = this;
  self.client = client;
  self.data = data;
  async.waterfall([
    // update grid matrix with new data
    function(callback) {
      var gridCol = self.gridMatrix[self.data.row][self.data.col];
      if(gridCol.color === '') {
        gridCol.color = data.color;
      } else {
        gridCol.color = '';
      }
      callback(null, gridCol);
    },
    // emit msg to client about new data
    function(gridCol, callback) {
      self.client.broadcast.emit('update', gridCol);
      callback(null, gridCol);
    },
    // update redis store with new data
    function(gridCol, callback) {
      var key = self.data.row + '-' + self.data.col;
      var value = self.data.color;
      if(gridCol.color === '') {
        redisClient.del(key);
      } else {
        gridCol.color = data.color;
        console.log('saved ' + value + ' to redis for ' + key);
        redisClient.set(key, value, redis.print);
      }
      callback(null, 'done');
    }
  ], function(err, result) {
      console.log('finished processing click!');
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
          console.log(y + '-' + x);
          console.log(res[index]);
          self.gridMatrix[y][x].color = res[index];
        }
      }
    }
  });
};

module.exports = Grid;
