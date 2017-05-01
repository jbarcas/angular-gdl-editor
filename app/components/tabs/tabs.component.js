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
        /*
         * In archetypeBindings
         */
        for(var archetypeBinding in guideline.definition.archetypeBindings) {
          for(var element in guideline.definition.archetypeBindings[archetypeBinding].elements) {
            if(guideline.definition.archetypeBindings[archetypeBinding].elements[element].unselected) {
              item = guideline.definition.archetypeBindings[archetypeBinding];
              return true;
            }
          }
        }
        /*
         * In rules
         */
        for (var rule in guideline.definition.rules) {
          for (var i=0; i<guideline.definition.rules[rule].whenStatements.length; i++) {
            if (guideline.definition.rules[rule].whenStatements[i].expressionItem.left.unselected ||guideline.definition.rules[rule].whenStatements[i].expressionItem.right.unselected) {
              item = guideline.definition.rules[rule];
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
          var text;
          if (item.archetypeId) {
            text = 'You have an item with no link to the archetype "' + item.archetypeId + '"'
          } else {
            text = 'You have an item with no link to the rule "' + guidelineFactory.getOntology().termDefinitions.en.terms[item.id].text + '" in conditions'
          }

          var modalOptions = {
            headerText: 'Guideline not updated!',
            bodyText: text
          };
          modalService.showModal(modalDefaults, modalOptions);
          return;
        }

        guideline = utilsFactory.convertToPost(guideline);

        guidelineFactory.insertGuideline(guideline).then(insertGuidelineComplete, insertGuidelineFailed);

        function insertGuidelineComplete(response) {
          var modalOptions = {component: 'dialogComponent'};
          var modalData = {headerText: 'Updated!', bodyText: 'The guideline' + response.config.data.id + ' has been updated.'};
          modalService.showModal(modalOptions, modalData);
        };

        function insertGuidelineFailed(response) {
          var modalDefaults = {size: 'md'};

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
