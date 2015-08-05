/**
 * Created by jbarros on 22/02/2015.
 */

app.controller('RestController', function($scope, $http) {

    var urlBase = "http://localhost:8080/km/admin";

    $scope.formData = {};
    $scope.checked;

    // when landing on the page, get all guides and show them
/*    $http.get('/api/guides')
        .success(function(data) {
            $scope.guides = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        }); */

    $http.get(urlBase + '/guidelines')
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
        $http.delete(urlBase + '/guidelines/' + id)
            .success(function(data) {
                $scope.guides = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a guide after checking it
    $scope.showGuide = function(id) {
        $http.get(urlBase + '/guidelines/json/' + id)
            .success(function(data) {
                $scope.checked = id;
                $scope.currentGuide = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

});