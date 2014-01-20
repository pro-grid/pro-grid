'use strict';

angular.module('proGridApp')
  .controller('MainCtrl', function ($scope) {
    var socket = io.connect();
    // Socket listener for updating grid
    socket.on('update', function (data) {
      console.log(data);
      var selector = ".col_" + data.row + "_" + data.col;
      var el = document.querySelector(selector);
      if(el.className.indexOf("black") > -1) {
        el.className = el.className.replace("black", "");
        console.log("if");
      } else {
        el.className = el.className + " black";
        console.log("else");
      }
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
      // Sends a signal upon user click
      socket.emit('clicked', { row: row, col: col });
    };

  });
