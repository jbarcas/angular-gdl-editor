/**
 * Created by jbarros on 03/02/2015.
 */

angular.module('angularGDLEditor', ['ui.bootstrap', 'ui.grid', 'ngDraggable']).controller('mainController', mainController);
angular.module('angularGDLEditor').controller('TabsDemoCtrl', TabsDemoCtrl);
angular.module('angularGDLEditor').controller('GridCtrl', GridCtrl);
angular.module('angularGDLEditor').controller('DragAndDropCtrl', DragAndDropCtrl);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all guides and show them
    $http.get('/api/guides')
        .success(function(data) {
            $scope.guides = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createGuide = function() {
        $http.post('/api/guides', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.guides = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a guide after checking it
    $scope.deleteGuide = function(id) {
        $http.delete('/api/guides/' + id)
            .success(function(data) {
                $scope.guides = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

};

function TabsDemoCtrl ($scope, $window) {
    $scope.tabs = [
        { title:'Dynamic Title 1', content:'Dynamic content 1' },
        { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];

    $scope.alertMe = function() {
        setTimeout(function() {
            $window.alert('You\'ve selected the alert tab!');
        });
    };
};


function GridCtrl ($scope) {
    $scope.myData = [
        {name: "Moroni", age: 50},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34}
    ];
    $scope.gridOptions = {
        data: 'myData',
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        columnDefs: [{field: 'name', displayName: 'Name', enableCellEdit: true},
            {field:'age', displayName:'Age', enableCellEdit: true}]
    };
};



//function DragAndDropCtrl ($scope) {
//    $scope.list1 = {title: 'AngularJS - Drag Me'};
//    $scope.list2 = {};
//};

function DragAndDropCtrl ($scope) {
    $scope.centerAnchor = true;
    $scope.toggleCenterAnchor = function () {$scope.centerAnchor = !$scope.centerAnchor}
    $scope.draggableObjects = [{name:'one'}, {name:'two'}, {name:'three'}];
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
};

