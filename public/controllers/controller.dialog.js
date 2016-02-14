/**
 * Created by jbarros on 01/04/2015.
 */

angular.module('app').controller('DialogCtrl', function ($scope, ngDialog) {

    $scope.clickToOpen = function () {
        ngDialog.open({
            template: '../views/dialogTemplate.html',
            className: 'ngdialog-theme-default',
            controller: 'TemplateCtrl',
            scope: $scope
        });
    };
    $scope.clickToClose = function () {
        ngDialog.close();
    }
});

angular.module('app').controller('TemplateCtrl', function ($scope, ngDialog) {

    $scope.$parent.value = {name: 'CHA2DS2VASc_Score_calculation.v1'};

    $scope.clickToClose = function () {
        ngDialog.close();
    }
});