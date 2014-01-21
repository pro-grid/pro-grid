'use strict';

angular.module('proGridApp')
  .controller('MainCtrl', function ($scope) {
    var socket = io.connect();
    var getRandomColor = function() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
      }
      return color;
    }
    var UserColor = getRandomColor();
    socket.on('update', function (data) {
      console.log(data);
      var selector = ".col_" + data.row + "_" + data.col;
      var el = document.querySelector(selector);
      if(el.className.indexOf("black") > -1) {
        el.className = el.className.replace("black", "");
        el.style.backgroundColor=UserColor;
        console.log(UserColor);
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
    $scope.dimensions = 32;

    $scope.generateGrid = function(num) {
      return new Array(num);
    };

    $scope.gridClicked = function(row, col) {
      //alert(row + " " + col);
      socket.emit('clicked', { row: row, col: col });

    };
    
  });
