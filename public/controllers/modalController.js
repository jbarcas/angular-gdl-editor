/**
 * Created by jbarros on 7/08/15.
 */

app.controller('ModalKeywordsCtrl', function ($scope, $modal, $log) {

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '../views/modals/modalAddKeyword.html',
            controller: 'ModalKeywordsInstanceCtrl',
            size: size,
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.removeKeyword = function (id) {
        var i = $scope.keywords.indexOf(id);
        if(i != -1) {
            $scope.keywords.splice(i, 1);
        }
    }

});


app.controller('ModalContributorsCtrl', function ($scope, $modal, $log) {

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '../views/modals/modalAddContributor.html',
            controller: 'ModalContributorsInstanceCtrl',
            size: size,
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.removeOtherContributor = function (id) {
        var i = $scope.otherContributors.indexOf(id);
        if(i != -1) {
            $scope.otherContributors.splice(i, 1);
        }
    }

});


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

app.controller('ModalKeywordsInstanceCtrl', function ($scope, $modalInstance) {

    $scope.kw;

    $scope.ok = function () {
        $scope.$parent.keywords.push($scope.kw);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('ModalContributorsInstanceCtrl', function ($scope, $modalInstance) {

    $scope.co;

    $scope.ok = function () {
        $scope.otherContributors.push($scope.co);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});