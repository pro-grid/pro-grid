'use strict';

angular.module('proGridApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.dimensions = 16;

    $scope.generateGrid = function(num) {
      return new Array(num);
    };

    $scope.gridClicked = function(row, col) {
      //Socketioservice.emit('grid:clicked');
      // TODO: Respond to user click on the grid (by animation etc.)
    };
  });
