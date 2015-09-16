/**
 * Created by jbarros on 22/02/2015.
 */

angular.module('app').controller('RestCtrl', RestCtrl);

function RestCtrl ($scope, guideFactory, archetypeFactory) {

    $scope.guide = {};
    $scope.archetype = {};
    $scope.checked;

    getGuides();
    getArchetypes();

    function getGuides() {
        guideFactory.getGuides()
            .success(function(data) {
                $scope.guides = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.getGuide = function(id) {
        guideFactory.getGuide(id)
            .success(function(data, status, headers, config) {
                $scope.checked = id;
                $scope.guide = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error at getting guide: ' + data);
            });
    };

    $scope.insertGuide = function () {
        guideFactory.insertGuide($scope.guide)
            .success(function (data, status, headers, config) {
                alert($scope.guide.id + "updated!");
            }).
            error(function (data, status, headers, config) {
                console.log('Error at inserting guide: ' + data);
            })
    };

    function getArchetypes() {
        archetypeFactory.getArchetypes()
            .success(function(data) {
                $scope.archetypes = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    $scope.getArchetype = function(id) {
        archetypeFactory.getArchetype(id)
            .success(function(data, status, headers, config) {
                $scope.archetype = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error at getting archetype: ' + data);
            });
    };

}
