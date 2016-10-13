'use strict';

describe('GuidelinesFactory', function() {

  beforeEach(module('app.constants'));
  beforeEach(module('app.services'));

  var guidelinesFactory, httpBackend, q, baseUrl;

  beforeEach(inject(function(_guidelinesFactory_, $httpBackend, _API_URL_){    
    // Factory instance and dependencies
    guidelinesFactory = _guidelinesFactory_;
    httpBackend = $httpBackend;
    baseUrl = _API_URL_;
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  
  describe('initialization', function() {

    it('is defined', function() {
      expect(guidelinesFactory).toBeDefined();
    });

  });

  
  describe('getGuidelines()', function(){

    it('get the list of all guidelines', function() {
      var promise, response, result;
      // Test data
      var testGuidelines = readJSON('assets/mocks/guidelines.json');
      // Make the request and implement a fake success callback
      promise = guidelinesFactory.getGuidelines();
      promise.then(function(data) {
        result = data;
      });
      response = {
        success: true,
        data: testGuidelines
      };
      httpBackend.expectGET(baseUrl + "/guidelines").respond(200, response); // Expect a GET request and send back a canned response
      httpBackend.flush(); // Flush pending requests      
      expect(result).toEqual(response);
      expect(result.data).toEqual(testGuidelines);
      expect(result.data.length).toBe(24);

    });

    it('fails to get the list of all guidelines', function() {
      var promise, response, result, errorMessage;
      errorMessage = 'Error at getting guidelines';
      promise = guidelinesFactory.getGuidelines();
      promise.then(null, function(error) {
        result = error;
      });
      response = {
        error: errorMessage
      };
      httpBackend.expectGET(baseUrl + "/guidelines").respond(500, response); // Expect a GET request and send back a server failed canned response
      httpBackend.flush(); // Flush pending requests      
      expect(result).toEqual(response);
      expect(result.error).toEqual(errorMessage);
    });    

  });

});