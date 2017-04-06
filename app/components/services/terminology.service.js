angular.module('app.services')
    .factory('terminologyFactory', terminologyFactory);

function terminologyFactory($http, API_MISC_URL, $q) {

    return {
        getTerms: getTerms
    }

    function getTerms(archetypeId) {
        var deferred = $q.defer();
        $http.get(API_MISC_URL + '/archetypes/' + archetypeId + '/en/terms').then(
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