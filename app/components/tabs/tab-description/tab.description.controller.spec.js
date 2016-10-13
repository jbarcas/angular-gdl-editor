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
      expect(descriptionCtrl.guide.description).toBeUndefined();
      expect(descriptionCtrl.guide.ontology).toBeUndefined();
      expect(descriptionCtrl.guide.concept).toBeUndefined();
      //expect(descriptionCtrl.errorMsg).toEqual(false);
    });
  });


  /*describe('should match the scope variables', function() {

    var httpBackend;
    beforeEach(inject(function ($httpBackend) {
        httpBackend = $httpBackend;
    }));

    var testErrorMessage = 'Error at getting the guideline';
    var testResponseSuccess = { success: true, data: mock.guideline };
    var testResponseFailure = { error: testErrorMessage };


    it('successfully gets the list of guidelines', function() {
      expect(mock.guidelineFactory.getGuideline).toBeDefined();
      // Perform the action
      httpBackend.expectGET('http://localhost:8080/km/admin/guidelines/json/Estimated_GFR.v1').respond(200, testResponseSuccess.data);
      httpBackend.flush();
      deferred.resolve(mock.guideline);
      scope.$apply(function(){
        mock.guidelineFactory.getGuideline("Estimated_GFR.v1");
      });
      // Run expectations
      expect(mock.guidelineFactory.getGuideline).toHaveBeenCalled();
      expect(descriptionCtrl.guide.description).toBeUndefined();
      expect(descriptionCtrl.guide.ontology).toBeUndefined();
      expect(descriptionCtrl.guide.concept).toBeUndefined();
    });

  });*/

});
