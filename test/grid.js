'use strict';

var assert = require('assert')
  , Grid = require('../lib/grid');

var returnsTrue = function() {
  return true;
};

describe('Grid', function() {
  var gridDimensions = 32;
  var data = {
    row: '12',
    col: '24',
    color: '#FFFFFF'
  };

  var client = {
    broadcast: {
      emit: returnsTrue,
    }
  };

  describe('constructor', function() {
    it('should instantiate a new grid', function() {
      new Grid(gridDimensions)
      .then(function(grid) {
        assert(grid instanceof Grid);
      });
    });

    it('should create a 2d array representing the grid', function() {
      new Grid(gridDimensions)
      .then(function(grid) {
        assert(grid.gridMatrix instanceof Array);
        assert(grid.gridMatrix.length === gridDimensions);
        assert(grid.gridMatrix[0].length === gridDimensions);
      });
    });
  });

  describe('updateGrid', function() {
    it('should update grid with color if no color present', function() {
      new Grid(gridDimensions)
      .then(function(grid) {
        assert(grid.gridMatrix[data.row][data.col].color === '');
        grid.updateGrid(client, data);
        assert(grid.gridMatrix[data.row][data.col].color === data.color);
      });
    });

    it('should update grid by deleting color if a color is already present', function() {
      new Grid(gridDimensions)
      .then(function(grid) {
        grid.updateGrid(client, data);
        assert(grid.gridMatrix[data.row][data.col].color === data.color);
        grid.updateGrid(client, data);
        assert(grid.gridMatrix[data.row][data.col].color === '');
      });
    });
  });
});
