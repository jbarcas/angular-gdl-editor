/**
 * Created by jbarros on 22/02/2015.
 */

app.controller('EditableRowController', function($scope, $filter, $http) {

    $scope.terms = [
        {id: 1, code: 'gt0001', description: 2, status: 4, statusName: 'status 4'},
        {id: 2, code: 'gt0002', description: undefined, status: 3, statusName: 'status 3'},
        {id: 3, code: 'gt0003', description: 2, status: null}
    ];

    $scope.descriptions = [
        {value: 1, text: 'description1'},
        {value: 2, text: 'description2'},
        {value: 3, text: 'description3'},
        {value: 4, text: 'description4'}
    ];

    $scope.statuses = [];
    $scope.loadStatuses = function() {
        //return $scope.statuses.length ? null : $http.get('/statuses').success(function(data) {
        //    $scope.statuses = data;
        //});
        return $scope.statuses.length ? null : $scope.statuses = [
            {id: 1, text: 'status 1'},
            {id: 2, text: 'status 2'},
            {id: 3, text: 'status 3'},
            {id: 4, text: 'status 4'}
        ]
    };

    $scope.showStatus = function(term) {
        if(term.status && $scope.statuses.length) {
            var selected = $filter('filter')($scope.statuses, {id: term.status});
            return selected.length ? selected[0].text : 'Not set';
        } else {
            return term.statusName || 'Not set';
        }
    };

    $scope.showDescription = function(term) {
        var selected = [];
        if(term.description) {
            selected = $filter('filter')($scope.descriptions, {value: term.description});
        }
        return selected.length ? selected[0].text : 'Not set';
    };

    $scope.checkName = function(data, id) {
        if (id === 2 && data !== 'gt0005') {
            return "term 2 should be 'gt0005'";
        }
    };

    $scope.saveUser = function(data, id) {
        //$scope.user not updated yet
        angular.extend(data, {id: id});
        //return $http.post('/saveUser', data);
        data = angular.fromJson(data);
        return [200, {status: 'ok'}];
    };

    // remove user
    $scope.removeUser = function(index) {
        $scope.terms.splice(index, 1);
    };

    // add term
    $scope.addUser = function() {
        $scope.inserted = {
            id: $scope.terms.length+1,
            code: '',
            description: null,
            status: null
        };
        $scope.terms.push($scope.inserted);
    };
});

//app.run(function(editableOptions) {
//    editableOptions.theme = 'bs3';
//});