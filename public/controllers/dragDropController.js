/**
 * Created by jbarros on 11/05/15.
 */

$(function() {
    $("#catalog").accordion();
});

app.controller('DragDropController', function($scope) {

    $scope.drop = true;

    $scope.list0 = [{title: 'Archetype instantiation', drag: true}];
    $scope.list1 = [{title: 'Element instantiation'}, {title: 'Predicate (DataValue)'}, {title: 'Predicate (Function)'}, {title: 'Predicate (Exists)'}, {title: 'Predicate (Expression)'} ];
    $scope.list2 = {drag: true};
    $scope.list3 = [];

    $scope.dropCallback = function(event, ui, item) {
        item.drag = false;
    };
});