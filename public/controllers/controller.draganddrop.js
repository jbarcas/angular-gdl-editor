/**
 * Created by jbarros on 11/05/15.
 */

$(function() {
    $("#catalog").accordion();
});

angular.module('app').controller('DragDropCtrl', function($scope) {

    $scope.remove = function (scope) {
        scope.remove();
    };

    $scope.toggle = function (scope) {
        scope.toggle();
    };

    $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
    };

    $scope.newSubItem = function (scope) {
/*      var nodeData = scope.$modelValue;
        nodeData.elements.push({
            id: nodeData.id * 10 + nodeData.nodes.length,
            title: nodeData.title + '.' + (nodeData.nodes.length + 1),
            nodes: []
        }); */
    };

    $scope.collapseAll = function () {
        $scope.$broadcast('collapseAll');
    };

    $scope.expandAll = function () {
        $scope.$broadcast('expandAll');
    };

    $scope.openArchetypes = function () {
        alert("show Archetype tree modal");
    };

});