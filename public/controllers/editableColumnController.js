/**
 * Created by jbarros on 23/02/2015.
 */

app.controller('EditableColumnController', function($scope, $filter, $http, $q) {
    
    $scope.terms = [
        {id: 1, code: 'gt0001', status: 2, group: 4, groupName: 'admin'},
        {id: 2, code: 'gt0002', status: undefined, group: 3, groupName: 'vip'},
        {id: 3, code: 'gt0003', status: 2, group: null}
    ];

    $scope.statuses = [
        {value: 1, text: 'status1'},
        {value: 2, text: 'status2'},
        {value: 3, text: 'status3'},
        {value: 4, text: 'status4'}
    ];

    $scope.groups = [];
    $scope.loadGroups = function() {
        return $scope.groups.length ? null : $http.get('/groups').success(function(data) {
            $scope.groups = data;
        });
    };

    $scope.showGroup = function(user) {
        if(user.group && $scope.groups.length) {
            var selected = $filter('filter')($scope.groups, {id: user.group});
            return selected.length ? selected[0].text : 'Not set';
        } else {
            return user.groupName || 'Not set';
        }
    };

    $scope.showStatus = function(user) {
        var selected = [];
        if(user.status) {
            selected = $filter('filter')($scope.statuses, {value: user.status});
        }
        return selected.length ? selected[0].text : 'Not set';
    };

    $scope.checkName = function(data) {
        if (data !== 'gt0005') {
            return "gt code should be `gt0005`";
        }
    };

    $scope.saveColumn = function(column) {
        var results = [];
        angular.forEach($scope.terms, function(user) {
            results.push($http.post('/saveColumn', {column: column, value: user[column], id: user.id}));
        })
        return $q.all(results);
    };

});

app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});