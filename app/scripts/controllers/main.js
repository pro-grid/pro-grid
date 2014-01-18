'use strict';

angular.module('proGridApp')
  .controller('MainCtrl', function ($scope) {
    var socket = io.connect('http://localhost:9001');
      socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });
    
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
