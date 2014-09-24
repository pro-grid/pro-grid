'use strict';

var assert = require('assert')
  , gridGenerator = require('../lib/gridgenerator');

describe('gridGenerator', function() {
  it('should generate a correctly size 2d array', function() {
    var dimensions = 32;
    var gm = gridGenerator.gridGenerator(dimensions);
    assert(gm.length === dimensions);
    assert(gm[0].length === dimensions);
    assert(gm[0][0].hasOwnProperty('row'));
    assert(gm[0][0].hasOwnProperty('col'));
    assert(gm[0][0].hasOwnProperty('color'));
  });
});
