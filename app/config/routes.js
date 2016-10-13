/**
 * Created by jbarros on 10/04/16.
 */

angular.module('app')

  .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/tabs/tab-guidelines");
      $stateProvider
        .state("tab-guidelines", {
          url: "/tab-guidelines",
          templateUrl: "components/tabs/tab-guidelines/tab-guidelines.html",
          controller: "GuidelineCtrl",
          controllerAs: "vm"
        })
        .state("tab-description", {
          url: "/tab-description",
          templateUrl: "components/tabs/tab-description/tab-description.html",
          controller: "DescriptionCtrl",
          controllerAs: "vm"
        })
        .state("tab-terminology", {
          url: "/tab-terminology",
          templateUrl: "components/tabs/tab-terminology/tab-terminology.html",
          controller: "TerminologyCtrl",
          controllerAs: "vm"
        })
        .state("tab-definitions", {
          url: "/tab-definitions",
          templateUrl: "components/tabs/tab-definitions/tab-definitions.html",
          controller: "DefinitionsCtrl",
          controllerAs: "vm"
        })
        .state("tab-gdl", {
          url: "/tab-gdl",
          templateUrl: "views/tabs/tab-gdl.html",
          controller: "GdlCtrl"
        })
        .state("tab-multiselect", {
          url: "/tab-multiselect",
          templateUrl: "views/tabs/tab-multiselect.html",
          controller: "FormCtrl"
        });
  });