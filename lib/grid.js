'use strict';
var async = require('async');
var Q = require('q');
var GridStore = require('./gridstore');
var gridGenerator = require('./gridgenerator').gridGenerator;

var Grid = function(gridDimensions) {
  var deferred = Q.defer();
  var self = this;
  self.gridDimensions = gridDimensions;
  self.gridStore = new GridStore();
  if (self.gridStore.isGridSaved()) {
    self.gridStore.getSavedGrid(self.gridDimensions)
      .then(function (gm) {
        self.gridMatrix = gm;
        deferred.resolve(self);
      });
  }
  else {
    self.gridMatrix = gridGenerator(self.gridDimensions);
    deferred.resolve(self);
  }
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
      var key = self.gridStore.key(self.data.row, self.data.col);
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
