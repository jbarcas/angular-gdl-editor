/**
 * Created by jbarros on 11/08/15.
 */

angular.module('app')
    .controller('LanguageCtrl', LanguageCtrl)
    .controller('ModalLanguageInstanceCtrl', ModalLanguageInstanceCtrl);

function LanguageCtrl($scope, $uibModal, $log) {

    var url_languages = "../images/laguages/"

    $scope.languages = [
        {language: "English", twoLetterIdentifier: "en", url: "en.png"},
        {language: "Swedish", twoLetterIdentifier: "sv", url: "sv.png"},
        {language: "Greek", twoLetterIdentifier: "el", url: "el.png"},
        {language: "Danish", twoLetterIdentifier: "da", url: "da.png"},
        {language: "Spanish", twoLetterIdentifier: "es", url: "es.png"}
    ];

    $scope.language = $scope.languages[0].twoLetterIdentifier; // Select language

    $scope.open = function (size) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../views/modals/modalLanguage.html',
            controller: 'ModalLanguageInstanceCtrl',
            size: size,
            resolve: {
                languages: function () {
                    return $scope.languages;
                }
            }
        });

        modalInstance.result.then(
            function (selectedItem) {
                $scope.language = selectedItem.twoLetterIdentifier;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
    };

}

function ModalLanguageInstanceCtrl($scope, $uibModalInstance, languages) {

    $scope.languages = languages;
    $scope.selectedLanguage = {
        item: $scope.language
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selectedLanguage.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
