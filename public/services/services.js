/**
 * Created by jbarros on 6/08/15.
 */

/*app.factory("Guides", function($resource) {
 return $resource(URL_BASE + "/guidelines/json/:guidelineId");
 }); */

angular.module('app.services', ['app.core'])
    // a simple service
    // each function returns a promise object
    .factory('guideFactory', function ($http, API_URL) {

        var guideFactory = {};

        guideFactory.getGuides = function () {
            return $http.get(API_URL + '/guidelines');
        }

        guideFactory.getGuide = function (id) {
            return $http.get(API_URL + '/guidelines/json/' + id);
        }

        guideFactory.insertGuide = function (guide) {
            // FIXME: Handle with an interceptor ??
            return $http.post(API_URL + '/guidelines/json/' + guide.id, guide, {
                transformRequest: function (data, headers) {
                    headers()['Content-Type'] = 'text/plain';
                    data.definition.archetypeBindings.map(function (archetypeBindingValue, archetypebindingKey) {
                        if (!angular.isUndefined(archetypeBindingValue.elements)) {
                            archetypeBindingValue.elements.map(function (elementValue, elementKey) {
                                data.definition.archetypeBindings[archetypebindingKey].elements[elementValue.id] = elementValue;
                                /*
                                 * Delete the "name" property (used to map the gt code element to its name in the archetype)
                                 */
                                delete data.definition.archetypeBindings[archetypebindingKey].elements[elementValue.id].name;
                                delete data.definition.archetypeBindings[archetypebindingKey].elements[elementKey];
                            });
                            var element = {};
                            angular.extend(element, data.definition.archetypeBindings[archetypebindingKey].elements);
                            data.definition.archetypeBindings[archetypebindingKey].elements = element;
                            data.definition.archetypeBindings[archetypeBindingValue.id] = archetypeBindingValue;
                            delete data.definition.archetypeBindings[archetypebindingKey];
                        }
                    })
                    var newObj = {};
                    angular.extend(newObj, data.definition.archetypeBindings);
                    data.definition.archetypeBindings = newObj;
                    return angular.toJson(data);
                }
            });
        }

        guideFactory.updateGuide = function (guide) {
            return $http.put(API_URL + '/guidelines/json/' + guide.id, guide);
        }

        guideFactory.deleteGuide = function (id) {
            return $http.delete(API_URL + '/guidelines/' + id);
        }

        guideFactory.getSourceGuide = function (id) {
            return $http.get(API_URL + '/guidelines/source/' + id);
        }

        return guideFactory;

    })

    .factory('archetypeFactory', function ($http, $q, API_URL, API_URL_MISC) {

        var archetypeFactory = {};

        archetypeFactory.getArchetypes = function () {
            return $http.get(API_URL + '/archetypes');
        }

        archetypeFactory.getArchetype = function (id) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var url = API_URL + '/archetypes/json/' + id;
            $http.get(url)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (err) {
                    deferred.reject(err)
                });

            return promise;
        }

        archetypeFactory.getArchetypeTerms = function (archetypeId, language) {
            return $http.get(API_URL_MISC + '/archetypes/' + archetypeId + '/' + language + '/terms');
        }

        return archetypeFactory;

    });