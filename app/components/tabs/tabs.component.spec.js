'use strict';

describe('TabsController', function() {

  beforeEach(module('app.constants'));
  beforeEach(module('app.services'));
  beforeEach(module('app.components'));
  beforeEach(module('ui.bootstrap'));
  beforeEach(module('ui.router'));

  var ctrl, componentController;

  beforeEach(inject(function(_$componentController_) {
    componentController = _$componentController_;
    ctrl = componentController('gdlTabs');    
  }));

  it('should be defined', function() {
    expect(ctrl.tabs).toBeDefined();
  });

  it('should have 9 tabs', function() {
    expect(ctrl.tabs.length).toEqual(9);
  });

});
