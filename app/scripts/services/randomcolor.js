'use strict';
//selects a random color from 8 options of hexadecimal strings from clrs.cc
angular.module('proGridApp')
  .factory('Randomcolor', function Randomcolor() {
    return {
      new: function() {
        var colorset = ['#0074D9','#FF851B','#01FF70','#FFDC00','#AAAAAA','#FF4136','#F012BE','#111111'];
        var color = colorset[Math.floor(Math.random() * 8)];
        return color;
      }
    };
  });
