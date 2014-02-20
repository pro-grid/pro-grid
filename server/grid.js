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
  var gridCol = this.updateGridMatrix(data);
  this.updateRedis(data);
  console.log('updating grid');
  client.broadcast.emit('update', gridCol, function() {
    console.log('updated grid');
  });
};

Grid.prototype.updateGridMatrix = function(data) {
  var gridCol = this.gridMatrix[data.row][data.col];
  if(gridCol.color === '') {
    gridCol.color = data.color;
  } else {
    gridCol.color = '';
  }
  return gridCol;
};

Grid.prototype.updateRedis = function(data) {
  var key = data.row + '-' + data.col;
  var value = data.color;
  console.log('saved ' + value + ' to redis for ' + key);
  redisClient.set(key, value, redis.print);
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