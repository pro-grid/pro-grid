'use strict'

var validator = require('validator')
  , ApiKeyHandler = require('./apikeyhandler');

var ClientValidator = function(data, dimensions) {
  // yeah so what it's a long return statement why you talkin shit
  var vTypes = validator.isInt(data.row) && validator.isInt(data.col) && validator.isHexColor(data.color);
  var vDimensions = data.row < dimensions && data.col < dimensions;
  var vApiKey = data.apiKey !== undefined && ApiKeyHandler.verify(data.apiKey);
  console.log('Validating data: %s %s %s', vTypes, vDimensions, vApiKey);
  return vTypes && vDimensions && vApiKey;
};

module.exports = ClientValidator;