/**
 * Created by jbarros on 6/08/15.
 */

/*app.factory("Guides", function($resource) {
    return $resource(URL_BASE + "/guidelines/json/:guidelineId");
}); */

angular.module('app.services', ['app.core'])
    // a simple service
    // each function returns a promise object
    .factory('guideFactory', function($http, API_URL) {

        var guideFactory = {};

        guideFactory.getGuides = function () {
            return $http.get(API_URL + '/guidelines');
        }

        guideFactory.getGuide = function (id) {
            return $http.get(API_URL + '/guidelines/json/' + id);
        }

        guideFactory.insertGuide = function (guide) {
            // FIXME: Handle with an interceptor
            var options = {headers: {'Content-Type': 'text/plain'}};
            return $http.post(API_URL + '/guidelines/json/' + guide.id, guide, {
                transformRequest: function (data, headers) {
                    headers()['Content-Type'] = 'text/plain';
                    data.definition.archetypeBindings.map(function (value, key) {
                        if (!angular.isUndefined(value.elements)) {
                            value.elements.map(function (_value, _key) {
                                data.definition.archetypeBindings[key].elements[_value.id] = _value;
                                delete data.definition.archetypeBindings[key].elements[_key];
                            });
                            var element = {};
                            angular.extend(element, data.definition.archetypeBindings[key].elements);
                            data.definition.archetypeBindings[key].elements = element;
                            data.definition.archetypeBindings[value.id] = value;
                            delete data.definition.archetypeBindings[key];
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

        return guideFactory;

    })

    .factory('archetypeFactory', function($http, API_URL, API_URL_MISC) {

        var archetypeFactory = {};

        archetypeFactory.getArchetypes = function () {
            return $http.get(API_URL + '/archetypes');
        }

        archetypeFactory.getArchetype = function (id) {
            return $http.get(API_URL + '/archetype/json/' + id);
        }

        archetypeFactory.getArchetypeTerms = function (archetypeId, language) {
            return $http.get(API_URL_MISC + '/archetypes/' + archetypeId + '/' +language + '/terms');
        }

        return archetypeFactory;

    });