angular.module('app.services')
    .factory('guidelinesFactory', guidelinesFactory);

function guidelinesFactory($http, API_URL, $q) {
    
    var guidelines = [];

    return {
        getGuidelines: getGuidelines
    }

    function getGuidelines() {
        var deferred = $q.defer();
        $http.get(API_URL + '/guidelines').then(
            function (response) {
                guidelines = response.data;
                deferred.resolve(guidelines);
            },
            function (response) {
                deferred.reject(response.data);
            }
        );
        return deferred.promise;
    };   

}