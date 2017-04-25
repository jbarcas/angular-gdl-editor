angular.module('app.components', [])
  .component('expressionEditorComponent', {
    templateUrl: 'components/expression-editor/expression.editor.html',
    bindings: {
      resolve: '=',
      close: '&',
      dismiss: '&'
    },
    controller: function ($scope) {

      var $ctrl = this;

      $ctrl.operators = [
        { id: 1, name: 'MULTIPLICATION', value: '*' },
        { id: 2, name: 'ADDITION', value: '+' },
        { id: 3, name: 'SUBSTRATION', value: '-' },
        { id: 4, name: 'DIVISION', value: '/' },
        { id: 5, name: 'EXPONENT', value: '^' }
      ];

      $ctrl.labels = $ctrl.resolve.labels;

      $ctrl.expression = $ctrl.resolve.expression;

      $ctrl.items = $ctrl.resolve.items;

      $ctrl.modelExpression = $ctrl.resolve.modelExpression;

      $ctrl.expression;

      $ctrl.selected = "";

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
        }//,
        /*equality: function(node1, node2) {
          console.log(node2);
          return node1 === node2;
        }*/
      }

      $scope.predicate = "";

      $scope.comparator = false;

      $ctrl.addOperator = function(operator) {
        $ctrl.selected = $ctrl.selected.concat(operator.value);
      }

      $scope.showSelected = function(node, parent) {
        if(parent) {
          $ctrl.selected = $ctrl.selected.concat(node.viewText);
        }
      }

      $ctrl.ok = function () {
        $ctrl.close({$value: "OK"});
      };

      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: 'cancel'});
      };

    }
});