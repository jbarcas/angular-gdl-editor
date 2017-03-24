/**
 * Created by jbarros on 21/03/17.
 */
angular.module('app.components', [])

  .component('modalWithDropdownComponent', {
    templateUrl: 'assets/templates/modal-with-dropdown.html',
    bindings: {
      resolve: '=',
      close: '&',
      dismiss: '&'
    },

    controller: function () {
      var $ctrl = this;

      $ctrl.options = $ctrl.resolve.items;

      $ctrl.selectedItem = $ctrl.resolve.default;

      $ctrl.labels = $ctrl.resolve.labels;

      $ctrl.ok = function () {
        $ctrl.close({$value: {data: $ctrl.selectedItem}});
      };

      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: 'cancel'});
      };
    }
  });