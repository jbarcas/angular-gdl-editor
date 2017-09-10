/**
 * Created by jbarros on 1/05/17.
 */


angular.module('app.services')
    .factory('expressionItemFactory', expressionItemFactory);

function expressionItemFactory($log, guidelineFactory, utilsFactory, modalService, CONDITION_OPERATORS, ATTRIBUTES, DV, NULLVALUE, OPERATORS) {

    var conditions;
    conditions = [
        {title: 'Compare (DataValue)', category: 'CompareDataValue', draggable: true},
        {title: 'Compare (NullValue)', category: 'CompareNullValue', draggable: true},
        {title: 'Compare (Element)', category: 'CompareElement', draggable: true},
        {title: 'Compare (Attribute)', category: 'CompareAttribute', draggable: true},
        {title: 'Element exists', category: 'ElementExists', draggable: true},
        {title: 'Or operator', category: 'Or', draggable: true}
    ];

    var actions;
    actions = [
        {title: 'Create (Entry)',   category: 'CreateEntry',  draggable: true},
        {title: 'Set (DataValue)',  category: 'SetDataValue', draggable: true},
        {title: 'Set (NullValue)',  category: 'SetNullValue', draggable: true},
        {title: 'Set (Element)',    category: 'SetElement',   draggable: true},
        {title: 'Set (Attribute)',  category: 'SetAttribute', draggable: true}
    ];

    return {
        getDataModal: getDataModal,
        getOptionsModal: getOptionsModal,
        setCodedTextConstant: setCodedTextConstant,
        setStringConstant: setStringConstant,
        setQuantityConstant: setQuantityConstant,
        setDateTimeConstant: setDateTimeConstant,
        setOrdinalConstant: setOrdinalConstant,
        setConstantExpression: setConstantExpression,
        getConditionOptions: getConditionOptions,
        updateConditionLeft: updateConditionLeft,
        updateConditionRight: updateConditionRight,
        getOptionsForTreeModal:getOptionsForTreeModal,
        isAction: isAction,
        showRightName: showRightName,
        setNullValue: setNullValue,
        setCompareElement: setCompareElement,
        setAttribute: setAttribute,
        setCompareDataValue: setCompareDataValue,
        openExpressionEditor: openExpressionEditor,
        getActionType: getActionType,
        getConditionType: getConditionType,
        setLeftRemaining: setLeftRemaining,
        getConditions: getConditions,
        getActions: getActions,
        getExpression: getExpression,
        getLiteralExpression: getLiteralExpression,
        setLeftAttribute: setLeftAttribute
    };


    /**
     * Used to clone the condition nodes
     */
    function getConditions() {
        return conditions;
    }

    /**
     * Used to clone the action nodes
     */
    function getActions() {
        return actions;
    }

    /**
     * Fills the codedTextConstant with the new values from the user input
     * @param codedTextConstant
     * @param dataFromTree
     */
    function setCodedTextConstant (codedTextConstant, dataFromTree) {
        var value = dataFromTree.data.selectedItem.text;
        var codeString = dataFromTree.data.selectedItem.code || dataFromTree.data.selectedItem.id;
        // TODO: terminologies?

        codedTextConstant.type = "CodedTextConstant";
        codedTextConstant.expressionItem = {
            codedText: {
                definingCode: {
                    terminologyId: {
                        name: "local",
                        value: "local"
                    },
                    codeString: codeString
                },
                value: value
            }
        };
        codedTextConstant.expressionItem.value = codedTextConstant.expressionItem.codedText.definingCode.terminologyId.value + "::" + codeString + "|" + value + "|"

    }

    /**
     * Fills the stringConstant with the new values from the user input
     * @param stringConstant
     * @param dataFromInput
     */
    function setStringConstant (stringConstant, dataFromInput) {
        // TODO: properties string y value differences?
        var value = dataFromInput.data.input.value;
        stringConstant.type = "StringConstant";
        stringConstant.expressionItem = {
            string: value,
            value: value
        }
    }


    /**
     * Fills the quantityConstant with the new values from the user input
     * @param quantityConstant
     * @param dataFromModal
     */
    function setQuantityConstant (quantityConstant, dataFromModal) {
        // TODO: what to do with remaining properties (i.e. precision, accuracy and accuracyPercent)
        var magnitude = dataFromModal.data.input.value;
        var units = dataFromModal.data.selectedItem.viewText;

        quantityConstant.type = "QuantityConstant";
        quantityConstant.expressionItem = {
            quantity: {
                magnitude: magnitude,
                precision: 0,
                units: units,
                accuracy: 0,
                accuracyPercent: false
            },
            value: magnitude + "," + units
        };
    }

    /**
     * Fills the dateTimeConstant with the new values from the user input
     * @param dateTimeConstant
     * @param dataFromPicker
     */
    function setDateTimeConstant(dateTimeConstant, dataFromPicker) {
        dateTimeConstant.type = "DateTimeConstant";
        dateTimeConstant.expressionItem = {
            value: dataFromPicker.data.date
        }
    }

    /**
     * Fills the ordinalConstant  with the new values from the user input
     * @param ordinalConstant
     * @param dataFromDropdown
     */
    function setOrdinalConstant(ordinalConstant, dataFromDropdown) {
        var value = parseInt(dataFromDropdown.data.selectedItem.value);
        var code = dataFromDropdown.data.selectedItem.code;
        var text = dataFromDropdown.data.selectedItem.text;

        ordinalConstant.type = "OrdinalConstant";
        ordinalConstant.expressionItem = {
            ordinal: {
                value: value,
                symbol: {
                    definingCode: {
                        terminologyId: {
                            name: "local",
                            value: "local"
                        },
                        codeString: code
                    },
                    value: text
                },
                limitsIndex: -1
            }
        };
        ordinalConstant.expressionItem.value = value + "|" + ordinalConstant.expressionItem.ordinal.symbol.definingCode.terminologyId.value + "::" + code + "|" + text + "|"
    }

    /**
     * Fills the constantExpression with the new values from the user input
     * @param constantExpression
     * @param dataFromInput
     */
    function setConstantExpression(constantExpression, dataFromInput) {
        var value = dataFromInput.data.input.value;
        constantExpression.type = "ConstantExpression";
        constantExpression.expressionItem = {
            value: value
        }
    }

    function getConditionOptions(node) {
        var conditionType = getConditionType(node);
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

    function updateConditionLeft(node) {
        var condition = node.$modelValue;
        var type = getConditionType(condition);

        var modalData = {headerText: 'Select element instance'};
        var modalOptions = getOptionsForTreeModal(condition);

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
            type === "Attribute" ? setLeftAttribute(left, selected) : setLeftRemaining(condition, selected, type);
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.controller.updateLeftItem()');
        }
    }


    function updateConditionRight(node) {
        var condition = node.$modelValue;
        var type = getConditionType(condition);
        /*
         * If the condition has a 'magnitude' left side attribute, the expression editor is opened
         */
        if (type === "Attribute" && condition.expressionItem.left.expressionItem.attribute === 'magnitude') {
            openExpressionEditor(condition);
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

        var data = getDataModal(condition);
        var options = getOptionsModal(condition);

        modalService.showModal(options, data).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }

            var selected = modalResponse.data.selectedItem;

            var left = condition.expressionItem.left;
            var right = condition.expressionItem.right;
            /*
             * Delete the unselected property used to highlight the text in the view
             */
            delete right.unselected;

            if (type === "Attribute") {
                setAttribute(left.expressionItem, right, modalResponse);
            } else if (type === "NullValue") {
                setNullValue(right, selected);
                // TODO: Does the 'attribute' property have always the same value (null_flavour) ??
            } else if (type === "DataValue") {
                setCompareDataValue(right, modalResponse);
            } else if (type === "Element") {
                setCompareElement (right, selected);
            }

        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.controller.updateLeftItem()');
        }

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
        var rightExpressionItem = isAction(expression) ? expression.assignment : expression.expressionItem.right;

        if(actionType === 'DataValue') {
            setDataValueRightType(dataType, rightExpressionItem);
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
                text: atCode !== "" ? guidelineFactory.getTerms()[data.parent.viewText][atCode].text : "Event time",
                description: atCode !== "" ? guidelineFactory.getTerms()[data.parent.viewText][atCode].description : "Event time"
            };
        }
    }

    /**
     * Gets the options for the left side modal
     * @param expression May be a condition or an action
     * @returns {{}}
     */
    function getOptionsForTreeModal(expression) {
        var expressionType = isAction(expression) ? getActionType(expression) :  getConditionType(expression);
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

                //if (expressionType === "Attribute" || expressionType === "Element") {
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

        modalOptions.resolve.modelExpression = function () {
            return expression;
        };

        modalOptions.resolve.literalExpression = function () {
            return expression.literalExpression;
        };

        //if(expressionType === "Attribute" && expression.expressionItem.left.expressionItem.attribute === "magnitude") {
        if(expressionType === "Attribute") {
            if(expression && expression.expressionItem && expression.expressionItem.left && (expression.expressionItem.left.type === 'BinaryExpression' || expression.expressionItem.left.expressionItem.attribute === "magnitude")) {
                modalOptions.resolve.expression = function() {
                    if(isAction(expression)) {
                        return getExpression(expression);
                    } else {
                        return getExpression(expression.expressionItem.right);
                    }
                }
            }
            if(expression && expression.variable && expression.variable.attribute === "magnitude") {
                modalOptions.resolve.expression = function() {
                    return getExpression(expression.assignment);
                }
            }
        }
        return modalOptions;
    }

    function isAction (expression) {
        return expression.hasOwnProperty('variable') || expression.hasOwnProperty('expression');
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

    /**
     * On the flight, gets the name of the right part of a condition
     * @param node
     * @returns {*}
     */
    function showRightName(node) {
        var condition = node.$modelValue;
        var conditionType = getConditionType(condition);
        var value;

        /*
         * If the node is an element, a predicate function or a predicate exists, then it has no right part.
         */
        if (conditionType === "ElementExists") {
            return;
        } else if (conditionType === "Attribute") {
            if (condition.expressionItem.right.type === 'BinaryExpression') {
                value = getLiteralExpression(condition.expressionItem.right);
            } else {
                value = condition.expressionItem.right.expressionItem.value;
            }
        } else if (conditionType === "Attribute") {
            value = condition.expressionItem.right.expressionItem.value;
        } else if (conditionType === "Element") {
            value = condition.expressionItem.right.expressionItem.code ? vm.terms[condition.expressionItem.right.expressionItem.code].text : "";
        } else if (conditionType === "NullValue" || conditionType === "DataValue") {
            value = condition.expressionItem.right.expressionItem.value
        }
        return value;
    }

    /**
     * Fill the modal with the corresponding data: header text, body text, placeholders, etc.
     * @param expression
     * @returns {{}}
     */
    function getDataModal(expression) {
        var expressionType = isAction(expression) ? getActionType(expression) : getConditionType(expression);
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
            modalData.bodyText = isAction(expression) ? "" : guidelineFactory.getText(expression.expressionItem.left.expressionItem.code);
            if(attribute === 'precision') {
                modalData.placeholder = 'Enter precision';
                modalData.bodyText = 'Enter the precision';
            }
        }
        return modalData;
    }


    function getOptionsModal(expression) {
        var expressionType = isAction(expression) ? getActionType(expression) : getConditionType(expression);
        if(expressionType === 'Attribute') {
            var attribute = isAction(expression) ? expression.variable.attribute : expression.expressionItem.left.expressionItem.attribute;
            if(attribute === 'units') {
                return getOptionsForAttributeUnits(expression);
            } else if(attribute === 'precision') {
                return getOptionsForAttributePrecision(expression);
            } else if(attribute === 'value') {
                return getOptionsForAttributeValue(expression);
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
            } else if(dataValueType === "Text") {
                return getOptionsForSetDataValueText(expression);
            } else if(dataValueType === "Datetime") {
                return getOptionsForSetDataValueDatetime(expression);
            } else if(dataValueType === "Count") {
                return getOptionsForSetDataValueCount(expression);
            }
        }
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
        } else if(elementType === DV.COUNT) {
            return 'Count';
        }
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
        var temporalMockOptions = ['kg/m2', 'kg', 'cm'];
        modalOptions.resolve.items = function() {
            for(var i in temporalMockOptions) {
                modalItems.push({viewText: temporalMockOptions[i], type: "AttributeValue"});
            }
            return modalItems;
        };
        return modalOptions;
    }

    /**
     * Get the options for the right part of expression
     * when the expression is a "Set(attribute)" => Precision
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
     * Get the options for the right part of expression
     * when the expression is a "Set(attribute)" => Value
     *
     *   1. Get the left side element
     *   2. Retrieve all the coded text options for that element
     *
     * @param expression
     * @returns modalOptions Object with the modal options
     */
    function getOptionsForAttributeValue(expression) {
        var modalOptions = {resolve: {}, component: "modalWithInputAndDropdownComponent"};
        var value = isAction(expression) ? expression.assignment.expressionItem.value : expression.expressionItem.right.expressionItem.value;
        modalOptions.resolve.input = function() {
            return { type: "AttributeValue", value: value };
        };
        return modalOptions;
    }

    /**
     * Get the options for the right part of expression
     * when the expression is a "Set(datavalue)" => CodedText
     *
     *   1. Get the left side element
     *   2. Retrieve all the coded text options for that element
     *
     * @param expression
     * @returns modalOptions Object with the modal options
     */
    function getOptionsForSetDataValueCodedText(expression) {
        var modalOptions = {resolve: {}, component: "modalWithInputAndDropdownComponent"}, modalItems = [];
        var left = isAction(expression) ? expression.variable : expression.expressionItem.left.expressionItem;
        var right = isAction(expression) ? expression.assignment : expression.expressionItem.right;

        var code = left.code;

        var element = guidelineFactory.getElementByGtCode(code);

        var defaultOption = {};

        modalOptions.resolve.items = function() {
            var attributes = element.attributeMaps;
            for(var attribute in attributes) {
                if(right.expressionItem.codedText &&
                    right.expressionItem.codedText.definingCode &&
                    attributes[attribute].code == right.expressionItem.codedText.definingCode.codeString) {
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
     * Get the options for the right part of expression
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
     * Get the options for the right part of expression
     * when the expression is a "Set(datavalue)" => Quantity
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
     * Get the options for the right part of expression
     * when the expression is a "Set(datavalue)" => Text
     *
     *   1. Get the left side element
     *   2. Retrieve all the coded text options for that element
     *
     * @param expression
     * @returns modalOptions Object with the modal options
     */
    function getOptionsForSetDataValueText(expression) {
        var modalOptions = {resolve: {input: {type: DV.TEXT}}, component: "modalWithInputAndDropdownComponent"};
        var right = isAction(expression) ? expression.assignment : expression.expressionItem.right;
        // TODO: What are string and value for? What is the difference between them?
        if(right.expressionItem.string) {
            modalOptions.resolve.input.string = right.expressionItem.string;
            modalOptions.resolve.input.value = right.expressionItem.value;
        } else {
            modalOptions.resolve.input.string = "";
            modalOptions.resolve.input.value = "";
        }
        return modalOptions;
    }

    /**
     * Get the options for the right part of expression
     * when the expression is a "Set(datavalue)" => Datetime
     *
     *   1. Get the left side element
     *   2. Retrieve all the coded text options for that element
     *
     * @param expression
     * @returns modalOptions Object with the modal options
     */
    function getOptionsForSetDataValueDatetime(expression) {
        var modalOptions = {resolve: {}, component: "modalWithDatepickerComponent"};
        var left = isAction(expression) ? expression.variable : expression.expressionItem.left.expressionItem;
        var right = isAction(expression) ? expression.assignment : expression.expressionItem.right;

        var dateTime;
        if(Date.parse(right.expressionItem.value)) {
            dateTime = right.expressionItem.value;
        } else {
            dateTime = new Date().toISOString().split(".")[0];
        }

        modalOptions.resolve.date = function() {
            var date = {
                type: DV.DATETIME,
                value: dateTime
            }
            return date;
        };
        return modalOptions;
    }


    /**
     * Get the options for the right part of expression
     * when the expression is a "Set(datavalue)" => Datetime
     *
     *   1. Get the left side element
     *   2. Retrieve all the coded text options for that element
     *
     * @param expression
     * @returns modalOptions Object with the modal options
     */
    function getOptionsForSetDataValueCount(expression) {
        var modalOptions = {resolve: {}, component: "modalWithInputAndDropdownComponent"};
        var right = isAction(expression) ? expression.assignment : expression.expressionItem.right;
        var value = right.expressionItem.value;

        modalOptions.resolve.input = function() {
            var input = {
                value: value,
                type: DV.COUNT
            };
            return input;
        };
        return modalOptions;
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
            setOrdinalConstant(right, response);
        } else if(right.type === 'QuantityConstant') {
            setQuantityConstant(right, response);
        } else if(right.type === 'CodedTextConstant') {
            setCodedTextConstant(right, response);
        } else if(right.type === 'StringConstant') {
            setStringConstant(right, response);
        } else if(right.type === 'DateTimeConstant') {
            setDateTimeConstant(right, response);
        } else if(right.type === 'ConstantExpression') {
            setConstantExpression(right, response);
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
            right.type = 'StringConstant';
            right.expressionItem = {
                string: string,
                value: value
            };
        } else if(attribute === 'precision') {
            var precision = response.data.input.value;
            right.type = 'ConstantExpression';
            right.expressionItem = {
                value: precision
            };
        } else if(attribute === 'value') {
            var value = response.data.input.value;
            right.type = 'ConstantExpression';
            right.expressionItem = {
                value: value
            };
        }
    }

    /**
     * Adds an element into the Archetype Binding definitions
     * @param element
     */
    function addToElements(element) {
        var archetypeId = element.parentArchetypeId || element.parent.viewText;
        guidelineFactory.addElementToDefinitions(element, archetypeId);
    }


    function setDataValueRightType(dataType, expression) {
        if (dataType === DV.QUANTITY) {
            expression.type = 'QuantityConstant'
        } else if (dataType === DV.TEXT) {
            expression.type = 'StringConstant'
        } else if (dataType === DV.CODEDTEXT) {
            expression.type = 'CodedTextConstant'
        } else if (dataType === DV.DATETIME) {
            expression.type = 'DateTimeConstant'
        } else if (dataType === DV.ORDINAL) {
            expression.type = 'OrdinalConstant'
        } else if (dataType === DV.COUNT) {
            expression.type = 'ConstantExpression'
        }
    }

    /**
     * Open the expression editor
     * @param expression
     */
    function openExpressionEditor(expression) {
        var modalData = {headerText: 'Expression editor'};
        var modalOptions = getOptionsForTreeModal(expression);
        modalOptions.component = 'expressionEditorComponent';
        modalOptions.size = 'lg';

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete(response) {
            if(response.data === undefined) {
                return;
            }
            if(isAction(expression)) {
                expression.assignment.type = response.data.type;
                expression.assignment.expressionItem = response.data.expressionItem;
                delete expression.assignment.unselected;
                //expression.expressionItem = response.data.expressionItem;

            } else {
                expression.expressionItem.right = response.data;
            }
            $log.info('Modal completed at: ' + new Date() + ' in openExpressionEditor()');
            return;
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in openExpressionEditor()');
        }
    }

    function getActionType(action) {
        var type;
        if (action && action.variable && action.variable.attribute === "null_flavor") {
            type = "NullValue";
        } else if (action && action.variable && action.variable.attribute) {
            type = "Attribute";
        } else if (action.assignment.type === "Variable") {
            type = "Element";
        } else {
            type = "DataValue";
        }
        return type;
    }

    /**
     * This methos is used to check if an expression has an attribute
     * @param expression
     * @returns {boolean}
     */
    function hasAttribute(expression) {
        for (var key in ATTRIBUTES) {
            if(ATTRIBUTES.hasOwnProperty(key)) {
                if(expression.type === 'BinaryExpression' || ATTRIBUTES[key].indexOf(expression.variable.attribute) > -1) {
                    return true;
                }
            }
        }
        return false;
    }

    function getConditionType(condition) {
        var type;
        if (condition.expressionItem.operator === "OR") {
            type = "Or";
        } else if (condition.expressionItem.right.expressionItem.value === "null") {
            type = "Exists";
        } else if (condition.expressionItem.left.expressionItem.attribute === "null_flavor") {
            type = "NullValue";
        } else if (condition.expressionItem.left.expressionItem.hasOwnProperty("attribute")) {
            type = "Attribute";
        } else if (condition.expressionItem.right.expressionItem.hasOwnProperty("code")) {
            type = "Element";
        } else {
            type = "DataValue";
        }
        return type;
    }


    /**
     * Gets the expression from an object (as showed in TOP part of the expression editor panel)
     * @param expression
     * @returns {str}
     */
    function getExpression(expression) {
        function createExpression(expression) {
            if(expression.type === "ConstantExpression") {
                str += expression.expressionItem.value;
            } else if (expression.type === "Variable") {
                str += expression.expressionItem.code + "." + expression.expressionItem.attribute;
            } else {
                str += '(';
                createExpression(expression.expressionItem.left);
                str += " " + OPERATORS[expression.expressionItem.operator] + " ";
                createExpression(expression.expressionItem.right);
                str += ')';
            }
            return str;
        }
        var str = "";
        if(angular.equals({}, expression.expressionItem.left) && angular.equals({}, expression.expressionItem.right)) {
            return "Set expression";
        }
        if(expression.unselected) {
            return str;
        }
        createExpression(expression);
        return str;
    }

    /**
     * Gets the expression from an object (as showed in BOTTOM part of the expression editor panel)
     * @param expression
     * @returns {str}
     */
    function getLiteralExpression(expression) {

        function createLiteralExpression(expression) {
            if(expression.type === "ConstantExpression") {
                str += expression.expressionItem.value;
            } else if (expression.type === "Variable") {
                str += guidelineFactory.getText(expression.expressionItem.code);
            } else {
                str += '(';
                createLiteralExpression(expression.expressionItem.left);
                str += " " + OPERATORS[expression.expressionItem.operator] + " ";
                createLiteralExpression(expression.expressionItem.right);
                str += ')';
            }
            //return str;
        }
        var str = "";
        createLiteralExpression(expression);
        return str;
    }

}