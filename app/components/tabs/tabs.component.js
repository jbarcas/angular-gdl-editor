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
        {heading: "Rule list", route: "tab-rulelist", active: false, disabled: false},
        {heading: "Preconditions", route: "tab-preconditions", active: true, disabled: true},
        {heading: "Terminology", route: "tab-terminology", active: false, disabled: false},
        {heading: "Binding", route: "tab-binding", active: false, disabled: true},
        {heading: "GDL", route:"tab-gdl", active: false, disabled: false},
        {heading: "HTML", route:"tabs.tab-html", active: false, disabled: true}
      ];

      this.go = function (route) {
        $state.go(route);
      };

      var item;
      /*
       * Check if there are elements unselected (i.e. in process of creation [marked in red])
       */
      function areUnselectedItems (guideline) {
        for(var archetypeBinding in guideline.definition.archetypeBindings) {
          for(var element in guideline.definition.archetypeBindings[archetypeBinding].elements) {
            if(guideline.definition.archetypeBindings[archetypeBinding].elements[element].unselected) {
              item = guideline.definition.archetypeBindings[archetypeBinding];
              return true;
            }
          }
        }
        return false;
      }

      this.insertGuide = function () {
        var guideline = guidelineFactory.getCurrentGuide();

        if(areUnselectedItems(guideline)) {
          var modalDefaults = {component: 'dialogComponent'};
          var modalOptions = {
            headerText: 'Guideline not updated!',
            bodyText: 'You have an item with no link to the archetype "' + item.archetypeId + '"'
          };
          modalService.showModal(modalDefaults, modalOptions);
          return;
        }

        guideline = utilsFactory.convertToPost(guideline);

        guidelineFactory.insertGuideline(guideline).then(insertGuidelineComplete, insertGuidelineFailed);

        function insertGuidelineComplete(response) {
          var modalOptions = {size: 'sm', component: 'dialogComponent'};
          var modalData = {headerText: 'Updated!', bodyText: 'The guideline' + response.config.data.id + ' has been updated.'};
          modalService.showModal(modalOptions, modalData);
        };

        function insertGuidelineFailed(response) {
          var modalDefaults = {size: 'sm'};

          var modalOptions = {
            headerText: 'Error!',
            bodyText: 'The guideline ' + response.config.data.id + ' has not been updated.'
          };
          modalService.showModal(modalDefaults, modalOptions);
          $log.info('Error at inserting guide (code status ' + response.status + '): ' + response);
        };

        this.active = 0;
        $state.go('tab-guidelines');
      };

    }
  });
})();
