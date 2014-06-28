'use strict';

var assert = require('assert')
  , clientValidator = require('../lib/clientvalidator')
  , uuid = require('node-uuid');

describe('clientValidator', function() {
  var validRow = 1;
  var validCol = 1;
  var validColor = '#fff';
  var validApiKey = uuid.v4();
  var dimensions = 32;

  it('should validate when given valid data', function() {
    var data = {row: validRow, col: validCol, color: validColor, apiKey: validApiKey};
    assert(clientValidator(data, dimensions) === true);
  });

  it('should not validate when given invalid row', function() {
    var data = {row: 1000, col: validCol, color: validColor, apiKey: validApiKey};
    assert(clientValidator(data, dimensions) === false);
  });

  it('should not validate when given invalid column', function() {
    var data = {row: validRow, col: 1000, color: validColor, apiKey: validApiKey};
    assert(clientValidator(data, dimensions) === false);
  });

  it('should not validate when given invalid hex color', function() {
    var data = {row: validRow, col: validCol, color: '#abababab', apiKey: validApiKey};
    assert(clientValidator(data, dimensions) === false);
  });

  it('should not validate when given invalid rgb color', function() {
    var data = {row: validRow, col: validCol, color: 'rgb(300, 0, 0)', apiKey: validApiKey};
    assert(clientValidator(data, dimensions) === false);
    data.color = 'rgb(,0,0)';
    assert(clientValidator(data, dimensions) === false);
    data.color = 'rgb()';
    assert(clientValidator(data, dimensions) === false);
    data.color = 'rgb(255 255 255)';
    assert(clientValidator(data, dimensions) === false);
  });

  it('should validate when given valid hex color', function() {
    var data = {row: validRow, col: validCol, color: '#bada55', apiKey: validApiKey};
    assert(clientValidator(data, dimensions) === true);
  });

  it('should validate if the rgb color is valid', function () { 
    var data = {row: validRow, col: validCol, color: 'rgb(255, 255, 255)', apiKey: validApiKey};
    assert(clientValidator(data, dimensions) === true);
    data.color = 'rgb(000, 000, 000)';
    assert(clientValidator(data, dimensions) === true);
    data.color = 'rgb(0, 255, 0)';
    assert(clientValidator(data, dimensions) === true);
    data.color = 'rgb(0, 255,0)';
    assert(clientValidator(data, dimensions) === true);
  });

  it('should not validate when given invalid api key', function() {
    var data = {row: validRow, col: validCol, color: validColor, apiKey: 123123123};
    assert(clientValidator(data, dimensions) === false);
  });

});
