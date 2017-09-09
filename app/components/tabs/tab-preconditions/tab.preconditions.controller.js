angular.module('app.controllers')
    .controller('PreconditionsCtrl', PreconditionsCtrl);

function PreconditionsCtrl(guidelineFactory, expressionItemFactory, conditionFactory) {

  vm = this;

  vm.terms = guidelineFactory.getOntology() ? guidelineFactory.getOntology().termDefinitions.en.terms : {};
  vm.preConditions = guidelineFactory.getPreConditions() || [];
  vm.getOptions = getOptions;
  vm.showRightName = showRightName;
  vm.updateConditionLeft = updateConditionLeft;
  vm.updateConditionRight = updateConditionRight;
  vm.delete = "../assets/img/del.png";
  vm.add = "../assets/img/add.png";

  /**
   * Property used to clone the preCondition nodes
   */
  vm.clonePreConditions = expressionItemFactory.getConditions();

  /**
   * Options of the "Conditions" tree
   * @type {{beforeDrop: Function}}
   */
  vm.treePreConditions = {
    /*
     * Transforms the model before dropping a condition
     */
    beforeDrop: function(event) {
      conditionFactory.beforeDrop(event);
    }
  };

  /**
   * Gets the options to show in the combo box. It depends on the type of preCondition statement
   * @param preCondition
   * @returns {*}
   */
  function getOptions(preCondition) {
    return expressionItemFactory.getConditionOptions(preCondition);
  }

  function updateConditionLeft(preCondition) {
    expressionItemFactory.updateConditionLeft(preCondition);
  }

  function showRightName(preCondition) {
    return expressionItemFactory.showRightName(preCondition);
  }

  function updateConditionRight(preCondition) {
    expressionItemFactory.updateConditionRight(preCondition);
  }

}
