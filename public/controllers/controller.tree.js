/**
 * Created by jbarros on 16/04/15.
 */

angular.module('app').controller('TreeCtrl', function($scope) {

    $scope.arbol = [{
        "id": "ajson1",
        "parent": "#",
        "text": "Simple root node"
    }, {
        "id": "ajson2",
        "parent": "#",
        "text": "Root node 2"
    }, {
        "id": "ajson3",
        "parent": "ajson2",
        "text": "Child 1"
    }, {
        "id": "ajson4",
        "parent": "ajson2",
        "text": "Child 2"
    }]
});

