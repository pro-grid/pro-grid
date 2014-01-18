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
      //alert(row + " " + col);
      socket.emit('clicked', { row: row, col: col });
    };

  });
