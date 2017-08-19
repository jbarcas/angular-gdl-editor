'use strict';

describe('Description functionality:', function() {

  var rulelistCtrl, guidelineFactory, rulelistFactory;
  beforeEach(module('app.controllers'));

  beforeEach(module('app.services'));
  beforeEach(module('app.constants'));
  beforeEach(module('ui.router'));        // Needed to load $state service
  beforeEach(module('ui.bootstrap'));     // Needed to load modalService

  // Test data
  var mock = {};

  mock.guideline = readJSON('assets/mocks/guideline.json');
  mock.convertedRules = readJSON('assets/mocks/convertedRules.json');

  /*
   * Instantiate controller using $controller service
   */
  beforeEach(inject(function($controller, _guidelineFactory_, _rulelistFactory_) {
    // Controller setup
    guidelineFactory = _guidelineFactory_;
    rulelistFactory = _rulelistFactory_;
    spyOn(guidelineFactory, 'getOntology').and.returnValue(mock.guideline.ontology);
    spyOn(guidelineFactory, 'getRulelist').and.returnValue(mock.guideline.definition.rules);
    rulelistCtrl = $controller('RulelistCtrl', {guidelineFactory: guidelineFactory, rulelistFactory: rulelistFactory});
  }));


  describe('RulelistCtrl', function() {

    it('should have the controller defined', function() {
      expect(rulelistCtrl).toBeDefined();
    });

    it('should have guide defined', function() {
      expect(rulelistCtrl.guide).toBeDefined();
    });

    it('should have "remove" method defined', function() {
      expect(rulelistCtrl.remove).toBeDefined();
    });

    it('should have "openRuleEditor" method defined', function() {
      expect(rulelistCtrl.openRuleEditor).toBeDefined();
    });

    it('should have "addRule" method defined', function() {
      expect(rulelistCtrl.addRule).toBeDefined();
    });

    it('should have "editName" method defined', function() {
      expect(rulelistCtrl.editName).toBeDefined();
    });

    it('should call guidelineFactory.getOntology', function () {
      expect(guidelineFactory.getOntology).toHaveBeenCalled();
      expect(rulelistCtrl.guide.ontology).toEqual(mock.guideline.ontology);
    });

    it('should call rulelistFactory.getRulelist', function () {
      expect(guidelineFactory.getRulelist).toHaveBeenCalled();
      expect(rulelistCtrl.rules).toEqual(mock.convertedRules);
    });

  });

});
