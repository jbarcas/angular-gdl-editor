/**
 * Created by jbarros on 1/02/16.
 */

angular.module('app').controller('GdlCtrl', GdlCtrl);

function GdlCtrl($scope, guideFactory) {

    $scope.sourceGuide = getSourceGuide($scope.guide.id);

    function getSourceGuide(id) {
        guideFactory.getSourceGuide(id)
            .success(function (data, status, headers, config) {
                return data;
            })
            .error(function (data) {
                console.log('Error at getting source guide: ' + data);
            });
    };

}