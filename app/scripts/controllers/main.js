'use strict';

angular.module('proGridApp')
  .controller('MainCtrl', function ($scope, socket, Socketioservice),  {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.dimensions = 16;

    $scope.generateGrid = function(num) {
      return new Array(num);   
    }

    $scope.gridClicked = function(row, col) {
      socket.emit('grid:clicked');
      // TODO: Respond to user click on the grid (by animation etc.)
    };

    // Socket listeners
    socket.on('grid:clicked', function(row, col) {
      gridClicked(row, col);
    });

  });
