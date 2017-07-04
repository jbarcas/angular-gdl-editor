/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.services')
    .factory('htmlFactory', htmlFactory);

function htmlFactory($http, guidelineFactory, API_URL, $q) {


    return {
        getHtml: getHtml
    };

    function getHtml() {
        var guidelineId = guidelineFactory.getCurrentGuide().id;
        var deferred = $q.defer();
        $http.get(API_URL + '/guidelines/html/en/' + guidelineId).then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (response) {
                deferred.reject(response.data);
            }
        );
        return deferred.promise;
    };

}