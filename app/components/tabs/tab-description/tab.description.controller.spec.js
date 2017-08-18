'use strict';

describe('Description functionality:', function() {

  beforeEach(module('app.controllers'));
  beforeEach(module('app.services'));
  beforeEach(module('app.constants'));
  beforeEach(module('ui.bootstrap'));

  // Test data
  var mock = {};
  mock.guideline = readJSON('assets/mocks/guideline.json');

  /*
   * Mock our factory and spy on methods
   */
  var q;
  var deferred;
  beforeEach(inject(function($q, _guidelineFactory_){
    deferred = $q.defer();
    mock.guidelineFactory = _guidelineFactory_;
    spyOn(mock.guidelineFactory, 'getGuideline').and.returnValue(deferred.promise);
  }));

  /*
   * Instantiate controller using $controller service
   */
  var scope, descriptionCtrl;
  beforeEach(inject(function($controller, $rootScope){
    // Controller setup
    scope = $rootScope.$new();
    descriptionCtrl = $controller('DescriptionCtrl', { guidelineFactory: mock.guidelineFactory });
  }));

  describe('initialization', function() {
    it('initializes with proper $scope variables and methods', function() {
      scope.$apply();
      expect(descriptionCtrl).toBeDefined();
      expect(descriptionCtrl.guide).toBeDefined();
      expect(descriptionCtrl.errorMsg).toEqual(false);
      expect(descriptionCtrl.addKeyword).toBeDefined();
      expect(descriptionCtrl.addOtherContributor).toBeDefined();
      expect(descriptionCtrl.removeKeyword).toBeDefined();
      expect(descriptionCtrl.removeContributor).toBeDefined();
    });
  });

});
