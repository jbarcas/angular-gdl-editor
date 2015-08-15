/**
 * Created by jbarros on 12/07/15.
 */

angular.module('app').controller("MainCtrl", MainCtrl);

function MainCtrl ($rootScope, $scope, $state) {

    $scope.go = function(route){
        $state.go(route);
    };

    $scope.active = function(route){
        return $state.is(route);
    };

    $scope.tabs = [
        { heading: "Description", route:"main.tab-description", active:false },
        { heading: "Terminology", route:"main.tab-terminology", active:false },
        { heading: "Drag & Drop(I)", route:"main.tab-drag-and-drop", active:false },
        { heading: "Drag & Drop(II)", route:"main.tab-drag-and-drop-2", active:false },
        { heading: "Multi-select", route:"main.tab-multiselect", active:false },
        { heading: "Dialog", route:"main.tab-dialog", active:false }
    ];

    $scope.$on("$stateChangeSuccess", function() {
        $scope.tabs.forEach(function(tab) {
            tab.active = $scope.active(tab.route);
        });
    });
}
