angular.module('app.components')

  .component('modalWithInputComponent', {
    templateUrl: 'assets/templates/modal-with-input.html',
    bindings: {
      resolve: '=',
      close: '&',
      dismiss: '&'
    },
    controller: function () {
      var $ctrl = this;

      $ctrl.input = $ctrl.resolve.input;

      $ctrl.labels = $ctrl.resolve.labels;

      $ctrl.ok = function () {
        $ctrl.close({$value: {data: $ctrl.input}});
      };

      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: 'cancel'});
      };


    }
  });