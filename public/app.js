/**
 * Created by jbarros on 22/02/2015.
 */


app = angular.module('gdl-editor', ['ui.router',
                                    'ui.bootstrap',
                                    'dialogs',
                                    'ui.sortable',
                                    'configuration',
                                    'gdl-editor.services',
                                    'xeditable',
                                    'ngDialog',
                                    'jsTree.directive',
                                    'ngDragDrop',
                                    'ngResource'])

.config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise("/main/tabDescription");

    $stateProvider
        .state("main", { abtract: true, url: "/main",           templateUrl: "views/main.html" })
        .state("main.tabDescription", { url: "/tabDescription", templateUrl: "views/tabDescription.html" })
        .state("main.tabGrid", {        url: "/tabGrid",        templateUrl: "views/tabGrid.html" })
        .state("main.tabDragDrop", {    url: "/tabDragDrop",    templateUrl: "views/tabDragDrop.html" })
        .state("main.tabMultiSelect", { url: "/tabMultiSelect", templateUrl: "views/tabMultiSelect.html" })
        .state("main.tabDialog", {      url: "/tabDialog",      templateUrl: "views/tabDialog.html" })
        .state("main.tabInput", {       url: "/tabInput",       templateUrl: "views/tabInput.html" });

});

