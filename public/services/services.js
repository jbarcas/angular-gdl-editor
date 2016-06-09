/**
 * Created by jbarros on 6/08/15.
 */

/*app.factory("Guides", function($resource) {
 return $resource(URL_BASE + "/guidelines/json/:guidelineId");
 }); */

angular.module('app.services', [])
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
            return $http.post(API_URL + '/guidelines/json/' + guide.id, guide);
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

        archetypeFactory.getArchetype = function(archetypeId) {
            return $http.get(API_URL + '/archetypes/json/' + archetypeId);
        }

        archetypeFactory.getArchetypeTerms = function (archetypeId, language) {
            return $http.get(API_URL_MISC + '/archetypes/' + archetypeId + '/' + language + '/terms');
        }

        return archetypeFactory;

    })

    .factory('gtService', function (GT_HEADER) {

        var gtService = {};

        gtService.generateGt = function (guide) {

            var originalLanguage = guide.language.originalLanguage.codeString;
            var usedTerms = Object.keys(guide.ontology.termDefinitions[originalLanguage].terms);

            if (guide.definition && guide.definition.archetypeBindings) {
                angular.forEach(guide.definition.archetypeBindings, function(archetypeBinding) {
                    usedTerms.push(archetypeBinding.id)
                })
            }
            var high = usedTerms.sort().slice(-1).pop();
            var generatedCode = high.split(GT_HEADER)[1];
            generatedCode++;
            generatedCode = "" + generatedCode;
            var pad = "0000";
            return GT_HEADER + pad.substring(0, pad.length - generatedCode.length) + generatedCode;
        }

        return gtService;

    });