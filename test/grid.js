'use strict';

var assert = require('assert')
  , Grid = require('../lib/grid')
  , redis = require('redis');

var returnsTrue = function() {
  return true;
};

describe('Grid', function() {
  var gridDimensions = 32;

  var redisClient = redis.createClient();
  redisClient.select(15);

  var client = {
    broadcast: {
      emit: returnsTrue,
    }
  };

  beforeEach(function() {
    redisClient.flushdb();
  });

  describe('constructor', function() {
    it('should instantiate a new grid', function() {
      var grid = new Grid(gridDimensions, redisClient);
      assert(grid instanceof Grid);
    });

    it('should create a 2d array representing the grid', function() {
      var grid = new Grid(gridDimensions, redisClient);
      assert(grid.gridMatrix instanceof Array);
      assert(grid.gridMatrix.length === gridDimensions);
      assert(grid.gridMatrix[0].length === gridDimensions);
    });

    it('should set a flag that indicates redis is now saving the grid', function() {
      redisClient.get('gridSaved', function(err, reply) {
        assert(!reply);
      });
      var grid = new Grid(gridDimensions, redisClient);
      redisClient.get('gridSaved', function(err, reply) {
        assert(reply);
      });
    });
  });

  describe('updateGrid', function() {
    it('should update grid with color if no color present', function() {
      var data = {
        row: '12',
        col: '24',
        color: '#FFFFFF'
      };
      var grid = new Grid(gridDimensions, redisClient);
      assert(grid.gridMatrix[data.row][data.col].color === '');
      grid.updateGrid(client, data);
      assert(grid.gridMatrix[data.row][data.col].color === data.color);
    });

    it('should update grid by deleting color if a color is already present', function() {
      var data = {
        row: '12',
        col: '24',
        color: '#FFFFFF'
      };
      var grid = new Grid(gridDimensions, redisClient);
      grid.updateGrid(client, data);
      assert(grid.gridMatrix[data.row][data.col].color === data.color);
      grid.updateGrid(client, data);
      assert(grid.gridMatrix[data.row][data.col].color === '');
    });
  });
});
