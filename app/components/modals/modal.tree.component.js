angular.module('app.components')

  .component('modalWithTreeComponent', {
    templateUrl: 'components/modals/modal.tree.html',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
    controller: function ($scope) {
      var $ctrl = this;

      $ctrl.image = {
        expand: {
          url: '../assets/img/expand.png',
          text: 'Expands the search tree'
        },
        contract: {
          url: '../assets/img/contract.png',
          text: 'Contracts the search tree'
        }
      };

      $ctrl.selected = {};

      $ctrl.domain = {};

      $ctrl.items = $ctrl.resolve.items;

      $ctrl.labels = $ctrl.resolve.labels;

      $ctrl.domains = $ctrl.resolve.domains;

      $ctrl.ok = function () {
        /**
         * If no selection, do nothing
         */
        if(!$ctrl.selected.item) {
          $ctrl.cancel();
        }
        var response = {
          selectedItem: $ctrl.selected.item,
          domain: $ctrl.domain,
          type: $ctrl.selected.item.type
        }
        $ctrl.close({$value: {data: response }});
      };

      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: 'cancel'});
      };

      $scope.treeOptions = {
        allowDeselect: false,
        dirSelectable: false,
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
      };


      $ctrl.expand = function() {
        $scope.expandedNodes = getAllSubitems($ctrl.items);
      };

      $ctrl.contract = function() {
        $scope.expandedNodes = [];
      }

      $scope.predicate = "";

      $scope.comparator = false;

      $scope.showSelected = function(node, parent) {
        if(parent) {
          node.parent = parent;
        }
        $ctrl.selected.item = node;
      }

      function getAllSubitems(items) {
        if (typeof response === 'undefined' || !response) {
          response = [];
        }
        angular.forEach(items, function(item) {
          if(item.children) {
            getAllSubitems(item.children)
          }
          response.push(item);
        })
        return response;
      }

    }
  });