/**
 * Created by jbarros on 6/08/15.
 */

/*app.factory("Guides", function($resource) {
    return $resource(URL_BASE + "/guidelines/json/:guidelineId");
}); */

angular.module('gdl-editor.services', ['configuration'])
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
            return $http.post(API_URL + '/guidelines/json/', guide);
        }

        guideFactory.updateGuide = function (guide) {
            return $http.put(API_URL + '/guidelines/json/' + guide.id, guide);
        }

        guideFactory.deleteGuide = function (id) {
            return $http.delete(API_URL + '/guidelines/' + id);
        }

        return guideFactory;

    })
;