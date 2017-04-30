/**
 * Created by jbarros on 21/03/17.
 */
angular.module('app.components')

  .component('modalWithInputAndDropdownComponent', {
    templateUrl: 'components/modals/modal.input-and-dropdown.html',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },

    controller: function () {
      var $ctrl = this;

      $ctrl.input = $ctrl.resolve.input;

      $ctrl.options = $ctrl.resolve.items;

      $ctrl.selectedItem = $ctrl.resolve.default;

      $ctrl.labels = $ctrl.resolve.labels;

      $ctrl.ok = function () {
        var response  = {
          input: $ctrl.input,
          selectedItem: $ctrl.selectedItem,
          type: $ctrl.input ? $ctrl.input.type : $ctrl.selectedItem.type
        };
        $ctrl.close({$value: {data: response}});
      };

      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: 'cancel'});
      };
    }
  });