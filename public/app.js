/**
 * Created by jbarros on 22/02/2015.
 */

angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'dialogs',
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

.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/main/tab-description");
    $stateProvider
        .state("main", { abtract: true,  url: "/main",              templateUrl: "views/main.html" })
        .state("main.tab-description",  {url: "/tab-description",   templateUrl: "views/tab-description.html" })
        .state("main.tab-terminology",  {url: "/tab-terminology",   templateUrl: "views/tab-terminology.html" })
        .state("main.tab-drag-and-drop",{url: "/tab-drag-and-drop", templateUrl: "views/tab-drag-and-drop.html" })
        .state("main.tab-drag-and-drop-2",{url: "/tab-drag-and-drop-2", templateUrl: "views/tab-drag-and-drop-2.html" })
        .state("main.tab-multiselect",  {url: "/tab-multiselect",   templateUrl: "views/tab-multiselect.html" })
        .state("main.tab-dialog",       {url: "/tab-dialog",        templateUrl: "views/tab-dialog.html" })
        .state("main.tab-input",        {url: "/tab-input",         templateUrl: "views/tab-input.html" });
});

