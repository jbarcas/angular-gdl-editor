/**
 * Created by jbarros on 11/05/15.
 */

angular.module('app').controller('DefinitionsCtrl', function ($scope, ngDialog, gtService, guideFactory) {

    $scope.delete = "../images/delete.png";
    $scope.add = "../images/add.png";
    //$scope.guide = {};

    /*
     * Options to manage the drag and drop nested level
     */
    $scope.treeOptions = {
        accept: function (sourceNodeScope, destNodesScope) {
            if ((sourceNodeScope.depth() === 2 && destNodesScope.depth() === 1) ||
                (sourceNodeScope.depth() === 1 && destNodesScope.depth() === 0)) {
                return true;
            } else {
                return false;
            }
        }
    };

    $scope.removeArchetype = function (scope) {
        var result = true;
        angular.forEach(scope.$modelValue.elements, function (element, index) {
            if (existsInRules(element) || existsInPreconditions(element)) {
                result = false;
            }
        })
        result ? scope.remove() : alert("The element you are trying to delete is being used. These references must be deleted before proceeding");
    }


    /*
     * Removes an archetype element (if it is possible due to element usage)
     */
    $scope.removeElement = function (scope) {
        var element = scope.$modelValue;
        if (existsInRules(element) || existsInPreconditions(element)) {

            ngDialog.open({
                template: '../views/modals/popupElement.html',
                className: 'ngdialog-theme-default'
            });
        } else {
            scope.remove();
        }

    };


    /*
     * Checks if the element is being used in the rules
     */
    var existsInRules = function(element) {

        var rules = $scope.guide.definition.rules;

        if(Object.keys(rules).indexOf(element.id) !== -1) {
            return true;
        }

        for(var index in rules) {
            var rule = rules[index];
            for (var i=0; i<rule.then.length; i++) {
                var item = rule.then[i];
                if(item.indexOf(element.id) > -1) {
                    return true;
                }
            }
            for (var i=0; i<rule.when.length; i++) {
                var item = rule.when[i];
                if(item.indexOf(element.id) > -1) {
                    return true;
                }
            }
        }

        return false;
    }

    /*
     * Checks if the element is being used in the preconditions
     */
    var existsInPreconditions = function(element) {
        var result = false;
        angular.forEach($scope.guide.definition.preConditions, function(item) {
            if (item.indexOf(element.id) > -1) {
                result =  true;
            }
        })
        return result;
    }

    $scope.toggle = function (scope) {
        scope.toggle();
    };

    $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
    };

    $scope.newElement = function (scope) {
        $scope.archetypeBinding = scope.$modelValue;
        ngDialog.open({
            template: '../views/modals/modalCreateElement.html',
            className: 'ngdialog-theme-default',
            controller: 'CreateElementCtrl',
            scope: $scope
        });
    };

    $scope.collapseAll = function () {
        $scope.$broadcast('collapseAll');
    };

    $scope.expandAll = function () {
        $scope.$broadcast('expandAll');
    };

    $scope.clickToOpen = function (node) {
        $scope.node = node;
        ngDialog.open({
            template: '../views/modals/modalArchetypes.html',
            className: 'ngdialog-theme-default',
            controller: 'TemplateCtrl',
            scope: $scope
        });
    };


    $scope.clickToClose = function () {
        ngDialog.close();
    }

    $scope.openArchetypes = function () {
        alert("show Archetype tree modal");
    };

    $scope.openElements = function (archetypeBinding, element, elementIndex) {
        $scope.archetypeBinding = archetypeBinding;
        $scope.element = element;
        $scope.elementIndex = elementIndex;
        ngDialog.open({
            template: '../views/modals/modalUpdateElement.html',
            className: 'ngdialog-theme-default',
            controller: 'UpdateElementCtrl',
            scope: $scope
        });
    };

});