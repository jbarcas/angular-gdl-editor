/**
 * Created by jbarros on 22/02/2015.
 */

angular.module('app').controller('TerminologyCtrl', TerminologyCtrl);

function TerminologyCtrl($scope, gtService) {

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
            id: generateGtCode($scope.guide),
            text: '',
            description: ''
        };
        $scope.guide.ontology.termDefinitions[$scope.language].terms[$scope.inserted.id] = $scope.inserted;
    };

    function generateGtCode(guide) {
        return gtService.generateGt(guide);
    }
}
