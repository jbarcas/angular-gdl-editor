/**
 * Created by jbarros on 10/04/16.
 */

angular.module('app')

    .controller('CreateElementCtrl', function ($scope, archetypeFactory, $log, gtService, ngDialog) {

        var element = {};

        $scope.elements = getArchetypeElements($scope.archetypeBinding);

        function getArchetypeElements(archetypeBinding) {
            archetypeFactory.getArchetype(archetypeBinding.archetypeId)
                .success(function (data) {
                    $scope.elements = data.elementMaps;
                    $scope.elementIds = Object.keys($scope.elements);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                })
        }

        $scope.changedCB = function (e, data) {
            var i, j, r = [];
            for (i = 0, j = data.selected.length; i < j; i++) {
                r.push(data.instance.get_node(data.selected[i]).text);
            }
            $scope.value = r.join(', ');
        };



        $scope.getSelectedCB = function(e) {
            console.log(e);
        }

        $scope.readyCB = function() {
            $log.info('ready called');
        };

        $scope.createNodeCB = function(e,item) {
            $log.info('create_node called');
        };

        $scope.accept = function () {
            //element.id = gtService.generateGt($scope.guide.ontology.termDefinitions[$scope.language].terms);
            element.id = gtService.generateGt($scope.guide);
            element.path = $scope.elements[$scope.value].path;
            element.name = $scope.value;
            $scope.archetypeBinding.elements.push(element);
            ngDialog.close();
        }

        $scope.cancel = function () {
            ngDialog.close();
        }

    })

    .controller('UpdateElementCtrl', function ($scope, archetypeFactory) {

        $scope.elements = getArchetypeElements($scope.archetypeBinding);

        function getArchetypeElements(archetypeBinding) {
            archetypeFactory.getArchetype(archetypeBinding.archetypeId)
                .success(function (data) {
                    $scope.elements = data.elementMaps;
                    $scope.elementIds = Object.keys($scope.elements);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                })
        }

        $scope.changedCB = function (e, data) {
            var i, j, r = [];
            for (i = 0, j = data.selected.length; i < j; i++) {
                r.push(data.instance.get_node(data.selected[i]).text);
            }
            $scope.value = r.join(', ');

            var element = new Object();
            element.id = $scope.element.id;
            element.path = $scope.elements[$scope.value].path;
            element.name = $scope.value;
            $scope.archetypeBinding.elements[$scope.elementIndex] = element;
        };
    });