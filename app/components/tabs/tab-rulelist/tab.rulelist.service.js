/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.services')
    .factory('rulelistFactory', rulelistFactory);

function rulelistFactory() {

    return {
        foo: foo
    }

    function foo(bar) {
        return bar;
    };

}