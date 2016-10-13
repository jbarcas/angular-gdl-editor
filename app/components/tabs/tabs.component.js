(function(){
  'use strict';
  var app = angular.module('app.components');

  app.component('gdlTabs', {
    templateUrl: 'components/tabs/tabs.component.html',
    controller: function ($state, $log, guidelineFactory, utilsFactory, modalService) {
      this.tabs = [
        {heading: "Guidelines", route: "tab-guidelines", active: false, disabled: false},
        {heading: "Description", route: "tab-description", active: false, disabled: false},
        {heading: "Definitions", route: "tab-definitions", active: false, disabled: false},
        {heading: "Rule list", route: "tab-rule-list", active: true, disabled: true},
        {heading: "Preconditions", route: "tab-preconditions", active: true, disabled: true},
        {heading: "Terminology", route: "tab-terminology", active: false, disabled: false},
        {heading: "Binding", route: "tab-binding", active: false, disabled: true},
        {heading: "GDL", route:"tabs.tab-gdl", active: false, disabled: true},
        {heading: "HTML", route:"tabs.tab-html", active: false, disabled: true}
      ];

      this.go = function (route) {
        $state.go(route);
      };

      this.insertGuide = function () {

        var guideline = guidelineFactory.getCurrentGuide();

        if(hasBeenConverted(guideline)) {
          guideline = utilsFactory.convertToPost(guideline);
        }

        function hasBeenConverted (guideline) {
          return guideline.definition.archetypeBindings instanceof Array; 
        }

        guidelineFactory.insertGuideline(guideline).then(
          function (response) {
            var modalDefaults = {
                size: 'sm'
            };

            var modalOptions = {
                headerText: 'Updated!',
                bodyText: 'The guideline ' + response.config.data.id + ' has been updated.'
            };
            modalService.showModal(modalDefaults, modalOptions);   
          },
          function (response) {
            var modalDefaults = {
                size: 'sm'
            };

            var modalOptions = {
                headerText: 'Error!',
                bodyText: 'The guideline ' + response.config.data.id + ' has not been updated.'
            };
            modalService.showModal(modalDefaults, modalOptions);
            
            $log.info('Error at inserting guide (code status ' + response.status + '): ' + response);
          }
        )
      };

    }
  });
})();
