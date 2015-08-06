/**
 * Created by jbarros on 12/07/15.
 */

app.controller("mainController", function($rootScope, $scope, $state) {

    $scope.go = function(route){
        $state.go(route);
    };

    $scope.active = function(route){
        return $state.is(route);
    };

    $scope.tabs = [
        { heading: "Description", route:"main.tabDescription", active:false },
        { heading: "Grid", route:"main.tabGrid", active:false },
        { heading: "Drag & Drop", route:"main.tabDragDrop", active:false },
        { heading: "Multi-select", route:"main.tabMultiSelect", active:false },
        { heading: "Dialog", route:"main.tabDialog", active:false },
        { heading: "Input", route:"main.tabInput", active:false }
    ];

    $scope.$on("$stateChangeSuccess", function() {
        $scope.tabs.forEach(function(tab) {
            tab.active = $scope.active(tab.route);
        });
    });
});
