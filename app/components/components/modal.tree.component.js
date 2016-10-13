angular.module('app.components')

  .component('modalWithTreeComponent', {
    templateUrl: 'assets/templates/modal-with-tree.html',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
    controller: function ($scope) {
      var $ctrl = this;

      $ctrl.selected = {};

      $ctrl.domain = {};
        
      $ctrl.items = $ctrl.resolve.items;

      $ctrl.labels = $ctrl.resolve.labels;

      $ctrl.domains = $ctrl.resolve.domains;

      /*$ctrl.$onInit = function () {
        $ctrl.selected = {
          item: $ctrl.items[0]
        };
      };*/

      $ctrl.ok = function () {
        $ctrl.close(
          {
            $value: {
              selectedItem: $ctrl.selected.item,
              domain: $ctrl.domain
            }
          });
      };

      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: 'cancel'});
      };

      $scope.treeOptions = {
        allowDeselect: false,
        injectClasses: {
          ul: "a1",
          li: "a2",
          liSelected: "a7",
          iExpanded: "a3",
          iCollapsed: "a4",
          iLeaf: "a5",
          label: "a6",
          labelSelected: "a8"
        }
      }

      $scope.predicate = "";

      $scope.comparator = false;

      $scope.showSelected = function(node) {
        $ctrl.selected.item = node;
      }

    }
  });