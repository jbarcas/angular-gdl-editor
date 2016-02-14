/**
 * Created by jbarros on 22/02/2015.
 */

angular.module('app').controller('RestCtrl', RestCtrl);

function RestCtrl($scope, guideFactory, archetypeFactory) {

    $scope.guide = {};
    $scope.guideUpload = {};
    $scope.archetype = {};
    $scope.checked;

    getGuides();
    getArchetypes();

    function getGuides() {
        guideFactory.getGuides()
            .success(function (data) {
                $scope.guides = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.getGuide = function (id) {
        guideFactory.getGuide(id)
            .success(function (data, status, headers, config) {
                $scope.checked = id;
                $scope.guide = data;
                // FIXME: Handle with an interceptor??
                $scope.guide.definition.archetypeBindings = getArchetypeBindings($scope.guide.definition.archetypeBindings);
                console.log(data);
            })
            .error(function (data) {
                console.log('Error at getting guide: ' + data);
            });
    };

    $scope.insertGuide = function () {
        angular.copy($scope.guide, $scope.guideUpload);
        guideFactory.insertGuide($scope.guideUpload)
            .success(function (data, status, headers, config) {
                alert($scope.guide.id + "updated!");
            }).
            error(function (data, status, headers, config) {
                console.log('Error at inserting guide: ' + data);
            })
    };

    function getArchetypeBindings(archetypeBindings) {
        var archetypeBindingsArray = Object.keys(archetypeBindings).map(function (key) {
            archetypeBindings[key].elements = getElements(archetypeBindings[key].elements, archetypeBindings[key].archetypeId);
            return archetypeBindings[key];
        });
        $scope.guide.definition.archetypeBindings = archetypeBindingsArray;
        return archetypeBindingsArray;
    }

    function getElements(elements, archetypeId) {
        if (elements == null) {
            return [];
        }
        var elementsArray = Object.keys(elements).map(function (key) {
            /*
             * Create "name" property used to map the element path with its name
             */
            archetypeFactory.getArchetype(archetypeId)
                .then(function (data) {
                    angular.forEach(data.elementMaps, function (_value, _key) {
                        if (_value.path === elements[key].path) {
                            elements[key].name = _value.elementMapId;
                        }
                    })
                })
                .catch(function (err) {
                    console.log('Error at getting archetype: ' + err);
                });
            return elements[key];
        });
        return elementsArray;
    }

    function getArchetypes() {
        archetypeFactory.getArchetypes()
            .success(function (data) {
                $scope.archetypes = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }

    $scope.getArchetype = function (id) {
        archetypeFactory.getArchetype(id)
            .success(function (data, status, headers, config) {
                $scope.archetype = data;
            })
            .error(function (data) {
                console.log('Error at getting archetype: ' + data);
            });
    };

}
