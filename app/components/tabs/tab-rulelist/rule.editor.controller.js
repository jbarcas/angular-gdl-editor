/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.controllers')
    .controller('RuleEditorCtrl', RuleEditorCtrl);

function RuleEditorCtrl($stateParams, $log, guidelineFactory, conditionFactory, actionFactory, modalService, ruleFactory, CONDITION_OPERATORS) {

    vm = this;
    vm.rule = guidelineFactory.getRule($stateParams.ruleId);
    vm.getOptions = getOptions;
    vm.showRightName = showRightName;
    vm.updateConditionLeft = updateConditionLeft;
    vm.updateConditionRight = updateConditionRight;
    vm.removeCondition = removeCondition;
    vm.updateActionLeft = updateActionLeft;
    vm.updateActionRight = updateActionRight;
    vm.terms = guidelineFactory.getOntology().termDefinitions.en.terms;

    vm.delete = "../assets/img/del.png";
    vm.add = "../assets/img/add.png";

    vm.back = function () {
        window.history.back();
    };

    vm.conditions = [
        {title: 'Compare (DataValue)', category: 'CompareDataValue', draggable: true},
        {title: 'Compare (NullValue)', category: 'CompareNullValue', draggable: true},
        {title: 'Compare (Element)',   category: 'CompareElement',   draggable: true},
        {title: 'Compare (Attribute)', category: 'CompareAttribute', draggable: true},
        {title: 'Element exists',      category: 'ElementExists',    draggable: true},
        {title: 'Or operator',         category: 'Or',               draggable: true}
    ];

    vm.actions = [
        {title: 'Create (Entry)',   category: 'CreateEntry',  draggable: true},
        {title: 'Set (DataValue)',  category: 'SetDataValue', draggable: true},
        {title: 'Set (NullValue)',  category: 'SetNullValue', draggable: true},
        {title: 'Set (Element)',    category: 'SetElement',   draggable: true},
        {title: 'Set (Attribute)',  category: 'SetAttribute', draggable: true}
    ];

    vm.treeConditions = {
        /**
         * Transforms the model before dragging
         * @param event
         */
        beforeDrop: function(event) {
            var cloneModel = event.source.cloneModel;
            if(cloneModel.category === "CompareDataValue") {
                conditionFactory.createCompareDataValue(cloneModel);
            } else if(cloneModel.category === "CompareNullValue") {
                conditionFactory.createCompareNullValue(cloneModel);
            } else if (cloneModel.category === "CompareElement") {
                conditionFactory.createCompareElement(cloneModel);
            } else if (cloneModel.category === "CompareAttribute") {
                conditionFactory.createCompareAttribute(cloneModel);
            } else if (cloneModel.category === "ElementExists") {
                conditionFactory.createElementExists(cloneModel);
            } else if (cloneModel.category === "Or") {
                conditionFactory.createOr(cloneModel);
            }
            delete cloneModel.category;
            delete cloneModel.draggable;
            delete cloneModel.title;
        }
    };

    vm.treeActions = {
        /**
         * Transforms the model before dragging
         * @param event
         */
        beforeDrop: function(event) {
            var cloneModel = event.source.cloneModel;
            if(cloneModel.category === "CreateEntry") {
                actionFactory.createEntry(cloneModel);
            } else if(cloneModel.category === "SetDataValue") {
                actionFactory.createSetDataValue(cloneModel);
            } else if (cloneModel.category === "SetNullValue") {
                actionFactory.createSetNullValue(cloneModel);
            } else if (cloneModel.category === "SetElement") {
                actionFactory.createSetElement(cloneModel);
            } else if (cloneModel.category === "SetAttribute") {
                actionFactory.createSetAttribute(cloneModel);
            }
            delete cloneModel.category;
            delete cloneModel.draggable;
            delete cloneModel.title;
        }
    };

    function removeCondition (condition) {
        // TODO: Check if the conditions is used somewhere
        condition.remove();
    }

    /**
     * Gets the options to show in the combo box. It depends on the type of condition statement
     * @param node
     * @returns {*}
     */
    function getOptions(node) {
        var conditionType = conditionFactory.getType(node);
        var options;
        if (conditionType === "Exists") {
            options = CONDITION_OPERATORS.EXISTS;
        } else if (conditionType === "Attribute") {
            options = CONDITION_OPERATORS.ATTRIBUTE;
        } else if (conditionType === "Element") {
            options = CONDITION_OPERATORS.ELEMENT;
        } else if (conditionType === "NullValue") {
            options = CONDITION_OPERATORS.NULLVALUE;
        } else if (conditionType === "DataValue") {
            options = CONDITION_OPERATORS.DATAVALUE;
        } else if (conditionType === "Or") {
            options = CONDITION_OPERATORS.OR;
        } else {
            throw "GDL Editor - Error at getting options: condition type not recognized."
        }
        return options;
    }

    /**
     * On the flight, gets the name of the right part of a condition
     * @param node
     * @returns {*}
     */
    function showRightName(node) {
        var condition = node.$modelValue;
        var conditionType = conditionFactory.getType(condition);
        var value;

        /*
         * If the node is an element, a predicate function or a predicate exists, then it has no right part.
         */
        if (conditionType === "ElementExists") {
            return;
        } else if (conditionType === "Attribute" && condition.expressionItem.left.expressionItem.attribute === 'magnitude') {
            value = "Expression";
        } else if (conditionType === "Attribute") {
            value = condition.expressionItem.right.expressionItem.value;
        } else if (conditionType === "Element") {
            value = condition.expressionItem.right.expressionItem.code ? vm.terms[condition.expressionItem.right.expressionItem.code].text : "";
        } else if (conditionType === "NullValue" || conditionType === "DataValue") {
            value = condition.expressionItem.right.expressionItem.value
        }
        return value;
    }

    function updateConditionLeft(node) {
        var condition = node.$modelValue;
        var type = conditionFactory.getType(condition);

        var modalData = {headerText: 'Select element instance'};
        var modalOptions = ruleFactory.getOptionsForTreeModal(condition);

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }
            var selected = modalResponse.data.selectedItem;
            var left = condition.expressionItem.left;
            /*
             * Delete the unselected property used to highlight the text in the view
             */
            delete left.unselected;
            type === "Attribute" ? ruleFactory.setLeftAttribute(left, selected) : ruleFactory.setLeftRemaining(condition, selected, type);
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.controller.updateLeftItem()');
        }

    }


    function updateConditionRight(node) {
        var condition = node.$modelValue;
        var type = conditionFactory.getType(condition);
        /*
         * If the condition has a 'magnitude' left side attribute, the expression editor is opened
         */
        if (type === "Attribute" && condition.expressionItem.left.expressionItem.attribute === 'magnitude') {
            openEditor(condition);
            return;
        }
        /*
         * If the condition at hand is a CompareDatavalue and the left item has not been selected yet
         */
        if(!condition.expressionItem.left.expressionItem.code && (type === "DataValue" || type === "Attribute")) {
            var modalData = {headerText: 'Select an element', bodyText: 'You have to select an element before choosing a data value'};
            var modalOptions = {component: 'dialogComponent'};
            modalService.showModal(modalOptions, modalData);
            return;
        }

        var data = ruleFactory.getDataModal(condition);
        var options = ruleFactory.getOptionsModal(condition);

        modalService.showModal(options, data).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }

            var selected = modalResponse.data.selectedItem;

            var left = condition.expressionItem.left
            var right = condition.expressionItem.right;
            /*
             * Delete the unselected property used to highlight the text in the view
             */
            delete right.unselected;

            if (type === "Attribute") {
                ruleFactory.setAttribute(left.expressionItem, right, modalResponse);
            } else if (type === "NullValue") {
                ruleFactory.setNullValue(right, selected);
                // TODO: Does the 'attribute' property have always the same value (null_flavour) ??
            } else if (type === "DataValue") {
                ruleFactory.setCompareDataValue(right, modalResponse);
            } else if (type === "Element") {
                ruleFactory.setCompareElement (right, selected);
            }

        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.controller.updateLeftItem()');
        }

    }

    function openEditor(condition) {
        var modalData = {headerText: 'Expression editor'};
        var modalOptions = ruleFactory.getOptionsForTreeModal(condition);
        modalOptions.component = 'expressionEditorComponent';
        modalOptions.size = 'lg';

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete() {
            $log.info('Modal completed at: ' + new Date() + ' in openEditor()');
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in openEditor()');
        }
    }

    function updateActionLeft(node) {
        var action = node.$modelValue;
        var type = actionFactory.getType(action);

        var modalData = {headerText: 'Select element instance'};
        var modalOptions = ruleFactory.getOptionsForTreeModal(action);

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }
            var selected = modalResponse.data.selectedItem;
            /*
             * Delete the unselected property used to highlight the text in the view
             */
            delete action.variable.unselected;

            type === "Attribute" ? ruleFactory.setLeftAttribute(action, selected) : ruleFactory.setLeftRemaining(action, selected, type);
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.controller.updateLeftItem()');
        }
    }


    function updateActionRight(node) {
        var action = node.$modelValue;
        var type = actionFactory.getType(action);
        /*
         * If the action has a 'magnitude' left side attribute, the expression editor is opened
         */
        if (action.variable.attribute === 'magnitude') {
            openEditor(action);
            return;
        }
        /*
         * If the action at hand is a CompareDatavalue and the left item has not been selected yet
         */
        if(!action.variable.code && (type === "DataValue" || type === "Attribute")) {
            var modalData = {headerText: 'Select an element', bodyText: 'You have to select an element before choosing a data value'};
            var modalOptions = {component: 'dialogComponent'};
            modalService.showModal(modalOptions, modalData);
            return;
        }

        var data = ruleFactory.getDataModal(action);
        var options = ruleFactory.getOptionsModal(action);

        modalService.showModal(options, data).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }
            var selected = modalResponse.data.selectedItem;
            var variable = action.variable;
            var assignment = action.assignment;
            /*
             * Delete the unselected property used to highlight the text in the view
             */

            delete assignment.unselected;
            var type = modalResponse.data.type;

            if(type === "NullValue") {
                ruleFactory.setNullValue(assignment, selected);
            } else if(type === "ElementValue") {
                ruleFactory.setCompareElement (assignment, selected);
            } else if(type === "AttributeValue") {
                ruleFactory.setAttribute(variable, assignment, modalResponse);
            } else {
                ruleFactory.setCompareDataValue(assignment, modalResponse);
            }
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.controller.updateLeftItem()');
        }

    }


}