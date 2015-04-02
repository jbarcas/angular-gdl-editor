/**
 * Created by jbarros on 01/04/2015.
 */

app.controller('DialogController', function($scope, ngDialog) {

    $scope.clickToOpen = function () {
        ngDialog.open({
            template: '../dialogTemplate.html',
            className: 'ngdialog-theme-default',
            controller: 'TemplateController',
            scope: $scope
        });
    };
    $scope.clickToClose = function () {
        ngDialog.close();
    }
});

app.controller('TemplateController', function($scope, ngDialog) {

    $scope.$parent.value = {name: 'CHA2DS2VASc_Score_calculation.v1'};

    $scope.clickToClose = function () {
        ngDialog.close();
    }
});