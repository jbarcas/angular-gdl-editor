'use strict';

describe('Bindings functionality:', function() {

    var bindingsCtrl, guidelineFactory;

    beforeEach(module('app.controllers'));
    beforeEach(module('app.services'));
    beforeEach(module('app.constants'));
    beforeEach(module('ui.bootstrap'));     // Needed to load modalService

    // Test data
    var mock = {};
    mock.guideline = readJSON('assets/mocks/guideline.json');
    mock.convertedRules = readJSON('assets/mocks/convertedRules.json');

    /*
     * Instantiate controller using $controller service
     */
    beforeEach(inject(function($controller, _guidelineFactory_) {
        // Controller setup
        guidelineFactory = _guidelineFactory_;
        spyOn(guidelineFactory, 'getTermBindings').and.returnValue(mock.guideline.ontology.termBindings);
        bindingsCtrl = $controller('BindingsCtrl', {guidelineFactory: guidelineFactory});
    }));


    describe('BindingsCtrl', function() {

        it('should have the controller defined', function() {
            expect(bindingsCtrl).toBeDefined();
        });

        it('should have "terminologies" property defined and empty', function() {
            expect(bindingsCtrl.terminologies).toBeDefined();
            expect(bindingsCtrl.terminologies.length).toEqual(0);
        });

        it('should have "addBinding" method defined', function() {
            expect(bindingsCtrl.addBinding).toBeDefined();
        });

        it('should have "getCodes" method defined', function() {
            expect(bindingsCtrl.getCodes).toBeDefined();
        });

        it('should have "newBinding" method defined', function() {
            expect(bindingsCtrl.newBinding).toBeDefined();
        });

        it('should have "newTerminology" method defined', function() {
            expect(bindingsCtrl.newTerminology).toBeDefined();
        });

        it('should have "removeBinding" method defined', function() {
            expect(bindingsCtrl.removeBinding).toBeDefined();
        });

        it('should have "removeBindingTerminology" method defined', function() {
            expect(bindingsCtrl.removeBindingTerminology).toBeDefined();
        });

        it('should have "termBinding" with suiatble properties', function() {
            expect(bindingsCtrl.termBinding.bindings).toBeDefined();
            expect(bindingsCtrl.termBinding.id).toEqual("ICD10");
            expect(Object.keys(bindingsCtrl.termBinding.bindings).length).toEqual(6);
        });

        it('should call guidelineFactory.getTermBindings', function () {
            expect(guidelineFactory.getTermBindings).toHaveBeenCalled();
            expect(bindingsCtrl.termBindings).toEqual(mock.guideline.ontology.termBindings);
        });

    });

});

