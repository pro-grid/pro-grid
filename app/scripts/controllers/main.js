'use strict';

angular.module('proGridApp')
  .controller('MainCtrl', ['$scope', 'Randomcolor', function ($scope, Randomcolor) {
    var socket = io.connect();
    // Socket listener for updating grid
    var userColor = Randomcolor.new();
    var updateGrid = function(row, col, color) {
      var selector = '.col_' + row + '_' + col;
      var el = document.querySelector(selector);
      if(el.style.backgroundColor) {
        el.style.backgroundColor = '';
      } else {
        el.style.backgroundColor = color;
      }
    };
    
    socket.on('server ready', function (data) {
      //grid is an array
      console.log("init");
      data.gridArray.forEach(function (element) {
        element.forEach(function (element) {
          updateGrid(element.row, element.col, element.color);
        });
      });
    });

    socket.on('update', function (data) {
      console.log(data);
      updateGrid(data.row, data.col, data.color);
    });
    
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.dimensions = 32;

    $scope.generateGrid = function(num) {
      return new Array(num);
    };

    $scope.gridClicked = function(row, col) {
      socket.emit('clicked', { row: row, col: col, color: userColor });
    };
  }]);