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
    }
  });
