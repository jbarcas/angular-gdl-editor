angular.module('app.components')
  .component('dialogComponent', {
    templateUrl: 'components/modals/modal.html',
    bindings: {
      resolve: '=',
      close: '&',
      dismiss: '&'
    },
    controller: function () {
      var $ctrl = this;
      $ctrl.labels = $ctrl.resolve.labels;
      $ctrl.ok = function () {
        $ctrl.close({$value: "OK"});
      };
      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: 'cancel'});
      };
    }
  });