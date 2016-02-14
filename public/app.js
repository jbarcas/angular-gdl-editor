/**
 * Created by jbarros on 22/02/2015.
 */

angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ui.sortable',
    'app.core',
    'app.services',
    'app.directives',
    'xeditable',
    'ngDialog',
    'jsTree.directive',
    'ngDragDrop',
    'ngResource',
    'ui.tree'
])

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
                controller: "DragDropCtrl"
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

