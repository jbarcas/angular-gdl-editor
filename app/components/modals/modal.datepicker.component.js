/**
 * Created by jbarros on 25/03/17.
 */

angular.module('app.components')

    .component('modalWithDatepickerComponent', {
        templateUrl: 'components/modals/modal.datepicker.html',
        bindings: {
            resolve: '=',
            close: '&',
            dismiss: '&'
        },
        controller: function () {
            var $ctrl = this;

            $ctrl.date = $ctrl.resolve.date.value;

            $ctrl.labels = $ctrl.resolve.labels;

            $ctrl.options = {
                startingDay: 1,
                showWeeks: true
            };

            $ctrl.ok = function () {
                var response = {
                    date: $ctrl.date.toISOString().split(".")[0],
                    type: $ctrl.resolve.date.type
                }
                $ctrl.close({$value: {data: response}});
            };

            $ctrl.cancel = function () {
                $ctrl.dismiss({$value: 'cancel'});
            };

            $ctrl.today = function() {
                $ctrl.date = new Date();
            };

            $ctrl.clear = function() {
                $ctrl.date = null;
            };


        }
    });
