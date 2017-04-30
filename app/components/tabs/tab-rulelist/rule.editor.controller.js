/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.controllers')
    .controller('RuleEditorCtrl', RuleEditorCtrl);

function RuleEditorCtrl($stateParams, $log, guidelineFactory, utilsFactory, modalService, ruleFactory) {

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
        {title: 'Compare (DataValue)', category: "CompareDataValue", draggable: true},
        {title: 'Compare (NullValue)', category: "CompareNullValue", draggable: true},
        {title: 'Compare (Element)',   category: "CompareElement",   draggable: true},
        {title: 'Compare (Attribute)', category: "CompareAttribute", draggable: true},
        {title: 'Element exists',      category: "ElementExists",    draggable: true},
        {title: 'Or operator',         category: "Or",               draggable: true}
    ];

    vm.treeDefinitions = {
        /**
         * Transforms the model before dragging
         * @param event
         */
        beforeDrop: function(event) {
            var cloneModel = event.source.cloneModel;
            if(cloneModel.category === "CompareDataValue") {
                ruleFactory.createCompareDataValue(cloneModel);
            } else if(cloneModel.category === "CompareNullValue") {
                ruleFactory.createCompareNullValue(cloneModel);
            } else if (cloneModel.category === "CompareElement") {
                ruleFactory.createCompareElement(cloneModel);
            } else if (cloneModel.category === "CompareAttribute") {
                ruleFactory.createCompareAttribute(cloneModel);
            } else if (cloneModel.category === "ElementExists") {
                ruleFactory.createElementExists(cloneModel);
            } else if (cloneModel.category === "Or") {
                ruleFactory.createOr(cloneModel);
            }
            delete cloneModel.category;
            delete cloneModel.draggable;
            delete cloneModel.title;
        }
    };

    var elementExistsOptions = [
        {label: 'exists', value: 'INEQUAL'},
        {label: 'does not exist', value: 'EQUALITY'}
    ];

    var compareAttributeOptions = [
        {label: '==', value: 'EQUALITY'},
        {label: '!=', value: 'INEQUAL'},
        {label: '<', value: 'LESS_THAN'},
        {label: '<=', value: 'LESS_THAN_OR_EQUAL'},
        {label: '>', value: 'GREATER_THAN'},
        {label: '>=', value: 'GREATER_THAN_OR_EQUAL'}
    ];

    var compareElementOptions = [
        {label: '==', value: 'EQUALITY'},
        {label: '!=', value: 'INEQUAL'},
        {label: '<', value: 'LESS_THAN'},
        {label: '<=', value: 'LESS_THAN_OR_EQUAL'},
        {label: '>', value: 'GREATER_THAN'},
        {label: '>=', value: 'GREATER_THAN_OR_EQUAL'},
        {label: 'IS_A', value: 'IS_A'},
        {label: '!IS_A', value: 'IS_NOT_A'}
    ];

    var compareNullValueOptions = [
        {label: '==', value: 'EQUALITY'},
        {label: '!=', value: 'INEQUAL'}
    ];

    var compareDataValueOptions = [
        {label: '==', value: 'EQUALITY'},
        {label: '!=', value: 'INEQUAL'},
        {label: '<', value: 'LESS_THAN'},
        {label: '<=', value: 'LESS_THAN_OR_EQUAL'},
        {label: '>', value: 'GREATER_THAN'},
        {label: '>=', value: 'GREATER_THAN_OR_EQUAL'},
        {label: 'IS_A', value: 'IS_A'},
        {label: '!IS_A', value: 'IS_NOT_A'}
    ];

    var orOptions = [
        {label: 'OR', value: 'OR'}
    ];

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
        var conditionType = ruleFactory.getConditionType(node);
        var options;
        if (conditionType === "ElementExists") {
            options = elementExistsOptions;
        } else if (conditionType === "CompareAttribute") {
            options = compareAttributeOptions;
        } else if (conditionType === "CompareElement") {
            options = compareElementOptions;
        } else if (conditionType === "CompareNullValue") {
            options = compareNullValueOptions;
        } else if (conditionType === "CompareDataValue") {
            options = compareDataValueOptions;
        } else if (conditionType === "Or") {
            options = orOptions;
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
        var conditionType = ruleFactory.getConditionType(condition);
        var value;

        /*
         * If the node is an element, a predicate function or a predicate exists, then it has no right part.
         */
        if (conditionType === "ElementExists") {
            return;
        } else if (conditionType === "CompareAttribute" && condition.expressionItem.left.expressionItem.attribute === 'units') {
            value = condition.expressionItem.right.expressionItem.value;
        } else if (conditionType === "CompareAttribute" && condition.expressionItem.left.expressionItem.attribute === 'magnitude') {
            value = "Expression";
        } else if (conditionType === "CompareElement") {
            value = condition.expressionItem.right.expressionItem.code ? vm.terms[condition.expressionItem.right.expressionItem.code].text : "";
        } else if (conditionType === "CompareNullValue" || conditionType === "CompareDataValue") {
            value = condition.expressionItem.right.expressionItem.value
        }
        return value;
    }

    function updateConditionLeft(node) {
        var condition = node.$modelValue;
        var index = node.$index;
        var type = ruleFactory.getConditionType(condition);

        var modalData = {headerText: 'Select element instance'};
        var modalOptions = ruleFactory.getOptionsForLeftModal(condition);

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }
            var selected = modalResponse.data.selectedItem;
            var leftPart = vm.rule.whenStatements[index].expressionItem.left;
            /*
             * Delete the unselected property used to highlight the text in the view
             */
            delete leftPart.unselected;
            type === "CompareAttribute" ? ruleFactory.setLeftCompareAttribute(leftPart, selected) : ruleFactory.setLeftRemaining(leftPart, selected, type);
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.controller.updateLeftItem()');
        }

    }


    function updateConditionRight(node) {
        var condition = node.$modelValue;
        var index = node.$index;
        var type = ruleFactory.getConditionType(condition);
        /*
         * If the condition has a 'magnitude' left side attribute, the expression editor is opened
         */
        if (type === "CompareAttribute" && condition.expressionItem.left.expressionItem.attribute === 'magnitude') {
            openEditor(condition);
            return;
        }
        /*
         * If the condition at hand is a CompareDatavalue and the left item has not been selected yet
         */
        if(!condition.expressionItem.left.expressionItem.code && (type === "CompareDataValue" || type === "CompareAttribute")) {
            var modalData = {headerText: 'Select an element', bodyText: 'You have to select an element before choosing a data value'};
            var modalOptions = {component: 'dialogComponent'};
            modalService.showModal(modalOptions, modalData);
            return;
        }

        var data = ruleFactory.getConditionDataForModal(condition);
        var options = ruleFactory.getConditionOptionsForRightModal(condition);

        modalService.showModal(options, data).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }

            var selected = modalResponse.data.selectedItem;

            /*
             * Delete the unselected property used to highlight the text in the view
             */
            delete vm.rule.whenStatements[index].expressionItem.right.unselected;

            var rightPart = vm.rule.whenStatements[index].expressionItem.right;

            if (type === "CompareAttribute") {
                ruleFactory.setConditionAttribute(condition, selected);
            } else if (type === "CompareNullValue") {
                ruleFactory.setNullValue(rightPart, selected);
                // TODO: Does the 'attribute' property have always the same value (null_flavour) ??
            } else if (type === "CompareDataValue") {
                ruleFactory.setCompareDataValue(rightPart, modalResponse);
            } else if (type === "CompareElement") {
                ruleFactory.setCompareElement (rightPart, selected);
            }

        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.controller.updateLeftItem()');
        }

    }

    function openEditor(condition) {
        var modalData = {headerText: 'Expression editor'};
        var modalOptions = ruleFactory.getOptionsForLeftModal(condition);
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
        var index = node.$index;

        var modalData = {headerText: 'Select element instance'};
        var modalOptions = ruleFactory.getOptionsForLeftModal(action);

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }
            var selected = modalResponse.data.selectedItem;
            //var leftPart = vm.rule.thenStatements[index].variable;
            /*
             * Delete the unselected property used to highlight the text in the view
             */
            //delete leftPart.unselected;
            ruleFactory.setActionLeft(action, selected);
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.controller.updateLeftItem()');
        }
    }


    function updateActionRight(node) {
        var action = node.$modelValue;
        var index = node.$index;
        var type = ruleFactory.getActionType(action);
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
        /*if(!action.expressionItem.left.expressionItem.code && (type === "CompareDataValue" || type === "CompareAttribute")) {
            var modalData = {headerText: 'Select an element', bodyText: 'You have to select an element before choosing a data value'};
            var modalOptions = {component: 'dialogComponent'};
            modalService.showModal(modalOptions, modalData);
            return;
        } */

        var data = ruleFactory.getActionDataForModal(action);
        var options = ruleFactory.getActionOptionsForRightModal(action);

        modalService.showModal(options, data).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }
            var selected = modalResponse.data.selectedItem;
            /*
             * Delete the unselected property used to highlight the text in the view
             */
            delete vm.rule.thenStatements[index].assignment.unselected;

            var rightPart = vm.rule.thenStatements[index].assignment;

            if (type === "SetAttribute") {
                ruleFactory.setActionAttribute(action, modalResponse);
            } else if (type === "SetNullValue") {
                ruleFactory.setNullValue(rightPart, selected);
                // TODO: Does the 'attribute' property have always the same value (null_flavour) ??
            } else if (type === "SetDataValue") {
                ruleFactory.setCompareDataValue(rightPart, modalResponse);
            } else if (type === "SetElement") {
                ruleFactory.setCompareElement (rightPart, selected);
            }

        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.controller.updateLeftItem()');
        }

    }


}