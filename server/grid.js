'use strict'

var Grid = function(gridDimensions) {
  this.gridMatrix = [];
  for(var y = 0; y < gridDimensions; y++) {
    this.gridMatrix.push(new Array(gridDimensions));
    for(var x = 0; x < gridDimensions; x++) {
      this.gridMatrix[y][x] = {
        row: y,
        col: x,
        color: ''
      };
    }
  }
};

Grid.prototype.updateGrid = function(client, data) {
  var gridCol = this.updateGridMatrix(data);
  console.log('updating grid');
  client.broadcast.emit('update', gridCol, function() {
    console.log('updated grid');
  });
};

Grid.prototype.updateGridMatrix = function(data) {
  var gridCol = this.gridMatrix[data.row][data.col];
  if(gridCol.color === '') {
    gridCol.color = data.color;
  } else {
    gridCol.color = '';
  }
  return gridCol;
};

module.exports = Grid;