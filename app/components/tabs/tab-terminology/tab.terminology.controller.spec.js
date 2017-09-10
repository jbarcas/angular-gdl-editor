'use strict';

describe('Terminology functionality:', function() {

  beforeEach(module('app.controllers'));
  beforeEach(module('app.constants'));
  beforeEach(module('app.services'));
  beforeEach(module('ui.bootstrap'));     // Needed to load modalService

  var terminologyCtrl, $httpBackend, guidelineFactory;

  beforeEach(inject(function($controller, _guidelineFactory_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    guidelineFactory = _guidelineFactory_;
    terminologyCtrl = $controller('TerminologyCtrl', { guidelineFactory: guidelineFactory });
  }));


  describe('Terminology controller', function(){

    it('should be defined', function() {
      expect(terminologyCtrl).toBeDefined();
    });

    describe('Mock backend', function(){
      
      beforeEach(inject(function(_$httpBackend_) {
        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        // regex match with  http://<host>[:<port>]/km/admin/guidelines
      }));

      afterEach(function() {
        // this fails the test if any methods were not flushed to the $http API
        $httpBackend.verifyNoOutstandingRequest();
        // this fails the test if you fail to call the $http API with one of your expected URLs
        $httpBackend.verifyNoOutstandingExpectation();
        
      });

/*    it('should remove a term', function() {
        var Estimated_GFR = readJSON('assets/mocks/guideline.json');        
        terminologyCtrl.guide = guidelineFactory.getGuideline("Estimated_GFR.v1");
        $httpBackend.whenGET('http://localhost:8080/km/admin/guidelines/json/Estimated_GFR.v1').respond(200, Estimated_GFR);
        $httpBackend.flush();
        var term = 'gt0013';
        expect(terminologyCtrl.guide).toBeDefined();
      })*/

    });
  });
});
