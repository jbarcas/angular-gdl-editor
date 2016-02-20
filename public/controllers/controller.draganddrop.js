/**
 * Created by jbarros on 11/05/15.
 */

angular.module('app').controller('DragDropCtrl', function ($scope, $log, archetypeFactory) {

    $scope.treeOptions = {
        accept: function(sourceNodeScope, destNodesScope, destIndex) {

            $log.debug("sourceNodeScope.$parent.$type: " + sourceNodeScope.$parent.$type);

            $log.debug("sourceNodeScope.$type: " + sourceNodeScope.$type);

            $log.debug("destNodesScope.$parent.$type: " + destNodesScope.$parent.$type);

            $log.debug("destNodesScope.$type: " + destNodesScope.$type);

            if (sourceNodeScope.depth() === 2 && destNodesScope.depth() === 1) {
                return true;
            } else if (sourceNodeScope.depth() === 1 && destNodesScope.depth() === 0) {
                return true;
            } else{
                return false;
            }

        }
    };

    $scope.path = {};

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

    $scope.openElements = function () {
        alert("show elements tree modal");
    };

});