'use strict';

describe('Service: Randomcolor', function () {

  // load the service's module
  beforeEach(module('proGridApp'));

  // instantiate service
  var Randomcolor;
  beforeEach(inject(function (_Randomcolor_) {
    Randomcolor = _Randomcolor_;
  }));

  it('should be defined', function () {
    expect(!!Randomcolor).toBe(true);
  });

});
