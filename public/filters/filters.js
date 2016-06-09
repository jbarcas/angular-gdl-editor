/**
 * Created by jbarros on 6/03/16.
 */

angular.module('app').filter('formatElementText', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase().replace(/_/g, ' ') : ' ';
    }
});
