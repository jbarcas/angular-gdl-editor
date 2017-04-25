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
    vm.getAttribute = getAttribute;
    vm.updateLeftItem = updateLeftItem;
    vm.updateRightItem = updateRightItem;
    vm.terms = guidelineFactory.getOntology().termDefinitions.en.terms;

    /*
     * Options to manage the drag and drop nested level
     */
    vm.treeOptions = {
        accept: function (sourceNodeScope, destNodeScope) {
            return true
        }
    };

    vm.delete = "../assets/img/del.png";
    vm.add = "../assets/img/add.png";

    vm.back = function () {
        window.history.back();
    };

    var elementExistsOptions = [
        {label: 'exists', value: 'UNEQUALITY'},
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

        /**
         * If the node is an element, a predicate function or a predicate exists, then it has no right part.
         */
        if (conditionType === "ElementExists") {
            return;
        } else if (conditionType === "CompareAttribute" && condition.expressionItem.left.expressionItem.attribute === 'units') {
            value = condition.expressionItem.right.expressionItem.value;
        } else if (conditionType === "CompareAttribute" && condition.expressionItem.left.expressionItem.attribute === 'magnitude') {
            value = "Expression";
        } else if (conditionType === "CompareElement") {
            value = vm.terms[condition.expressionItem.right.expressionItem.code].text;
        } else if (conditionType === "CompareNullValue" || conditionType === "CompareDataValue") {
            value = condition.expressionItem.right.expressionItem.value
        }
        return value;
    }

    /**
     * On the flight, gets the attribute of the left-side part of a condition
     * @param node
     * @returns {*}
     */
    function getAttribute(node) {
        if (ruleFactory.getConditionType(node) !== "CompareAttribute") {
            return;
        }
        return node.expressionItem.left.expressionItem.attribute;
    }

    function updateLeftItem(node) {
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

            if (type === "CompareAttribute") {
                /**
                 * If the selected item has an id, then it is an element present in archetype definitions, so
                 * we only have to change its gtCode.
                 *
                 * If the element does not exist in archetype definitions, we first have to add it, and
                 * then we have to create the corresponding entry in the ontology section
                 */
                if (selected.parent.id) {
                    vm.rule.whenStatements[index].expressionItem.left.expressionItem.code = selected.parent.id;
                    vm.rule.whenStatements[index].expressionItem.left.expressionItem.attribute = selected.viewText;
                } else {
                    selected.id = utilsFactory.generateGt(guidelineFactory.getCurrentGuide());
                    vm.rule.whenStatements[index].expressionItem.left.expressionItem.code = selected.id;
                    vm.rule.whenStatements[index].expressionItem.left.expressionItem.attribute = selected.viewText;
                    ruleFactory.addToElements(selected);
                    var path = selected.path;
                    var atCode = path.substring(path.lastIndexOf("[") + 1, path.lastIndexOf("]"));
                    guidelineFactory.getOntology().termDefinitions.en.terms[selected.id] = {
                        id: selected.id,
                        text: guidelineFactory.getTerms()[selected.parent.viewText][atCode].text,
                        description: guidelineFactory.getTerms()[selected.parent.viewText][atCode].description
                    };
                }
            } else {
                /**
                 * If the selected item has an id, then it is an element present in archetype definitions, so
                 * we only have to change its gtCode.
                 *
                 * If the element does not exist in archetype definitions, we first have to add it, and
                 * then we have to create the corresponding entry in the ontology section
                 */
                if (selected.id) {
                    vm.rule.whenStatements[index].expressionItem.left.expressionItem.code = selected.id;
                    /**
                     * If it is a Compare Null Value condition we should change the name property
                     */
                    if (type === "CompareNullValue") {
                        vm.rule.whenStatements[index].expressionItem.left.expressionItem.name = selected.viewText;
                        // TODO: Does the 'attribute' property have always the same value (null_flavour) ??
                    }
                } else {
                    selected.id = utilsFactory.generateGt(guidelineFactory.getCurrentGuide());
                    vm.rule.whenStatements[index].expressionItem.left.expressionItem.code = selected.id;
                    /**
                     * If it is a Compare Null Value condition we should change the name property
                     */
                    if (type === "CompareNullValue") {
                        vm.rule.whenStatements[index].expressionItem.left.expressionItem.name = selected.viewText;
                    }
                    ruleFactory.addToElements(selected);
                    var path = selected.path;
                    var atCode = path.substring(path.lastIndexOf("[") + 1, path.lastIndexOf("]"));
                    guidelineFactory.getOntology().termDefinitions.en.terms[selected.id] = {
                        id: selected.id,
                        text: guidelineFactory.getTerms()[selected.parent.viewText][atCode].text,
                        description: guidelineFactory.getTerms()[selected.parent.viewText][atCode].description
                    };
                }
            }

        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.controller.updateLeftItem()');
        }

    }


    function updateRightItem(node) {

        var condition = node.$modelValue;
        var index = node.$index;
        var type = ruleFactory.getConditionType(condition);

        /**
         * If the condition has a 'magnitude' left side attribute, the expression editor is opened
         */
        if (type === "CompareAttribute" && condition.expressionItem.left.expressionItem.attribute === 'magnitude') {
            openEditor(condition);
            return;
        }

        var data = ruleFactory.getDataForModal(condition);
        var options = ruleFactory.getOptionsForRightModal(condition);

        modalService.showModal(options, data).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }

            var selected = modalResponse.data.selectedItem;

            var rightPart = vm.rule.whenStatements[index].expressionItem.right;

            if (type === "CompareAttribute") {
                ruleFactory.setCompareAttributeUnits(rightPart, selected);
            } else if (type === "CompareNullValue") {
                ruleFactory.setCompareNullValue(rightPart, selected);
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


}