angular.module('app.components')

    .component('modalWithTextareaComponent', {
        templateUrl: 'assets/templates/modal-with-textarea.html',
        bindings: {
            resolve: '=',
            close: '&',
            dismiss: '&'
        },
        controller: function () {
            var $ctrl = this;

            $ctrl.input = $ctrl.resolve.expression;

            $ctrl.labels = $ctrl.resolve.labels;

            $ctrl.ok = function () {
                $ctrl.close({$value: {data: $ctrl.input}});
            };

            $ctrl.cancel = function () {
                $ctrl.dismiss({$value: 'cancel'});
            };


        }
    });