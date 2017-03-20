/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.services')
    .factory('gdlFactory', gdlFactory);

function gdlFactory($http, API_URL, $q) {


    return {
        getGdl: getGdl
    }

    function getGdl(guidelineId) {
        var deferred = $q.defer();
        $http.get(API_URL + '/guidelines/source/' + guidelineId).then(
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