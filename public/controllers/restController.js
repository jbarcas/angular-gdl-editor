/**
 * Created by jbarros on 22/02/2015.
 */

app.controller('RestController', function($scope, $http) {

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

});