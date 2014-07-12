'use strict';
var async = require('async');
var Q = require('q');

var Grid = function(gridDimensions, gridStore) {
  var self = this;
  this.gridDimensions = gridDimensions;
  var deferred = Q.defer();
  self.gridStore = gridStore;
  if (self.gridStore.isGridSaved()) {
    self.gridMatrix = self.gridStore.getSavedGrid(gridDimensions)
      .then(function () {
        deferred.resolve(self);
      });
  }
  else {
    self.gridMatrix = self.generateNewGrid(gridDimensions);
    deferred.resolve(self);
  }

  return deferred.promise;
};

Grid.generateNewGrid = function(gridDimensions) {
  var gm = [];
  for(var y = 0; y < gridDimensions; y++) {
    gm.push(new Array(gridDimensions));
    for(var x = 0; x < gridDimensions; x++) {
      gm[y][x] = {
        row: y,
        col: x,
        color: ''
      };
    }
  }
  return gm;
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
        self.gridStore.deleteGridCoordinate(key);
      } else {
        self.gridCol.color = data.color;
        self.gridStore.setGridCoordinate(key, value);
      }
      callback(null);
    }
  ]);
};

module.exports = Grid;
