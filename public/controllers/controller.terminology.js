/**
 * Created by jbarros on 22/02/2015.
 */

angular.module('app').controller('TerminologyCtrl', TerminologyCtrl);

function TerminologyCtrl($scope, GT_HEADER) {

    // save term
    $scope.saveTerm = function (data, id) {
        angular.extend(data, {id: id});
    };

    // remove term
    $scope.removeTerm = function (term) {
        delete $scope.guide.ontology.termDefinitions[$scope.language].terms[term];
    };

    // add term
    $scope.addTerm = function () {
        $scope.inserted = {
            id: generateGtCode($scope.guide.ontology.termDefinitions[$scope.language].terms),
            text: '',
            description: ''
        };
        $scope.guide.ontology.termDefinitions[$scope.language].terms[$scope.inserted.id] = $scope.inserted;
    };

    function generateGtCode(object) {
        var higher = "";
        for (var key in object) {
            if (object.hasOwnProperty(key) && key > higher) {
                higher = key;
            }
        }
        var generatedCode = higher.split(GT_HEADER)[1];
        generatedCode++;
        generatedCode = "" + generatedCode;
        var pad = "0000";
        return GT_HEADER + pad.substring(0, pad.length - generatedCode.length) + generatedCode;
    }
}
