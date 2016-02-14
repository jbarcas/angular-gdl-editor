/**
 * Created by jbarros on 7/08/15.
 */

angular.module('app')
    .controller('ModalKeywordsCtrl', ModalKeywordsCtrl)
    .controller('ModalContributorsCtrl', ModalContributorsCtrl)
    .controller('ModalKeywordsInstanceCtrl', ModalKeywordsInstanceCtrl)
    .controller('ModalContributorsInstanceCtrl', ModalContributorsInstanceCtrl);

function ModalKeywordsCtrl($scope, $modal, $log) {

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '../views/modals/modalAddKeyword.html',
            controller: 'ModalKeywordsInstanceCtrl',
            size: size,
            scope: $scope,
            resolve: {
                keywords: function () {
                    return $scope.guide.description.details[$scope.language].keywords;
                }
            }
        });
    };

    $scope.removeKeyword = function (id) {
        var i = $scope.guide.description.details[$scope.language].keywords.indexOf(id);
        if (i != -1) {
            $scope.guide.description.details[$scope.language].keywords.splice(i, 1);
        }
        if ($scope.guide.description.details[$scope.language].keywords.length <= 0) {
            delete $scope.guide.description.details[$scope.language].keywords;
        }
    }

}

function ModalContributorsCtrl($scope, $modal, $log) {

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '../views/modals/modalAddContributor.html',
            controller: 'ModalContributorsInstanceCtrl',
            size: size,
            scope: $scope,
            resolve: {
                otherContributors: function () {
                    return $scope.guide.description.otherContributors;
                }
            }
        });
    };

    $scope.removeOtherContributor = function (id) {
        var i = $scope.guide.description.otherContributors.indexOf(id);
        if (i != -1) {
            $scope.guide.description.otherContributors.splice(i, 1);
        }
        if ($scope.guide.description.otherContributors.length <= 0) {
            delete $scope.guide.description.otherContributors;
        }
    }

}


// Note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

function ModalKeywordsInstanceCtrl($scope, $modalInstance, keywords) {

    $scope.kw;

    $scope.ok = function () {
        $scope.guide.description.details[$scope.language].keywords =
            ( typeof $scope.guide.description.details[$scope.language].keywords != 'undefined' && $scope.guide.description.details[$scope.language].keywords instanceof Array ) ?
                $scope.guide.description.details[$scope.language].keywords : [];
        $scope.guide.description.details[$scope.language].keywords.push($scope.kw);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function ModalContributorsInstanceCtrl($scope, $modalInstance, otherContributors) {

    $scope.co;

    $scope.ok = function () {
        $scope.guide.description.otherContributors =
            ( typeof $scope.guide.description.otherContributors != 'undefined' && $scope.guide.description.otherContributors instanceof Array ) ?
                $scope.guide.description.otherContributors : [];
        $scope.guide.description.otherContributors.push($scope.co);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}