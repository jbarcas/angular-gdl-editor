/**
 * Created by jbarros on 10/04/16.
 */


angular.module('app')

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/main/tab-description");
        $stateProvider
            .state("main", {
                abtract: true,
                url: "/main",
                templateUrl: "views/main.html",
                controller: "MainCtrl"
            })
            .state("main.tab-description", {
                url: "/tab-description",
                templateUrl: "views/tab-description.html",
                controller: "DescriptionCtrl"
            })
            .state("main.tab-terminology", {
                url: "/tab-terminology",
                templateUrl: "views/tab-terminology.html",
                controller: "TerminologyCtrl"
            })
            .state("main.tab-definitions", {
                url: "/tab-definitions",
                templateUrl: "views/tab-definitions.html",
                controller: "DefinitionsCtrl"
            })
            .state("main.tab-gdl", {
                url: "/tab-gdl",
                templateUrl: "views/tab-gdl.html",
                controller: "GdlCtrl"
            })
            .state("main.tab-multiselect", {
                url: "/tab-multiselect",
                templateUrl: "views/tab-multiselect.html",
                controller: "FormCtrl"
            })
            .state("main.tab-dialog", {
                url: "/tab-dialog",
                templateUrl: "views/tab-dialog.html",
                controller: "DialogCtrl"
            });
    });