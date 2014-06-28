'use strict';

var validator = require('validator')
  , ApiKeyHandler = require('./apikeyhandler');

var clientValidator = function(data, dimensions) {
  // yeah so what it's a long return statement why you talkin shit
  var rgbRegex = /^(rgb\((([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]), ?){2}([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\))$/
  var vTypes = validator.isInt(data.row) && validator.isInt(data.col); 
  var vColor = rgbRegex.test(data.color) || validator.isHexColor(data.color);
  var vDimensions = data.row < dimensions && data.col < dimensions;
  var vApiKey = data.apiKey !== undefined && ApiKeyHandler.verify(data.apiKey);
  return vTypes && vColor && vDimensions && vApiKey;
};

module.exports = clientValidator;
