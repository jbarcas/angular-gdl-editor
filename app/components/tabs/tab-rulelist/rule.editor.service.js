/**
 * Created by jbarros on 11/04/17.
 */

angular.module('app.services')
    .factory('ruleFactory', ruleFactory);

function ruleFactory(guidelineFactory, definitionsFactory, utilsFactory, ATTRIBUTES, NULLVALUE) {

    return {
        getConditionType: getConditionType,
        getActionType: getActionType,
        getConditionDataForModal: getConditionDataForModal,
        getActionDataForModal: getActionDataForModal,
        getOptionsForLeftModal: getOptionsForLeftModal,
        getConditionOptionsForRightModal: getConditionOptionsForRightModal,
        getActionOptionsForRightModal: getActionOptionsForRightModal,
        addToElements: addToElements,
        // ---------------------------------
        setLeftCompareAttribute: setLeftCompareAttribute,
        setLeftRemaining: setLeftRemaining,
        // ---------------------------------
        setConditionAttribute: setConditionAttribute,
        setNullValue: setNullValue,
        setCompareDataValue: setCompareDataValue,
        setCompareElement: setCompareElement,
        // ---------------------------------
        createCompareDataValue: createCompareDataValue,
        createCompareNullValue: createCompareNullValue,
        createCompareElement: createCompareElement,
        createCompareAttribute: createCompareAttribute,
        createElementExists: createElementExists,
        createOr: createOr,
        // ---------------------------------
        setActionAttribute: setActionAttribute,
        setActionLeft: setActionLeft

    };

    function getConditionType(condition) {
        var type;
        if (condition.expressionItem.operator === "OR") {
            type = "Or";
        } else if (condition.expressionItem.right.expressionItem.value === "null") {
            type = "ElementExists";
        } else if (condition.expressionItem.left.expressionItem.attribute === "null_flavor") {
            type = "CompareNullValue";
        } else if (condition.expressionItem.left.expressionItem.hasOwnProperty("attribute")) {
            type = "CompareAttribute";
        } else if (condition.expressionItem.right.expressionItem.hasOwnProperty("code")) {
            type = "CompareElement";
        } else {
            type = "CompareDataValue";
        }
        return type;
    }

    function getActionType(action) {
        var type;
        if (action.variable.attribute === "null_flavor") {
            type = "SetNullValue";
        } else if (ATTRIBUTES.DV_QUANTITY.indexOf(action.variable.attribute) > -1) {
            type = "SetAttribute";
        } else if (action.assignment.type === "Variable") {
            type = "SetElement";
        } else {
            type = "SetDataValue";
        }
        return type;
    }

    function getConditionDataForModal(condition) {
        var conditionType = getConditionType(condition);
        var modalData = {};
        if (conditionType === 'CompareElement') {
            modalData.headerText = 'Select element instance'
        } else if (conditionType === 'CompareNullValue') {
            modalData.headerText = 'NullValue';
            modalData.bodyText = 'A Null flavor may be recorded where it has not been possible to provide information, particularly for mandatory data elements. The possible values are No information, Unknown, Masked and Not applicable.';
        } else if (conditionType === 'CompareDataValue') {
            var gtCode = condition.expressionItem.left.expressionItem.code;
            var term = guidelineFactory.getOntology().termDefinitions.en.terms[gtCode];
            modalData.headerText = term.text;
            modalData.bodyText = term.description;

            var dataValueType = condition.expressionItem.right.type;
            if(dataValueType === 'QuantityConstant') {
                modalData.placeholder = 'Enter magnitude'
            }

        } else if (conditionType === 'CompareAttribute') {
            var attribute = condition.expressionItem.left.expressionItem.attribute;
            modalData.placeholder = 'Enter ' + attribute;
            modalData.headerText = attribute;
        }
        return modalData;
    }

    function getActionDataForModal(action) {
        var actionType = getActionType(action);
        var modalData = {};
        if (actionType === 'SetElement') {
            modalData.headerText = 'Select element instance'
        } else if (actionType === 'SetNullValue') {
            modalData.headerText = 'NullValue';
            modalData.bodyText = 'A Null flavor may be recorded where it has not been possible to provide information, particularly for mandatory data elements. The possible values are No information, Unknown, Masked and Not applicable.';
        } else if (actionType === 'SetDataValue') {
            var gtCode = action.variable.code;
            var term = guidelineFactory.getOntology().termDefinitions.en.terms[gtCode];
            modalData.headerText = term.text;
            modalData.bodyText = term.description;
        } else if (actionType === 'SetAttribute') {
            var attribute = action.variable.attribute;
            modalData.headerText = attribute;
            if(attribute === 'precision') {
                modalData.placeholder = 'Enter precision';
                modalData.bodyText = 'Enter the precision';
            }
        }
        return modalData;
    }

    /**
     * Gets the options for the left side modal
     * @param condition
     * @returns {{}}
     */
    function getOptionsForLeftModal(condition) {
        var conditionType;

        if(condition.variable) {
            conditionType = getActionType(condition);
        } else {
            conditionType = getConditionType(condition);
        }

        var modalOptions = {};
        modalOptions.component = "modalWithTreeComponent";
        modalOptions.resolve = {};
        var modalItems = [];
        var archetypeBindings = angular.copy(guidelineFactory.getArchetypeBindings());
        var termDefinitions = angular.copy(guidelineFactory.getOntology().termDefinitions.en.terms);
        var elements = [];
        angular.forEach(archetypeBindings, function (archetypeBinding) {
            angular.forEach(archetypeBinding.elements, function (element) {
                if (element.path) {
                    elements.push(element);
                }
            })
        });
        modalOptions.resolve.items = function () {
            /*
             * Add the already instantiated elements
             */
            angular.forEach(elements, function (element) {
                var viewElement = angular.copy(element);
                viewElement.viewText = termDefinitions[element.id].text;
                /*
                 * If it is a compare attribute, we should add its attributes
                 */
                if (conditionType === "CompareAttribute" || conditionType === "SetAttribute") {
                    var archetypeElement = guidelineFactory.getElementByGtCode(element.id);
                    var children = [];
                    angular.forEach(ATTRIBUTES[archetypeElement.dataType], function(item){
                        children.push({viewText: item});
                    });
                    viewElement.children = children;
                    viewElement.dataType = archetypeElement.dataType;
                }
                modalItems.push(viewElement);
            });

            /*
             * Add the archetypes and its elements
             */
            // root element
            var item = {
                viewText: "Archetypes",
                dataType: "FOLDER",
                children: []
            };
            // subitems
            angular.forEach(guidelineFactory.getGuidelineArchetypes(), function (archetype) {
                var archetypeView = angular.copy(archetype);
                archetypeView.viewText = archetype.archetypeId;
                archetypeView.dataType = utilsFactory.getArchetypeType(archetype.archetypeId);
                archetypeView.children = [];
                for (var element in archetype.elementMaps) {
                    var viewElement = angular.copy(archetype.elementMaps[element]);
                    viewElement.viewText = element;
                    archetypeView.children.push(viewElement);
                }
                item.children.push(archetypeView);
            });
            modalItems.push(item);
            return modalItems;
        };
        return modalOptions;
    }

    function getOptionsForNullValue (expression) {
        var modalOptions = {resolve: {}, component: "modalWithInputAndDropdownComponent"}, modalItems = [];
        var expressionItem = expression.variable ? expression.assignment.expressionItem : expression.expressionItem.right.expressionItem;
        modalOptions.resolve.items = function() {
            for(var i in NULLVALUE) {
                modalItems.push({viewText: NULLVALUE[i].viewText, value: NULLVALUE[i].value});
            }
            return modalItems;
        };
        modalOptions.resolve.default = function() {
            var defaultOption = {
                viewText: expressionItem.codedText ? expressionItem.codedText.value : {},
                value: expressionItem.codedText ? expressionItem.codedText.definingCode.codeString : {}
            };
            return defaultOption;
        };
        return modalOptions;
    }

    function isAction (expression) {
        return expression.hasOwnProperty('variable');
    }

    /**
     * Gets the options for the right side modal
     * @param condition
     * @returns {{}}
     */
    function getConditionOptionsForRightModal(condition) {
        var conditionType = getConditionType(condition);
        var modalOptions = {
            resolve: {}
        };

        if(conditionType === 'CompareElement') {
            return getOptionsForLeftModal(condition);
        } else if (conditionType === 'CompareNullValue') {
            return getOptionsForNullValue(condition);
        } else if (conditionType === 'CompareDataValue') {
            if(condition.expressionItem.right.type === "QuantityConstant") {
                modalOptions.component = "modalWithInputAndDropdownComponent";
                var quantity = condition.expressionItem.right.expressionItem.quantity || {};
                var magnitude = quantity.magnitude;
                modalOptions.resolve.input = function() {
                    var input = {
                        value: magnitude
                    };
                    return input;
                };
                modalOptions.resolve.items = function() {
                    // FIXME: Get the options in a right way
                    var options = ['kg/m2', 'cm', 'in'];
                    var modalItems = [];
                    for(var i in options) {
                        modalItems.push({viewText: options[i]});
                    }
                    return modalItems;
                };
                modalOptions.resolve.default = function() {
                    var units = quantity.units || {};
                    var defaultOption = {
                        viewText: units
                    };
                    return defaultOption;
                };
            } else if(condition.expressionItem.right.type === "OrdinalConstant") {
                return getOptionsForSetDataValueOrdinal(condition);
            }

        } else if (conditionType === 'CompareAttribute') {
            modalOptions.component = "modalWithInputAndDropdownComponent";
            modalOptions.resolve.items = function() {
                // FIXME: Get the options in a right way
                var temporalMockOptions = ['kg/m2', 'cm', 'in'];
                var modalItems = [];
                for(var i in temporalMockOptions) {
                    modalItems.push({viewText: temporalMockOptions[i]});
                }
                return modalItems;
            };
            modalOptions.resolve.default = function() {
                var def = condition.expressionItem.right.expressionItem.value;
                var defaultOption = {
                    viewText: def
                };
                return defaultOption;
            };
        }
        return modalOptions;
    }

    function getDataValueType(action) {
        var assignmentType = action.assignment.type;
        if(assignmentType === 'CodedTextConstant') {
            return 'CodedText';
        } else if(assignmentType === 'OrdinalConstant') {
            return 'Ordinal';
        }
    }

    function getActionOptionsForRightModal(action) {
        var actionType = getActionType(action);
        if(actionType === 'SetAttribute') {
            var attribute = action.variable.attribute;
            if(attribute === 'units') {
                return getOptionsForSetElement(action);
            } else if(attribute === 'precision') {
                return getOptionsForAttributePrecision(action);
            }
        } else if(actionType === "SetElement") {
            return getOptionsForLeftModal(action);
        } else if(actionType === "SetNullValue") {
            return getOptionsForNullValue(action);
        } else if(actionType === "SetDataValue") {
            // TODO: remaining tpes: QuantityConstant, StringConstant, DatetimeConstant, OrdinalConstant...
            if(getDataValueType(action) === "CodedText") {
                return getOptionsForSetDataValueCodedText(action);
            } else if(getDataValueType(action) === "Ordinal") {
                return getOptionsForSetDataValueOrdinal(action);
            }
        }
    }

    /**
     * In "Actions": get the options for the right part of expression
     * when the expression is a "Set(datavalue)" => Ordinal
     *
     *   1. Get the left side element
     *   2. Retrieve all the coded text options for that element
     *
     * @param expression
     * @returns modalOptions Object with the modal options
     */
    function getOptionsForAttributePrecision(expression) {
        var modalOptions = {resolve: {}, component: "modalWithInputAndDropdownComponent"};

        var precision = expression.assignment.expressionItem.value;
        modalOptions.resolve.input = function() {
            var input = {
                type: "Precision",
                value: precision
            }
            return input;
        };
        return modalOptions;
    }

    /**
     * In "Actions": get the options for the right part of expression
     * when the expression is a "Set(datavalue)" => Ordinal
     *
     *   1. Get the left side element
     *   2. Retrieve all the coded text options for that element
     *
     * @param expression
     * @returns modalOptions Object with the modal options
     */
    function getOptionsForSetDataValueOrdinal(expression) {
        var modalOptions = {resolve: {}, component: "modalWithInputAndDropdownComponent"}, modalItems = [];
        var defaultOption = {};
        var code, ordinal;
        if(isAction(expression)) {
            code = expression.variable.code;
            ordinal = expression.assignment.expressionItem.ordinal;
        } else {
            code = expression.expressionItem.left.expressionItem.code;
            ordinal = expression.expressionItem.right.expressionItem.ordinal;
        }
        var element = guidelineFactory.getElementByGtCode(code);
        modalOptions.resolve.items = function() {
            var attributes = element.attributeMaps;
            for(attribute in attributes) {
                if(ordinal && attributes[attribute].code == ordinal.symbol.definingCode.codeString) {
                    defaultOption = attributes[attribute];
                }
                attributes[attribute].viewText = attributes[attribute].value + " - " + attributes[attribute].text;
                attributes[attribute].type = attributes[attribute].type;
                modalItems.push(attributes[attribute]);
            }
            return modalItems;
        };
        modalOptions.resolve.default = function() {
            return defaultOption;
        };
        return modalOptions;
    }

    /**
     * In "Actions": get the options for the right part of expression
     * when the action is a "Set(datavalue)" => CodedText
     *
     *   1. Get the left side element
     *   2. Retrieve all the coded text options for that element
     *
     * @param action
     * @returns modalOptions Object with the modal options
     */
    function getOptionsForSetDataValueCodedText(action) {
        var modalOptions = {resolve: {}, component: "modalWithInputAndDropdownComponent"}, modalItems = [];
        var code = action.variable.code;

        var element = guidelineFactory.getElementByGtCode(code);

        var defaultOption = {};

        modalOptions.resolve.items = function() {
            var attributes = element.attributeMaps;
            for(var attribute in attributes) {
                if(action.assignment.expressionItem.codedText &&
                    action.assignment.expressionItem.codedText.definingCode &&
                    attributes[attribute].code == action.assignment.expressionItem.codedText.definingCode.codeString) {
                    defaultOption = attributes[attribute];
                }
                attributes[attribute].viewText = attributes[attribute].text;
                attributes[attribute].type = "CodedText";
                modalItems.push(attributes[attribute]);
            }
            return modalItems;
        };
        modalOptions.resolve.default = function() {
            return defaultOption;
        };
        return modalOptions;
    }

    /**
     * In "Actions": get the options for the right part of expression
     * when the action is a "Set(datavalue)" => CodedText
     *
     *   1. Get the left side element
     *   2. Retrieve all the coded text options for that element
     *
     * @param action
     * @returns modalOptions Object with the modal options
     */
    function getOptionsForSetDataValueQuantity(action) {

    }


    /**
     * In "Actions": get the options for the right part of expression
     * when the action is a "Set(element)"
     *
     *   1. Get the left side attribute
     *   2. Get all the options for that attribute to show in the modal
     *
     * @param action
     * @returns modalOptions Object with the modal options
     */
    function getOptionsForSetElement(action) {
        var modalOptions = {resolve: {}, component: "modalWithInputAndDropdownComponent"}, modalItems = [];
        var attribute = action.variable.attribute;
        var temporalMockOptions = ['kg/m2', 'in', 'cm'];
        modalOptions.resolve.items = function() {
            for(var i in temporalMockOptions) {
                modalItems.push({viewText: temporalMockOptions[i]});
            }
            return modalItems;
        };
        return modalOptions;
    }


    /**
     * In "Actions": get the options for the right part of expression
     * when the action is a "Set(datavalue)"
     *
     *   1. Get the left side element
     *   2. Get all the options for that element to show in the modal
     *
     * @param action
     * @returns modalOptions Object with the modal options
     */
    /*function getOptionsForSetDataValue(action) {

    } */


    /**
     * Adds an element into the Archetype Binding definitions
     * @param element
     */
    function addToElements(element) {
        var archetypeId = element.parent.viewText;
        guidelineFactory.addElementToDefinitions(element, archetypeId);
    }


    /**
     * Fill the "Compare Attribute" left part of a condition
     * @param left Left part of the condition
     * @param data Input from the user
     */
    function setLeftCompareAttribute (left, data) {
        /*
         * If the selected item has an id, then it is an element present in archetype definitions, so
         * we only have to change its gtCode.
         *
         * If the element does not exist in archetype definitions, we first have to add it, and
         * then we have to create the corresponding entry in the ontology section
         */
        if (data.parent.id) {
            left.expressionItem.code = data.parent.id;
            left.expressionItem.attribute = data.viewText;
        } else {
            data.id = utilsFactory.generateGt(guidelineFactory.getCurrentGuide());
            left.expressionItem.code = data.id;
            left.expressionItem.attribute = data.viewText;
            addToElements(data);
            var path = data.path;
            var atCode = path.substring(path.lastIndexOf("[") + 1, path.lastIndexOf("]"));
            guidelineFactory.getOntology().termDefinitions.en.terms[data.id] = {
                id: data.id,
                text: atCode !== "" ? guidelineFactory.getTerms()[data.parent.viewText][atCode].text : "",
                description: atCode !== "" ? guidelineFactory.getTerms()[data.parent.viewText][atCode].description : ""
            };
        }
    }

    /**
     * Fill the remaining left part of a condition
     * @param left Left part of the condition
     * @param data Input from the user
     */
    function setLeftRemaining (left, data, type) {
        /*
         * If the selected item has an id, then it is an element present in archetype definitions, so
         * we only have to change its gtCode.
         *
         * If the element does not exist in archetype definitions, we first have to add it, and
         * then we have to create the corresponding entry in the ontology section
         */
        if (data.id) {
            left.expressionItem.code = data.id;
            /**
             * If it is a Compare Null Value condition we should change the name property
             */
            if (type === "CompareNullValue") {
                left.expressionItem.name = data.viewText;
                // TODO: Does the 'attribute' property have always the same value (null_flavour) ??
            }
        } else {
            data.id = utilsFactory.generateGt(guidelineFactory.getCurrentGuide());
            left.expressionItem.code = data.id;
            /*
             * If it is a Compare Null Value condition we should change the name property
             */
            if (type === "CompareNullValue") {
                left.expressionItem.name = data.viewText;
            }
            addToElements(data);
            var path = data.path;
            var atCode = path.substring(path.lastIndexOf("[") + 1, path.lastIndexOf("]"));
            guidelineFactory.getOntology().termDefinitions.en.terms[data.id] = {
                id: data.id,
                text: guidelineFactory.getTerms()[data.parent.viewText][atCode].text,
                description: guidelineFactory.getTerms()[data.parent.viewText][atCode].description
            };
        }
    }

    /**
     * Fills the "Compare (NullValue)" and "Set (NullValue)" condition and action with the new values from the user input
     * @param right the right part of the condition/action
     * @param data information from the user input
     */
    function setNullValue(right, data) {
        var codeString = data.value;
        var value = data.viewText;
        right.expressionItem = {
            codedText: {
                definingCode: {
                    terminologyId: {
                        name: 'openehr',
                        value: 'openehr'
                    },
                    codeString: codeString
                },
                value: value
            }
        };
        right.expressionItem.value = right.expressionItem.codedText.definingCode.terminologyId.value + '::' +
        right.expressionItem.codedText.definingCode.codeString + '|' +
        right.expressionItem.codedText.value + '|';
    }

    /**
     * Fills the "Compare DataValue" condition with the new values from the user input
     * @param right the right part of the condition
     * @param response information from the user input
     */
    function setCompareDataValue (right, response) {

        if(right.type === 'OrdinalConstant') {
            definitionsFactory.setOrdinalConstant(right, response);
        } else if(right.type === 'QuantityConstant') {
            definitionsFactory.setQuantityConstant(right, response);
        } else if(right.type === 'CodedTextConstant') {
            definitionsFactory.setCodedTextConstant(right, response);
        } else if(right.type === 'StringConstant') {
            definitionsFactory.setStringConstant(right, response);
        } else if(right.type === 'DateTimeConstant') {
            definitionsFactory.setDateTimeConstant(right, response);
        }

    }

    /**
     * Fills the "Compare Element" condition with the new values from the user input
     * @param right the right part of the condition
     * @param selected information from the user input
     */
    function setCompareElement(right, selected) {
        /*
         * If the selected item has an id, then it is an element present in archetype definitions, so
         * we only have to change its gtCode.
         *
         * If the element does not exist in archetype definitions, we first have to add it, and
         * then we have to create the corresponding entry in the ontology section
         */
        if (selected.id) {
            right.expressionItem.code = selected.id;
        } else {
            selected.id = utilsFactory.generateGt(guidelineFactory.getCurrentGuide());
            right.expressionItem.code = selected.id;

            addToElements(selected);
            var path = selected.path;
            var atCode = path.substring(path.lastIndexOf("[") + 1, path.lastIndexOf("]"));
            guidelineFactory.getOntology().termDefinitions.en.terms[selected.id] = {
                id: selected.id,
                text: guidelineFactory.getTerms()[selected.parent.viewText][atCode].text,
                description: guidelineFactory.getTerms()[selected.parent.viewText][atCode].description
            };
        }
    }

    /**
     * Common properties for all conditions
     * @param model
     */
    function createCompare (model) {
        model.type = "BinaryExpression";
        model.expressionItem = {};

        model.expressionItem.left = {};
        model.expressionItem.left.unselected = true;
        model.expressionItem.left.type = "Variable";
        model.expressionItem.left.expressionItem = {};

        model.expressionItem.right = {};
        model.expressionItem.right.unselected = true;
        model.expressionItem.right.expressionItem = {};
    }

    /**
     * Create a new condition: Compare (DataValue)
     * @param model The model upon which a "Compare (DataValue)" is created
     */
    function createCompareDataValue (model) {
        createCompare(model);
        model.expressionItem.right.type = "QuantityConstant";
        model.expressionItem.operator = "EQUALITY";
    }

    /**
     * Create a new condition: Compare (NullValue)
     * @param model The model upon which a "Compare (NullValue)" is created
     */
    function createCompareNullValue (model) {
        createCompare(model);
        model.expressionItem.left.expressionItem.attribute = "null_flavor";
        model.expressionItem.right.type = "CodedTextConstant";
        model.expressionItem.right.expressionItem.code = "";
        model.expressionItem.operator = "EQUALITY";
    }

    /**
     * Create a new condition: Compare (Element)
     * @param model The model upon which a "Compare (Element)" is created
     */
    function createCompareElement (model) {
        createCompare(model);
        model.expressionItem.right.type = "Variable";
        model.expressionItem.right.expressionItem.code = "";
        model.expressionItem.operator = "EQUALITY";
    }

    /**
     * Create a new condition: Compare (Attribute)
     * @param model The model upon which a "Compare (Attribute)" is created
     */
    function createCompareAttribute (model) {
        createCompare(model);
        model.expressionItem.left.expressionItem.attribute = "";
        model.expressionItem.right.expressionItem.left = {};
        model.expressionItem.right.expressionItem.right = {};
        model.expressionItem.operator = "EQUALITY";
    }

    /**
     * Create a new condition: Element exists
     * @param model The model upon which a "Element exists" is created
     */
    function createElementExists (model) {
        createCompare(model);
        delete model.expressionItem.right.unselected;
        model.expressionItem.right.type = "ConstantExpression";
        model.expressionItem.right.expressionItem.value = "null";
        model.expressionItem.operator = "UNEQUALITY";
    }

    function createOr (model) {
        console.log("createOr" + model);
    }

    function setActionLeft (action, data) {
        var code, attribute;
        if(getActionType(action) === "SetAttribute") {
            code = data.parent.id;
            attribute = data.viewText;
            action.variable.attribute = attribute;
        } else {
            code = data.id;
        }
        action.variable.code = code;
    }

    function setConditionAttribute(condition, data) {
        if(condition.expressionItem.left.expressionItem.attribute === 'units') {
            //FIXME: What's the differnence between them?
            var string = data.viewText;
            var value = data.viewText;
            condition.expressionItem.right.expressionItem = {
                string: string,
                value: value
            };
        }
    }

    function setActionAttribute(action, response) {
        var attribute = action.variable.attribute;
        if(attribute === 'units') {
            //FIXME: What's the differnence between them?
            var string = response.data.selectedItem.viewText;
            var value = response.data.selectedItem.viewText;
            action.assignment.expressionItem = {
                string: string,
                value: value
            };
        } if(attribute === 'precision') {
            //FIXME: What's the differnence between them?
            var precision = response.data.input.value;
            action.assignment.expressionItem = {
                value: precision
            };
        }
    }
}
