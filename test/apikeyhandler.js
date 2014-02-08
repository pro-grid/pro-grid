var assert = require('assert')
  , client = require('socket.io-client')
  , ApiKeyHandler = require('./apikeyhandler')
  , grunt = require('grunt')
  , uuid = require('node-uuid');

describe('ApiKeyHandler', function() {
  var akh;

  beforeEach(function() {
    // grunt.task.run(['web']);
    // akh = new ApiKeyHandler();
  });

  describe('constructor', function() {
    it ('should construct a new ApiKeyHandler', function() {
      var testKey = uuid.v4();
      var akh = new ApiKeyHandler(client, testKey);
      assert(akh instanceof ApiKeyHandler);
    })
    

  })

  describe('newKey', function() {
    it('should generate a new api key', function() {
    })
  })
})

