(function(){
  'use strict';
  var app = angular.module('app.components');

  app.component('gdlTabs', {
    templateUrl: 'components/tabs/tabs.component.html',
    controller: function ($state, $log, guidelineFactory, utilsFactory, modalService, SharedProperties) {

      var $ctrl = this;

      $ctrl.tabs = [
        {heading: "Guidelines", route: "tab-guidelines"},
        {heading: "Description", route: "tab-description"},
        {heading: "Definitions", route: "tab-definitions"},
        {heading: "Rule list", route: "tab-rulelist"},
        {heading: "Preconditions", route: "tab-preconditions"},
        {heading: "Terminology", route: "tab-terminology"},
        {heading: "Binding", route: "tab-bindings"},
        {heading: "GDL", route:"tab-gdl"},
        {heading: "HTML", route:"tab-html"}
      ];

      $ctrl.go = function (route) {
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
          if(typeof guideline.definition.rules[rule].whenStatements === 'undefined') {
            continue;
          }
          for (var i=0; i<guideline.definition.rules[rule].whenStatements.length; i++) {
            if (guideline.definition.rules[rule].whenStatements[i].expressionItem.left.unselected ||guideline.definition.rules[rule].whenStatements[i].expressionItem.right.unselected) {
              item = guideline.definition.rules[rule];
              return true;
            }
          }
        }


        return false;
      }

      $ctrl.insertGuide = function () {
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
          // Active the Guidelines tab
          $ctrl.active = 0;
        }

        function insertGuidelineFailed(response) {
          var modalDefaults = {size: 'md'};

          var modalOptions = {
            headerText: 'Error!',
            bodyText: 'The guideline ' + response.config.data.id + ' has not been updated.'
          };
          modalService.showModal(modalDefaults, modalOptions);
          $log.info('Error at inserting guide (code status ' + response.status + '): ' + response);
        }

        $state.go('tab-guidelines');
      };

      $ctrl.newGuide = function () {
        var modalOptions = {
          component: "modalWithInputAndDropdownComponent",
          resolve: {
            input: {
              value: ""
            }
          }
        };

        var modalData = {
          headerText: "New Guideline",
          bodyText: "Name",
          placeholder: "Guideline name"
        };

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
          // If no selection, do nothing
          if (modalResponse.data === undefined) {
            return;
          }
          // Retrieve the guideline name from user input
          var guidelineName = modalResponse.data.input.value;
          // Set the guideline as the current one
          guidelineFactory.newGuideline(guidelineName);
          // Set the new guideline as checked
          SharedProperties.setChecked(guidelineName);
          // Active the Description tab
          $ctrl.active = 1;
        }

        function showModalFailed() {
          $log.info('Modal dismissed at: ' + new Date() + ' in updateRightItem');
        }
      }

    }
  });
})();
