'use strict';

describe('GuidelinesFactory', function() {

  beforeEach(module('app.constants'));
  beforeEach(module('app.services'));

  var guidelineFactory, httpBackend, q, baseUrl;

  beforeEach(inject(function(_guidelineFactory_, $httpBackend, _API_URL_){    
    // Factory instance and dependencies
    guidelineFactory = _guidelineFactory_;
    httpBackend = $httpBackend;
    baseUrl = _API_URL_;
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  
  describe('initialization', function() {

    it('is defined', function() {
      expect(guidelineFactory).toBeDefined();
    });

  });

  
  describe('getGuideline(guidelineId)', function(){

    var guidelineId = "Estimated_GFR.v1";

    it('get a particular guideline', function() {
      var promise, response, result;
      // Test data
      var testGuideline = readJSON('assets/mocks/guideline.json');
      // Make the request and implement a fake success callback
      promise = guidelineFactory.getGuideline(guidelineId);
      promise.then(function(data) {
        result = data;
      });
      response = {
        success: true,
        data: testGuideline
      };
      var urlMisc = "http://localhost:8080/km/misc/archetypes/";
      httpBackend.expectGET(baseUrl + "/guidelines/json/" + guidelineId).respond(200, response.data); // Expect a GET request and send back a canned response
      httpBackend.expectGET(baseUrl + "/archetypes/json/openEHR-EHR-OBSERVATION.estimated_glomerular_filtration_rate.v1").respond(200, true); // Expect a GET request and send back a canned response
      httpBackend.expectGET(baseUrl + "/archetypes/json/openEHR-EHR-OBSERVATION.lab_test-urea_and_electrolytes.v1").respond(200, true); // Expect a GET request and send back a canned response
      httpBackend.expectGET(baseUrl + "/archetypes/json/openEHR-EHR-OBSERVATION.body_weight.v1").respond(200, true); // Expect a GET request and send back a canned response
      httpBackend.expectGET(baseUrl + "/archetypes/json/openEHR-EHR-OBSERVATION.height.v1").respond(200, true); // Expect a GET request and send back a canned response
      httpBackend.expectGET(baseUrl + "/archetypes/json/openEHR-EHR-OBSERVATION.basic_demographic.v1").respond(200, true); // Expect a GET request and send back a canned response
      httpBackend.expectGET(urlMisc + "openEHR-EHR-OBSERVATION.estimated_glomerular_filtration_rate.v1/en/terms").respond(200, true); // Expect a GET request and send back a canned response
      httpBackend.expectGET(urlMisc + "openEHR-EHR-OBSERVATION.lab_test-urea_and_electrolytes.v1/en/terms").respond(200, true); // Expect a GET request and send back a canned response
      httpBackend.expectGET(urlMisc + "openEHR-EHR-OBSERVATION.body_weight.v1/en/terms").respond(200, true); // Expect a GET request and send back a canned response
      httpBackend.expectGET(urlMisc + "openEHR-EHR-OBSERVATION.height.v1/en/terms").respond(200, true); // Expect a GET request and send back a canned response
      httpBackend.expectGET(urlMisc + "openEHR-EHR-OBSERVATION.basic_demographic.v1/en/terms").respond(200, true); // Expect a GET request and send back a canned response
      httpBackend.flush(); // Flush pending requests
      expect(result).toEqual(response.data);

    });

    it('fails to get a particular guideline', function() {
      var promise, response, result, errorMessage;
      errorMessage = 'Error at getting the guideline';
      promise = guidelineFactory.getGuideline(guidelineId);
      promise.then(null, function(error) {
        result = error;
      });
      response = {
        error: errorMessage
      };
      httpBackend.expectGET(baseUrl + "/guidelines/json/" + guidelineId).respond(404, response); // Expect a GET request and send back a client failed canned response
      httpBackend.flush(); // Flush pending requests      
      expect(result).toEqual(response);
      expect(result.error).toEqual(errorMessage);
    });

  });

});