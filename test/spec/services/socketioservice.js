'use strict';

describe('Service: Socketioservice', function () {

  // load the service's module
  beforeEach(module('trollGridApp'));

  // instantiate service
  var Socketioservice;
  beforeEach(inject(function (_Socketioservice_) {
    Socketioservice = _Socketioservice_;
  }));

  it('should do something', function () {
    expect(!!Socketioservice).toBe(true);
  });

});
