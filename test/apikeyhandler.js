'use strict';

var assert = require('assert')
  , ApiKeyHandler = require('../lib/apikeyhandler')
  , uuid = require('node-uuid');

var returnsTrue = function() {
  return true;
};

describe('ApiKeyHandler', function() {
  var client;
  beforeEach(function() {
    client = {
      id: 1,
      emit: returnsTrue,
      disconnect: returnsTrue
    };
    ApiKeyHandler.ApiKeys.clear();
  });

  describe('constructor', function() {
    it ('should construct a new ApiKeyHandler', function() {
      var testKey = uuid.v4();
      var akh = new ApiKeyHandler(client, testKey);
      assert(akh instanceof ApiKeyHandler);
    });
  });

  describe('newKey', function() {
    it('should generate a new api key', function() {
      ApiKeyHandler.newKey(client);
      assert(ApiKeyHandler.ApiKeys.size() === 1);
    });
  });

  describe('verify', function() {
    it ('should verify an api key', function() {
      var testKey1 = uuid.v4();
      assert(ApiKeyHandler.verify(testKey1) === true);
      var testKey2 = 0;
      assert(ApiKeyHandler.verify(testKey2) === false);
    });
  });

  describe('delete', function() {
    it ('should delete an api key', function() {
      ApiKeyHandler.newKey(client);
      assert(ApiKeyHandler.ApiKeys.size() === 1);
      ApiKeyHandler.delete(client.id);
      assert(ApiKeyHandler.ApiKeys.size() === 0);
    });
  });
});



