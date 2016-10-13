'use strict';

describe('Guidelines functionality:', function() {

  beforeEach(module('app.controllers'));
  beforeEach(module('app.services'));
  beforeEach(module('app.constants'));

  // Test data
  var mock = {};
  mock.guidelines = readJSON('assets/mocks/guidelines.json');

  /*
   * Mock our factory and spy on methods
   */
  var q;
  var deferred;
  beforeEach(inject(function($q, _guidelinesFactory_){
    deferred = $q.defer();
    mock.guidelinesFactory = _guidelinesFactory_;
    spyOn(mock.guidelinesFactory, 'getGuidelines').and.returnValue(deferred.promise);
  }));

  /*
   * Instantiate controller using $controller service
   */
  var scope, guidelineCtrl;
  beforeEach(inject(function($controller, $rootScope){
    // Controller setup
    scope = $rootScope.$new();
    guidelineCtrl = $controller('GuidelineCtrl', { guidelinesFactory: mock.guidelinesFactory });
  }));

  describe('initialization', function() {
    it('initializes with proper $scope variables and methods', function() {
      scope.$apply();
      expect(guidelineCtrl.guidelines).toEqual([]);
      expect(guidelineCtrl.errorMsg).toEqual(false);
    });
  });


  describe('getGuidelines()', function() {

    var testErrorMessage = 'Error at getting the list of guidelines';
    var testResponseSuccess = { success: true, data: mock.guidelines };
    var testResponseFailure = { error: testErrorMessage };

    it('successfully gets the list of guidelines', function() {
      expect(mock.guidelinesFactory.getGuidelines).toBeDefined();
      // Perform the action
      deferred.resolve(mock.guidelines);
      scope.$apply(function() {
        guidelineCtrl.getGuidelines();
      });
      // Run expectations
      expect(mock.guidelinesFactory.getGuidelines).toHaveBeenCalled();
      expect(guidelineCtrl.guidelines).toBe(testResponseSuccess.data);
    });

    it('fails to get the list of guidelines and displays an error message', function() {
      deferred.reject(testResponseFailure);
      // Perform the action
      scope.$apply(function() {
        guidelineCtrl.getGuidelines();
      });
      // Run expectations
      expect(mock.guidelinesFactory.getGuidelines).toHaveBeenCalled();
      expect(guidelineCtrl.errorMsg).toEqual(testResponseFailure.error);
    });

  });

});
