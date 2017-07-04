angular.module('app.services')
    .factory('terminologyFactory', terminologyFactory);

function terminologyFactory($http, API_URL, API_MISC_URL, $q) {

    return {
        getAll: getAll,
        getTerms: getTerms,
        getTerminology: getTerminology
    };

    function getAll() {
        var deferred = $q.defer();
        $http.get(API_URL + '/terminologies').then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (response) {
                deferred.reject(response.data);
            }
        );
        return deferred.promise;
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
    }

    function getTerminology(terminologyId) {
        var deferred = $q.defer();
        $http.get(API_URL + '/terminologies/source/' + terminologyId).then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (response) {
                deferred.reject(response.data);
            }
        );
        return deferred.promise;
    }

}