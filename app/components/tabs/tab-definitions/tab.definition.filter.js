/**
 * Created by jbarros on 6/03/16.
 */

angular.module('app.filters', [])
    .filter('capitalize', capitalize)
    .filter('removeUnderscore', removeUnderscore)
    .filter('parseLocal', parseLocal);

function capitalize() {
    return function (s) {
        return (angular.isString(s) && s.length > 0) ? s[0].toUpperCase() + s.substr(1).toLowerCase() : s;
    }
}

function removeUnderscore() {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase().replace(/_/g, ' ') : ' ';
    }
}


function parseLocal() {
    return function (input) {
        //input = String(input);
        if (!input) {
            return "Select";
        } else if(input.indexOf("::") !== -1) {
            return (!!input) ? input.split("|").splice(-2)[0] : ' ';
        } else {
            return input;
        }
    }
}

