/**
 * Created by jbarros on 11/08/15.
 */

app.controller('LanguageCtrl', function($scope) {

    var url_languages = "../images/laguages/"

    $scope.languages = [
        { language: "English", twoLetterIdentifier: "en", url: "United_Kingdom.png"},
        { language: "Swedish", twoLetterIdentifier : "sv", url: "Sweden.png" },
        { language: "Greek", twoLetterIdentifier : "el", url: "Greece.png" },
        { language: "Danish", twoLetterIdentifier : "da", url: "Denmark.png" },
        { language: "Spanish", twoLetterIdentifier : "es", url: "Spain.png" }
    ];

    $scope.language = $scope.languages[0].twoLetterIdentifier; // Select language
});
