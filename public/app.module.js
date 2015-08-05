/**
 * Created by jbarros on 22/02/2015.
 */


app = angular.module('GDLEditor', ['ui.router', 'ui.bootstrap', 'xeditable', 'ngDialog', 'jsTree.directive', 'ngDragDrop']);

app.config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise("/main/tabRest");

    $stateProvider
        .state("main", { abtract: true, url:"/main",            templateUrl: "views/main.html" })
        .state("main.tabRest", {        url: "/tabRest",        templateUrl: "views/tabRest.html" })
        .state("main.tabGrid", {        url: "/tabGrid",        templateUrl: "views/tabGrid.html" })
        .state("main.tabDragDrop", {    url: "/tabDragDrop",    templateUrl: "views/tabDragDrop.html" })
        .state("main.tabMultiSelect", { url: "/tabMultiSelect", templateUrl: "views/tabMultiSelect.html" })
        .state("main.tabDialog", {      url: "/tabDialog",      templateUrl: "views/tabDialog.html" })
        .state("main.tabInput", {       url: "/tabInput",       templateUrl: "views/tabInput.html" });

});

