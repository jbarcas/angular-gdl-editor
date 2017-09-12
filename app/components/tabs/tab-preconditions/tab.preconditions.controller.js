angular.module('app.controllers')
    .controller('PreconditionsCtrl', PreconditionsCtrl);

function PreconditionsCtrl($log, guidelineFactory, expressionItemFactory, conditionFactory, modalService) {

  vm = this;

  vm.guide = {};
  vm.guide.definition = guidelineFactory.getDefinition();
  if(!vm.guide.definition.preConditionExpressions) {
    vm.guide.definition.preConditionExpressions = [];
  }


  vm.terms = guidelineFactory.getOntology() ? guidelineFactory.getOntology().termDefinitions.en.terms : {};
  vm.getOptions = getOptions;
  vm.showRightName = showRightName;
  vm.updateConditionLeft = updateConditionLeft;
  vm.updateConditionRight = updateConditionRight;
  vm.delete = "../assets/img/del.png";
  vm.add = "../assets/img/add.png";
  vm.removePrecondition = removePrecondition;

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

  function removePrecondition (scope) {

    modalService.showModal(
        {component: 'dialogComponent'},
        {bodyText: 'Are you sure you want remove the precondition?', headerText: 'Remove precondition?'}
    ).then(showModalComplete, showModalFailed);

    function showModalComplete() {
      scope.remove();
    }

    function showModalFailed() {
      $log.info('Modal dismissed at: ' + new Date() + ' in removePrecondition()');
    }
  }

}
