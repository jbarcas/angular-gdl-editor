/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.controllers')
    .controller('RuleEditorCtrl', RuleEditorCtrl);

function RuleEditorCtrl($stateParams, guidelineFactory, conditionFactory, actionFactory, expressionItemFactory) {

    vm = this;
    vm.rule = guidelineFactory.getRule($stateParams.ruleId);
    vm.terms = guidelineFactory.getOntology().termDefinitions.en.terms || {};
    vm.getOptions = getOptions;
    vm.showRightName = showRightName;
    vm.updateConditionLeft = updateConditionLeft;
    vm.updateConditionRight = updateConditionRight;
    vm.removeCondition = removeCondition;
    vm.updateActionLeft = updateActionLeft;
    vm.updateActionRight = updateActionRight;
    vm.getActionName = getActionName;

    vm.delete = "../assets/img/del.png";
    vm.add = "../assets/img/add.png";

    vm.back = function () {
        window.history.back();
    };

    /**
     * Variable used to clone the condition nodes
     */
    vm.cloneConditions = expressionItemFactory.getConditions();

    /**
     * Variable used to clone the action nodes
     */
    vm.cloneActions = expressionItemFactory.getActions();

    /**
     * Options of the "Conditions" tree
     * @type {{beforeDrop: Function}}
     */
    vm.treeConditions = {
        /*
         * Transforms the model before dropping a condition
         */
        beforeDrop: function(event) {
            conditionFactory.beforeDrop(event);
        }
    };

    /**
     * Options of the "Actions" tree
     * @type {{beforeDrop: Function}}
     */
    vm.treeActions = {
        /*
         * Transforms the model before dropping an action
         */
        beforeDrop: function(event) {
            actionFactory.beforeDrop(event);
        }
    };

    function removeCondition (condition) {
        // TODO: Check if the condition is used somewhere
        condition.remove();
    }

    /**
     * Gets the options to show in the combo box. It depends on the type of condition statement
     * @param condition
     * @returns {*}
     */
    function getOptions(condition) {
        return expressionItemFactory.getConditionOptions(condition);
    }

    /**
     * On the flight, gets the name of the right part of a condition
     * @param condition
     * @returns {*}
     */
    function showRightName(condition) {
        return expressionItemFactory.showRightName(condition);
    }

    /**
     * Update the left part of a condition
     * @param condition
     */
    function updateConditionLeft(condition) {
        expressionItemFactory.updateConditionLeft(condition);
    }

    /**
     * Update the right part of a condition
     * @param condition
     */
    function updateConditionRight(condition) {
        expressionItemFactory.updateConditionRight(condition);
    }

    /**
     * Update the left part of an action
     * @param action
     */
    function updateActionLeft(action) {
        actionFactory.updateActionLeft(action);
    }

    /**
     * Update the right part of an action
     * @param action
     */
    function updateActionRight(action) {
        actionFactory.updateActionRight(action)
    }

    /**
     * Get the right part of an action
     * @param node
     * @returns {*}
     */
    function getActionName(action) {
        return actionFactory.getActionName(action)
    }

}