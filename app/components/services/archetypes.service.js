angular.module('app.services', [])
  .factory('archetypeFactory', archetypeFactory);

function archetypeFactory($http, API_URL, $q) {

  var archetypes = [];

  return {
    getArchetypes: getArchetypes,
    getArchetype: getArchetype,
    getElementName: getElementName
  }

  function getArchetypes() {
    var deferred = $q.defer();
    $http.get(API_URL + '/archetypes').then(
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

  function getArchetype(archetypeId) {
    var deferred = $q.defer();
    $http.get(API_URL + '/archetypes/json/' + archetypeId).then(
      function (response) {
        guideline = response.data;
        deferred.resolve(guideline);
      },
      function (response) {
        deferred.reject(response.data);
      }
    );
    return deferred.promise;
  }

  function getElementName(archetypeId, path) {
    var deferred = $q.defer();
    $http.get(API_URL + '/archetypes/json/' + archetypeId).then(
      function (response) {
        angular.forEach(response.data.elementMaps, function(item) {
          if (item.path === path) {
            console.log(item.elementMapId);
            deferred.resolve(item.elementMapId);
          }
        });
      },
      function (response) {
        deferred.reject(response.data);
      }
    );
    return deferred.promise;
  }

};