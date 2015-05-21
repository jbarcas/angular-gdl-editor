/**
 * Created by jbarros on 11/05/15.
 */

$(function() {
    $("#catalog").accordion();
});

app.controller('DragDropController', function($scope) {

    $scope.drop = true;

    $scope.list1 = {title: 'Archetype instantiation', drag: true};
    $scope.list2 = {title: 'Element instantiation'};
    $scope.list3 = {title: 'Predicate (DataValue)'};
    $scope.list4 = {drag: true};
    $scope.list5 = [];

    $scope.dropCallback = function(event, ui, item) {
        item.drag = false;
    };
});