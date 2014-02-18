'use strict';

var assert = require('assert')
  , Grid = require('../../../server/grid');

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

  describe('updateGridMatrix', function() {
    var grid = new Grid(gridDimensions);
    it('should update gridMatrix with new values', function() {
      var data = {
        row: 0,
        col: 0,
        color: '#fff'
      };
      var gridCol = grid.gridMatrix[data.row][data.col];
      assert(gridCol.color === '');

      grid.updateGridMatrix(data);
      assert(gridCol.color === data.color);

      grid.updateGridMatrix(data);
      assert(gridCol.color === '');
    });
  });

});