'use strict';

var assert = require('assert')
  , GridStore = require('../lib/gridstore');

describe('GridStore', function() {
  var gridStore = new GridStore();
  gridStore.redisClient.select(15);
  var row = 0, col = 0, color = '#FFFFFF';

  beforeEach(function() {
    gridStore.redisClient.flushdb();
  });

  describe('constructor', function() {
    it('should instantiate a GridStore object', function() {
      assert(gridStore instanceof GridStore);
    });
  });

  describe('key', function() {
    it('should return the valid key string', function() {
      assert(gridStore.key(row, col) === '0-0');
    });
  });

  describe('setGridCoordinate', function() {
    it('should set the correct value in the store', function() {
      var key = gridStore.key(row, col);
      gridStore.setGridCoordinate(key, color)
      .then(function() {
        return gridStore.getGridCoordinate(key);
      })
      .then(function(reply) {
        assert(reply === color);
      })
      .done();
    });
  });

  describe('deleteGridCoordinate', function() {
    it('should delete a value after it has been set', function () {
      var key = gridStore.key(row, col);
      gridStore.setGridCoordinate(key, color)
      .then(function() {
        return gridStore.deleteGridCoordinate(key);
      })
      .then (function() {
        return gridStore.getGridCoordinate(key);
      })
      .then(function(reply) {
        assert(!reply);
      })
      .done();
    });
  });

  describe('getGridCoordinate', function() {
    it('should get the correct value from the grid', function() {
      var key = gridStore.key(row, col);
      gridStore.getGridCoordinate(key)
      .then(function(reply) {
        assert(!reply);
      });
      gridStore.setGridCoordinate(key, color)
      .then(function() {
        return gridStore.getGridCoordinate(key);
      })
      .then(function(reply) {
        assert(reply);
      });
    });
  });

  describe('getSavedGrid', function() {
    it('should return the state of the grid in the store', function () {
      var gridDimensions = 1;
      var key = gridStore.key(row, col);
      gridStore.setGridCoordinate(key, color);
      gridStore.getSavedGrid(gridDimensions)
      .then(function(gm) {
        assert(gm[0][0].color === color);
      });
    });
  });
});
