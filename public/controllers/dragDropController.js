/**
 * Created by jbarros on 22/02/2015.
 */

app.controller('DragDropController', function($scope) {

    $scope.centerAnchor = true;
    $scope.toggleCenterAnchor = function () {$scope.centerAnchor = !$scope.centerAnchor}
    $scope.draggableObjects = [{name:'one'}, {name:'two'}, {name:'three'}, {name:'four'}, {name:'five'}, {name:'six'}];
    $scope.droppedObjects1 = [];
    $scope.droppedObjects2= [];
    $scope.onDropComplete1=function(data,evt){
        var index = $scope.droppedObjects1.indexOf(data);
        if (index == -1)
            $scope.droppedObjects1.push(data);
    }
    $scope.onDragSuccess1=function(data,evt){
        console.log("133","$scope","onDragSuccess1", "", evt);
        var index = $scope.droppedObjects1.indexOf(data);
        if (index > -1) {
            $scope.droppedObjects1.splice(index, 1);
        }
    }
    $scope.onDragSuccess2=function(data,evt){
        var index = $scope.droppedObjects2.indexOf(data);
        if (index > -1) {
            $scope.droppedObjects2.splice(index, 1);
        }
    }
    $scope.onDropComplete2=function(data,evt){
        var index = $scope.droppedObjects2.indexOf(data);
        if (index == -1) {
            $scope.droppedObjects2.push(data);
        }
    }
    var inArray = function(array, obj) {
        var index = array.indexOf(obj);
    }
});
