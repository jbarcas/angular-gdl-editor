/**
 * Created by jbarros on 6/03/16.
 */

angular.module('app.filters', [])
    .filter('capitalize', capitalize)
    .filter('formatElementText', formatElementText);

function capitalize() {
    return function (s) {
        return (angular.isString(s) && s.length > 0) ? s[0].toUpperCase() + s.substr(1).toLowerCase() : s;
    }
}

function formatElementText() {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase().replace(/_/g, ' ') : ' ';
    }
}

