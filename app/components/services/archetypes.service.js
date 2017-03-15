angular.module('app.services', [])
  .factory('archetypeFactory', archetypeFactory);

function archetypeFactory($http, API_URL, $q) {

  var archetypes = [];

  return {
    getArchetypes: getArchetypes,
    getArchetype: getArchetype
  }

  function getArchetypes() {
    var deferred = $q.defer();
    $http.get(API_URL + '/archetypes').then(
      function (response) {
        deferred.resolve(response.data);
      },
      function (response) {
        deferred.reject(response.data);
      }
    );
    return deferred.promise;
  };

  function getArchetype(archetypeId) {
    var deferred = $q.defer();
    $http.get(API_URL + '/archetypes/json/' + archetypeId).then(
      function (response) {
        deferred.resolve(response.data);
      },
      function (response) {
        deferred.reject(response.data);
      }
    );
    return deferred.promise;
  }

};