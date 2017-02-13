/**
 * Created by jbarros on 6/03/16.
 */

angular.module('app.filters', [])
    .filter('formatElementText', formatElementText);

function formatElementText() {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase().replace(/_/g, ' ') : ' ';
    }
}

