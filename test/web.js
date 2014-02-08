var client = require('socket.io-client')
  , assert = require("assert")  

describe('web.js', function(){
  var socket;

  var testData = [
    { // row too big
      row: 10000,
      col: 1,
      color: "#fff"
    },
    { // col too big
      row: 1,
      col: 10000,
      color: "#fff"
    },
    { // invalid row
      row: "not valid",
      col: 1,
      color: "#fff"
    },
    { // invalid col
      row: 1,
      col: 100,
      color: "#fff"
    },
    { // invalid color
      row: 1,
      col: 1,
      color: "#abababab"
    },
    { // invalid case 2
      row: 1,
      col: 1,
      color: 111111
    },
    
  ];

  beforeEach(function(done) {
      // Setup
      socket = io.connect('http://localhost:9001');
      socket.on('connect', function() {
        console.log('worked...');
        done();
      });
      socket.on('disconnect', function() {
        console.log('disconnected...');
      })

  });

  describe('', function() {

    it('Doing some things with indexOf()', function(done) {
        expect([1, 2, 3].indexOf(5)).to.be.equal(-1);
        expect([1, 2, 3].indexOf(0)).to.be.equal(-1);
        done();
    });

    it('Doing something else with indexOf()', function(done) {
        expect([1, 2, 3].indexOf(5)).to.be.equal(-1);
        expect([1, 2, 3].indexOf(0)).to.be.equal(-1);
        done();
    });

  });




})