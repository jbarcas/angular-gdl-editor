/**
 * Created by jbarros on 22/02/2015.
 */

app.controller('editableRowController', function($scope, $filter, $http) {

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
        //return $scope.groups.length ? null : $scope.groups = [
        //    {id: 1, text: 'user'},
        //    {id: 2, text: 'customer'},
        //    {id: 3, text: 'vip'},
        //    {id: 4, text: 'admin'}
        //]
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

    $scope.checkName = function(data, id) {
        if (id === 2 && data !== 'gt0005') {
            return "code 2 should be 'gt0005'";
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

    // add user
    $scope.addUser = function() {
        $scope.inserted = {
            id: $scope.terms.length+1,
            code: '',
            status: null,
            group: null
        };
        $scope.terms.push($scope.inserted);
    };
});

app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});