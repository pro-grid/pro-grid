'use strict';

var assert = require('assert')
  , Grid = require('../lib/grid');

describe('Grid', function() {
  var gridDimensions = 32;
  describe('constructor', function() {
    it('should instantiate a new grid', function() {
      var grid = new Grid(gridDimensions);
      assert(grid instanceof Grid);
    });

    it('should create a 2d array representing the grid', function() {
      var grid = new Grid(gridDimensions);
      assert(grid.gridMatrix instanceof Array);
      assert(grid.gridMatrix.length === gridDimensions);
      assert(grid.gridMatrix[0].length === gridDimensions);
    });
  });
});
