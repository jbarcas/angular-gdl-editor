/**
 * Created by jbarros on 11/04/17.
 */

angular.module('app.services')
    .factory('ruleFactory', ruleFactory);

function ruleFactory(guidelineFactory, expressionItemFactory, conditionFactory, actionFactory, utilsFactory, ATTRIBUTES, NULLVALUE, DV) {

    return {
        getDataModal: getDataModal,
        getOptionsForTreeModal: getOptionsForTreeModal,
        getOptionsModal: getOptionsModal,
        addToElements: addToElements,
        // ---------------------------------
        setLeftAttribute: setLeftAttribute,
        setLeftRemaining: setLeftRemaining,
        setNullValue: setNullValue,
        setCompareDataValue: setCompareDataValue,
        setCompareElement: setCompareElement,
        // ---------------------------------
        setAttribute: setAttribute
        // -----------------------------------
    };

    /**
     * Fill the modal with the corresponding data: header text, body text, placeholders, etc.
     * @param expression
     * @returns {{}}
     */
    function getDataModal(expression) {
        var expressionType = isAction(expression) ? actionFactory.getType(expression) : conditionFactory.getType(expression);
        var modalData = {};
        if (expressionType === 'Element') {
            modalData.headerText = 'Select element instance'
        } else if (expressionType === 'NullValue') {
            modalData.headerText = 'NullValue';
            modalData.bodyText = 'A Null flavor may be recorded where it has not been possible to provide information, particularly for mandatory data elements. The possible values are No information, Unknown, Masked and Not applicable.';
        } else if (expressionType === 'DataValue') {
            var gtCode = isAction(expression) ? expression.variable.code: expression.expressionItem.left.expressionItem.code;
            var term = guidelineFactory.getOntology().termDefinitions.en.terms[gtCode];
            modalData.headerText = term.text;
            modalData.bodyText = term.description;
            var dataValueType = isAction(expression) ? expression.assignment.type : expression.expressionItem.right.type;
            if(dataValueType === 'QuantityConstant') {
                modalData.placeholder = 'Enter magnitude'
            }
        } else if (expressionType === 'Attribute') {
            var attribute = isAction(expression) ? expression.variable.attribute :expression.expressionItem.left.expressionItem.attribute;
            modalData.placeholder = 'Enter ' + attribute;
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
     * @param expression
     * @returns {{}}
     */
    function getOptionsForTreeModal(expression) {
        var expressionType = isAction(expression) ? actionFactory.getType(expression) :  conditionFactory.getType(expression);
        var modalOptions = {resolve: {}, component: "modalWithTreeComponent"}, modalItems = [];
        var archetypeBindings = angular.copy(guidelineFactory.getArchetypeBindings());
        var termDefinitions = angular.copy(guidelineFactory.getOntology().termDefinitions.en.terms);
        /*
         * Store the instantiated elements in "elements"
         */
        var elements = [];
        angular.forEach(archetypeBindings, function (archetypeBinding) {
            angular.forEach(archetypeBinding.elements, function (element) {
                if (element.path) {
                    var e = guidelineFactory.getElementByArchetypIdAndPath(archetypeBinding.archetypeId, element.path);
                    element.dataType = e.dataType;
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
                viewElement.type = 'ElementValue';
                /*
                 * If it is a compare attribute, we should add its attributes
                 */
                if (expressionType === "Attribute") {
                    addAttributesWithElement(viewElement, guidelineFactory.getElementByGtCode(element.id));
                }
                modalItems.push(viewElement);
            });

            /*
             * Add the archetypes and its elements (and its attributes)
             */
            // root element
            var item = { viewText: "Archetypes", dataType: "FOLDER", children: [] };
            // subitems
            angular.forEach(guidelineFactory.getGuidelineArchetypes(), function (archetype) {
                var archetypeView = angular.copy(archetype);
                archetypeView.viewText = archetype.archetypeId;
                archetypeView.dataType = utilsFactory.getArchetypeType(archetype.archetypeId);
                archetypeView.children = [];
                for (var element in archetype.elementMaps) {
                    var viewElement = angular.copy(archetype.elementMaps[element]);
                    viewElement.viewText = element;
                    /*
                     * If it is a compare attribute, we should add its attributes
                     */
                    if (expressionType === "Attribute") {
                        addAttributesWithArchetype(viewElement, archetype);
                    }
                    archetypeView.children.push(viewElement);
                }
                item.children.push(archetypeView);
            });
            modalItems.push(item);
            return modalItems;
        };
        return modalOptions;
    }

    /**
     * Add the attributes to show in the modal. Needed when the condition/action is a SetAttribute or CompareAttribute
     * @param element
     */
    function addAttributesWithArchetype(viewElement, archetype) {
        var element = archetype.elementMaps[viewElement.viewText];
        var children = [];
        angular.forEach(ATTRIBUTES[element.dataType], function(item){
            children.push({viewText: item});
        });
        viewElement.children = children;
        viewElement.dataType = element.dataType;
        viewElement.parentArchetypeId = archetype.archetypeId;
    }

    function addAttributesWithElement(viewElement, element) {
        var children = [];
        angular.forEach(ATTRIBUTES[element.dataType], function(item){
            children.push({viewText: item});
        });
        viewElement.children = children;
        viewElement.dataType = element.dataType;
    }

    function getOptionsForNullValue (expression) {
        var modalOptions = {resolve: {}, component: "modalWithInputAndDropdownComponent"}, modalItems = [];
        var expressionItem = expression.variable ? expression.assignment.expressionItem : expression.expressionItem.right.expressionItem;
        modalOptions.resolve.items = function() {
            for(var i in NULLVALUE) {
                modalItems.push({viewText: NULLVALUE[i].viewText, value: NULLVALUE[i].value, type: "NullValue"});
            }
            return modalItems;
        };
        modalOptions.resolve.default = function() {
            var defaultOption = {
                viewText: expressionItem.codedText ? expressionItem.codedText.value : {},
                value: expressionItem.codedText ? expressionItem.codedText.definingCode.codeString : {},
                type: "NullValue"
            };
            return defaultOption;
        };
        return modalOptions;
    }

    function isAction (expression) {
        return expression.hasOwnProperty('variable');
    }

    function getDataValueType(expression) {
        var code = isAction(expression) ? expression.variable.code : expression.expressionItem.left.expressionItem.code;
        var elementType = guidelineFactory.getElementType(code);
        if(elementType === DV.CODEDTEXT) {
            return 'CodedText';
        } else if(elementType === DV.ORDINAL) {
            return 'Ordinal';
        } else if(elementType === DV.TEXT) {
            return 'Text';
        } else if(elementType === DV.QUANTITY) {
            return 'Quantity';
        } else if(elementType === DV.DATETIME) {
            return 'Datetime';
        }
    }

    function getOptionsModal(expression) {
        //var actionType= actionFactory.getType(expression);
        var expressionType = isAction(expression) ? actionFactory.getType(expression) : conditionFactory.getType(expression);
        if(expressionType === 'Attribute') {
            var attribute = isAction(expression) ? expression.variable.attribute : expression.expressionItem.left.expressionItem.attribute;
            if(attribute === 'units') {
                return getOptionsForAttributeUnits(expression);
            } else if(attribute === 'precision') {
                return getOptionsForAttributePrecision(expression);
            }
        } else if(expressionType === "Element") {
            return getOptionsForTreeModal(expression);
        } else if(expressionType === "NullValue") {
            return getOptionsForNullValue(expression);
        } else if(expressionType === "DataValue") {
            // TODO: remaining tpes: QuantityConstant, StringConstant, DatetimeConstant, OrdinalConstant...
            var dataValueType = getDataValueType(expression);
            if(dataValueType === "CodedText") {
                return getOptionsForSetDataValueCodedText(expression);
            } else if(dataValueType === "Ordinal") {
                return getOptionsForSetDataValueOrdinal(expression);
            } else if(dataValueType === "Quantity") {
                return getOptionsForSetDataValueQuantity(expression);
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
    function getOptionsForSetDataValueQuantity(expression) {
        var modalOptions = {resolve: {}, component: "modalWithInputAndDropdownComponent"};
        var quantity, magnitude;

        if(isAction(expression)) {
            quantity = expression.assignment.expressionItem.quantity || {};
            magnitude = quantity.magnitude;
        } else {
            quantity = expression.expressionItem.right.expressionItem.quantity || {};
            magnitude = quantity.magnitude;
        }

        modalOptions.resolve.input = function() {
            var input = {
                value: magnitude,
                type: DV.QUANTITY
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
    function getOptionsForAttributePrecision(expression) {
        var modalOptions = {resolve: {}, component: "modalWithInputAndDropdownComponent"};
        var precision = isAction(expression) ? expression.assignment.expressionItem.value : expression.expressionItem.right.expressionItem.value;
        modalOptions.resolve.input = function() {
            return { type: "AttributeValue", value: precision };
        };
        return modalOptions;
    }

    /**
     * In "Actions": get the options for the right part of expression
     * when the expression is a "Set(element)"
     *
     *   1. Get the left side attribute
     *   2. Get all the options for that attribute to show in the modal
     *
     * @param expression
     * @returns modalOptions Object with the modal options
     */
    function getOptionsForAttributeUnits(expression) {
        var modalOptions = {resolve: {}, component: "modalWithInputAndDropdownComponent"}, modalItems = [];
        var attribute = isAction(expression) ? expression.variable.attribute : expression.expressionItem.left.expressionItem.attribute;
        // FIXME: Get the actual values. At this moment the API does not provide 'units'
        var temporalMockOptions = ['kg/m2', 'in', 'cm'];
        modalOptions.resolve.items = function() {
            for(var i in temporalMockOptions) {
                modalItems.push({viewText: temporalMockOptions[i], type: "AttributeValue"});
            }
            return modalItems;
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
            for(var attribute in attributes) {
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
                attributes[attribute].type = DV.CODEDTEXT;
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
        var archetypeId = element.parentArchetypeId || element.parent.viewText;
        guidelineFactory.addElementToDefinitions(element, archetypeId);
    }

    /**
     * Fill the "Compare Attribute" left part of a condition
     * @param left Left part of the condition
     * @param data Input from the user
     */
    function setLeftAttribute (left, data) {

        expression = isAction(left) ? left.variable : left.expressionItem;

        /*
         * If the selected item has an id, then it is an element present in archetype definitions, so
         * we only have to change its gtCode.
         *
         * If the element does not exist in archetype definitions, we first have to add it, and
         * then we have to create the corresponding entry in the ontology section
         */
        if (data.parent.id) {
            expression.code = data.parent.id;
            expression.attribute = data.viewText;
        } else {
            data.id = utilsFactory.generateGt(guidelineFactory.getCurrentGuide());
            expression.code = data.id;
            expression.attribute = data.viewText;
            data.parent.id= utilsFactory.generateGt(guidelineFactory.getCurrentGuide());
            addToElements(data.parent);
            var path = data.parent.path;
            var atCode = path.substring(path.lastIndexOf("[") + 1, path.lastIndexOf("]"));
            guidelineFactory.getOntology().termDefinitions.en.terms[data.id] = {
                id: data.id,
                text: atCode !== "" ? guidelineFactory.getTerms()[data.parent.parentArchetypeId][atCode].text : "",
                description: atCode !== "" ? guidelineFactory.getTerms()[data.parent.parentArchetypeId][atCode].description : ""
            };
        }
    }

    /**
     * Fill the remaining expression part of a condition
     * @param expression Left part of the condition
     * @param data Input from the user
     */
    function setLeftRemaining (expression, data, actionType) {
        var dataType = data.dataType;
        var leftExpressionItem = isAction(expression) ? expression.variable : expression.expressionItem.left.expressionItem;

        if(isAction(expression) && actionType === 'DataValue') {
            if(dataType === DV.QUANTITY) {
                expression.assignment.type = 'QuantityConstant'
            } else if(dataType === DV.TEXT) {
                expression.assignment.type = 'StringConstant'
            } else if(dataType === DV.CODEDTEXT) {
                expression.assignment.type = 'CodedTextConstant'
            } else if(dataType === DV.DATETIME) {
                expression.assignment.type = 'DateTimeConstant'
            } else if(dataType === DV.ORDINAL) {
                expression.assignment.type = 'OrdinalConstant'
            } else if(dataType === DV.COUNT) {
                expression.assignment.type = 'ConstantExpression'
            }

        }

        /*
         * If the selected item has an id, then it is an element present in archetype definitions, so
         * we only have to change its gtCode.
         *
         * If the element does not exist in archetype definitions, we first have to add it, and
         * then we have to create the corresponding entry in the ontology section
         */
        if (data.id) {
            leftExpressionItem.code = data.id;
            /**
             * If it is a Compare Null Value condition we should change the name property
             */
            if (actionType === "NullValue") {
                leftExpressionItem.name = data.viewText;
            }
        } else {
            data.id = utilsFactory.generateGt(guidelineFactory.getCurrentGuide());
            leftExpressionItem.code = data.id;
            /*
             * If it is a Compare Null Value condition we should change the name property
             */
            if (actionType === "NullValue") {
                leftExpressionItem.name = data.viewText;
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
            expressionItemFactory.setOrdinalConstant(right, response);
        } else if(right.type === 'QuantityConstant') {
            expressionItemFactory.setQuantityConstant(right, response);
        } else if(right.type === 'CodedTextConstant') {
            expressionItemFactory.setCodedTextConstant(right, response);
        } else if(right.type === 'StringConstant') {
            expressionItemFactory.setStringConstant(right, response);
        } else if(right.type === 'DateTimeConstant') {
            expressionItemFactory.setDateTimeConstant(right, response);
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

    function setAttribute(left, right, response) {
        var attribute = left.attribute;
        if(attribute === 'units') {
            //FIXME: What's the difference between them?
            var string = response.data.selectedItem.viewText;
            var value = response.data.selectedItem.viewText;
            right.expressionItem = {
                string: string,
                value: value
            };
        } if(attribute === 'precision') {
            var precision = response.data.input.value;
            right.type = 'ConstantExpression';
            right.expressionItem = {
                value: precision
            };
        }
    }

}
