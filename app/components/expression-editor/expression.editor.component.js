angular.module('app.components', [])
  .component('expressionEditorComponent', {
    templateUrl: 'components/expression-editor/expression.editor.html',
    bindings: {
      resolve: '=',
      close: '&',
      dismiss: '&'
    },
    controller: function ($scope, $rootScope, guidelineFactory, OPERATORS, ATTRIBUTES) {

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

      $ctrl.operators = OPERATORS;

      $ctrl.labels = $ctrl.resolve.labels;

      $ctrl.expression = $ctrl.resolve.expression;

      //$ctrl.literalExpression = getLiteralExpression(jsep($ctrl.expression));

      /**
       * Gets the expression from an object
       * @param expression
       * @returns {exp}
       */
      function getLiteralExpression(expression) {

        function createLiteralExpression(expression) {
          if(expression.type === "Compound") {
            return;
          }
          if (expression.type === "MemberExpression") {
            if (ATTRIBUTES.DV_DATE_TIME.indexOf(expression.property.name) != -1) {
              exp += expression.object.name + "." + expression.property.name;
            } else if(expression.property.name === "magnitude") {
              exp += guidelineFactory.getText(expression.object.name);
            } else {
              exp += guidelineFactory.getText(expression.object.name) + "." + expression.property.name;
            }
          } else if (expression.type === "Literal") {
            exp += expression.raw;
          } else {
            exp += '(';
            createLiteralExpression(expression.left);
            exp += " " + expression.operator + " ";
            createLiteralExpression(expression.right);
            exp += ')';
          }
          return exp;
        }

        var exp = "";
        createLiteralExpression(expression);
        return exp;

      }

      $ctrl.items = $ctrl.resolve.items;

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

      $ctrl.expand = function() {
        $scope.expandedNodes = getAllSubitems($ctrl.items);
      };

      $ctrl.contract = function() {
        $scope.expandedNodes = [];
      };

      $scope.predicate = "";

      $scope.comparator = false;

      $ctrl.addOperator = function(operator) {
        $ctrl.expression = insertAtCaret(" " + operator + " ");
      };

      $scope.$watch('$ctrl.expression', function(newValue) {
        try {
          $ctrl.literalExpression = getLiteralExpression(jsep(newValue));
        } catch (err) {
          $ctrl.literalExpression = "";
          console.log("The expression is not well formed.");
        }

      }, true);

      $scope.showSelected = function(node, parent) {
        if(parent.dataType === "DV_DATE_TIME") {
          $ctrl.expression = insertAtCaret("currentDateTime" + "." + node.viewText);
        } else {
          $ctrl.expression = insertAtCaret(parent.id + "." + node.viewText);
        }
      };

      function getAllSubitems(items) {
        if (typeof response === 'undefined' || !response) {
          response = [];
        }
        angular.forEach(items, function(item) {
          if(item.children) {
            getAllSubitems(item.children)
          }
          response.push(item);
        });
        return response;
      }

      function getOperator (symbol) {
        for (var operator in OPERATORS) {
          if(OPERATORS[operator] === symbol) {
            return operator;
          }
        }
        return null;
      }

      function convertBranchMemberExpression(tree) {
        tree.type = "Variable";
        delete tree.computed;
        tree.expressionItem = {
          code: tree.object.name,
          attribute: tree.property.name
        };
        delete tree.object;
        delete tree.property;
      }

      function convertBranchLiteral(tree) {
        tree.type = "ConstantExpression";
        tree.expressionItem = {
          value: tree.value
        };
        delete tree.raw;
        delete tree.value;
      }

      function convertExpression(tree) {

        if (tree.type === "Literal") {
          convertBranchLiteral(tree);
          return;
        }

        tree.operator = getOperator(tree.operator);

        tree.expressionItem = {
          left: tree.left,
          right: tree.right,
          operator: tree.operator
        };

        delete tree.left;
        delete tree.right;
        delete tree.operator;

        if(typeof tree.expressionItem.left !== 'undefined') {
          if(tree.expressionItem.left.type === 'BinaryExpression') {
            convertExpression(tree.expressionItem.left);
          }
          if(tree.expressionItem.left.type === 'MemberExpression') {
            convertBranchMemberExpression(tree.expressionItem.left);
          }
          if(tree.expressionItem.left.type === 'Literal') {
            convertBranchLiteral(tree.expressionItem.left);
          }
        }

        if(typeof tree.expressionItem.right !== 'undefined') {
          if(tree.expressionItem.right.type === 'BinaryExpression') {
            convertExpression(tree.expressionItem.right);
          }
          if(tree.expressionItem.right.type === 'MemberExpression') {
            convertBranchMemberExpression(tree.expressionItem.right);
          }
          if(tree.expressionItem.right.type === 'Literal') {
            convertBranchLiteral(tree.expressionItem.right);
          }
        }

      }

      // modelExpression represents the right part object
      $ctrl.ok = function () {
        var parse_tree = jsep($ctrl.expression);
        console.log("Antes:" + angular.toJson($ctrl.resolve.modelExpression));
        convertExpression(parse_tree);
        console.log("Despues: " + angular.toJson(parse_tree));
        $ctrl.close({$value: {data: parse_tree }});
      };

      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: 'cancel'});
      };

      /**
       * This function is intended to insert a text in a textarea where the cursor is in that moment
       * Source: https://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery#answer-1064139
       * @param text
       * @returns {*}
       */
      function insertAtCaret(text) {
        var txtarea = document.getElementById('expression');
        if (!txtarea) { return; }

        var scrollPos = txtarea.scrollTop;
        var strPos = 0;
        var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
            "ff" : (document.selection ? "ie" : false ) );
        if (br == "ie") {
          txtarea.focus();
          var range = document.selection.createRange();
          range.moveStart ('character', -txtarea.value.length);
          strPos = range.text.length;
        } else if (br == "ff") {
          strPos = txtarea.selectionStart;
        }

        var front = (txtarea.value).substring(0, strPos);
        var back = (txtarea.value).substring(txtarea.selectionEnd, txtarea.value.length);
        txtarea.value = front + text + back;
        strPos = strPos + text.length;
        if (br == "ie") {
          txtarea.focus();
          var ieRange = document.selection.createRange();
          ieRange.moveStart ('character', -txtarea.value.length);
          ieRange.moveStart ('character', strPos);
          ieRange.moveEnd ('character', 0);
          ieRange.select();
        } else if (br == "ff") {
          txtarea.selectionStart = strPos;
          txtarea.selectionEnd = strPos;
          txtarea.focus();
        }

        txtarea.scrollTop = scrollPos;
        return txtarea.value;
      }

    }
});