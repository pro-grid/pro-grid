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
      var grid = new Grid(gridDimensions, redisClient)
        .then(function () {
          assert(grid instanceof Grid);
        });
    });

    it('should create a 2d array representing the grid', function() {
      var grid = new Grid(gridDimensions, redisClient)
        .then(function () {
          assert(grid.gridMatrix instanceof Array);
          assert(grid.gridMatrix.length === gridDimensions);
          assert(grid.gridMatrix[0].length === gridDimensions);
        });
    });

    it('should set a flag that indicates redis is now saving the grid', function() {
      redisClient.get('gridSaved', function(err, reply) {
        assert(!reply);
      });
      new Grid(gridDimensions, redisClient).then(function () {
        redisClient.get('gridSaved', function(err, reply) {
          assert(reply);
        });
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
      var grid = new Grid(gridDimensions, redisClient)
        .then(function () {
          assert(grid.gridMatrix[data.row][data.col].color === '');
          grid.updateGrid(client, data);
          assert(grid.gridMatrix[data.row][data.col].color === data.color);
        });
    });

    it('should update grid by deleting color if a color is already present', function() {
      var data = {
        row: '12',
        col: '24',
        color: '#FFFFFF'
      };
      var grid = new Grid(gridDimensions, redisClient)
        .then(function () {
          grid.updateGrid(client, data);
          assert(grid.gridMatrix[data.row][data.col].color === data.color);
          grid.updateGrid(client, data);
          assert(grid.gridMatrix[data.row][data.col].color === '');
        });
    });

    it('should update redis when grid is updated with a new color', function() {
      var data = {
        row: '12',
        col: '24',
        color: '#FFFFFF'
      };
      var grid = new Grid(gridDimensions, redisClient)
        .then(function () {
          grid.updateGrid(client, data)
            .then(function() {
              var query = data.row + '-' + data.col;
              redisClient.get(query, function(err, reply) {
                assert(reply === data.color);
              });
            });
        });
    });

    it('should update redis when grid is updated to clear a color', function() {
      var data = {
        row: '12',
        col: '24',
        color: '#FFFFFF'
      };
      var grid = new Grid(gridDimensions, redisClient)
        .then(function () {
          grid.updateGrid(client, data)
            .then(function() {
              var query = data.row + '-' + data.col;
              redisClient.get(query, function(err, reply) {
                assert(reply === data.color);
              });
            })
            .then(function() {
              grid.updateGrid(client,data)
                .then(function() {
                  var query = data.row + '-' + data.col;
                  redisClient.get(query, function(err, reply) {
                    assert(!reply);
                  });
                });
            });
        });
    });
  });
});
