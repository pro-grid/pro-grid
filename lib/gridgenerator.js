'use strict';

module.exports.gridGenerator = function(gridDimensions) {
  var gm = [];
  for(var y = 0; y < gridDimensions; y++) {
    gm.push(new Array(gridDimensions));
    for(var x = 0; x < gridDimensions; x++) {
      gm[y][x] = {
        row: y,
        col: x,
        color: ''
      };
    }
  }
  return gm;
};
