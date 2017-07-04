/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.services')
    .factory('preconditionsFactory', preconditionsFactory);

function preconditionsFactory() {

    return {
        foo: foo
    }

    function foo() {
        return "bar";
    }

}