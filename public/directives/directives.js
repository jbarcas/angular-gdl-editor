/**
 * Created by jbarros on 13/08/15.
 */

angular.module('app.directives', [])
    .directive('myDirective', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelController) {
                ngModelController.$parsers.push(function(data) {
                    //convert data from view format to model format
                    data = data.toISOString().slice(0,10);
                    return data; //converted
                });

                ngModelController.$formatters.push(function(data) {
                    //convert data from model format to view format
                    data = new Date(data);
                    return data; //converted
                });
            }
        }
    });
