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
        .state("tab-definitions", {
          url: "/tab-definitions",
          templateUrl: "components/tabs/tab-definitions/tab-definitions.html",
          controller: "DefinitionsCtrl",
          controllerAs: "vm"
        })
        .state("tab-rulelist", {
          url: "/tab-rulelist",
          templateUrl: "components/tabs/tab-rulelist/tab-rulelist.html",
          controller: "RulelistCtrl",
          controllerAs: "vm"
        })
        .state("rule-editor", {
          url: "/rule-editor/:ruleId",
          templateUrl: "components/tabs/tab-rulelist/rule-editor.html",
          controller: "RuleEditorCtrl",
          controllerAs: "vm"
        })
        .state("tab-preconditions", {
          url: "/tab-preconditions",
          templateUrl: "components/tabs/tab-preconditions/tab-preconditions.html",
          controller: "PreconditionsCtrl",
          controllerAs: "vm"
        })
        .state("tab-terminology", {
          url: "/tab-terminology",
          templateUrl: "components/tabs/tab-terminology/tab-terminology.html",
          controller: "TerminologyCtrl",
          controllerAs: "vm"
        })
        .state("tab-bindings", {
          url: "/tab-bindings",
          templateUrl: "components/tabs/tab-binding/tab-bindings.html",
          controller: "BindingsCtrl",
          controllerAs: "vm"
        })
        .state("tab-gdl", {
          url: "/tab-gdl",
          templateUrl: "components/tabs/tab-gdl/tab-gdl.html",
          controller: "GdlCtrl",
          controllerAs: "vm"
        })
        .state("tab-html", {
          url: "/tab-html",
          templateUrl: "components/tabs/tab-html/tab-html.html",
          controller: "HtmlCtrl",
          controllerAs: "vm"
        });
  });