'use strict';

angular.module('proGridApp')
  .controller('MainCtrl', ['$scope', 'Randomcolor', function ($scope, Randomcolor) {
    var socket = io.connect();
    // Socket listener for updating grid
    var userColor = Randomcolor.new();
    var apiKey = 1;
    var updateGrid = function(row, col, color) {
      var selector = '.col_' + row + '_' + col;
      var el = document.querySelector(selector);
      if(el.style.backgroundColor) {el.style.backgroundColor = '';} 
      else {el.style.backgroundColor = color;}
    };
    var updateRow = function(row, col, color) {
      for (var i = 0; i < $scope.dimensions; i++)
      updateGrid(row, i, color);
    };
    var updateCol = function(row, col, color) {
      for (var i = 0; i < $scope.dimensions; i++)
      updateGrid(i, col, color);
    };
    var updatePlus = function (row, col, color) {
      updateGrid(row, col, color);
      updateGrid(row+1, col, color);
      updateGrid(row-1, col, color);
      updateGrid(row, col+1, color);
      updateGrid(row, col-1, color);
    };

    socket.on('server ready', function (data) {
      //grid is an array
      console.log('Hello There! Hope you are enjoying the app. Please be nice! Please help us fix our issues over at: https://github.com/ridhoq/pro-grid Thank you. -progrid.io');
      data.gridArray.forEach(function (element) {
        element.forEach(function (element) {
          updateGrid(element.row, element.col, element.color);
        });
      });
    });

    socket.on('fresh api key', function (data) {
      apiKey = data.apiKey;
    });

    socket.on('update', function (data) {
      updateGrid(data.row, data.col, data.color);
    });
    socket.on('connect', function () {
      $scope.message = false;
    });
    socket.on('disconnect', function () {
      $scope.message = {
        title: "Disconnected",
        body: "You have been disconnected. Feel free to refresh the page if this message doesn’t go away."
      };
      console.log('goodbye');
    });

    $scope.dimensions = 32;

    $scope.generateGrid = function(num) {
      return new Array(num);
    };

    $scope.gridClicked = function(row, col) {
      updatePlus(row, col, userColor);
      socket.emit('clicked', { row: row, col: col, color: userColor, apiKey: apiKey });
    };

    $scope.closeMessage = function() {
      $scope.message = false;
    };
    $scope.gridClicked = _.throttle($scope.gridClicked, 100, {trailing: false});
  }]);