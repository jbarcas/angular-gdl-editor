/**
 * Created by jbarros on 11/04/17.
 */

angular.module('app.services')
    .factory('ruleFactory', ruleFactory);

function ruleFactory(guidelineFactory, utilsFactory, ATTRIBUTES, NULLVALUE) {

    return {
        getConditionType: getConditionType,
        getDataForModal: getDataForModal,
        getOptionsForLeftModal: getOptionsForLeftModal,
        getOptionsForRightModal: getOptionsForRightModal,
        addToElements: addToElements,
        // ---------------------------------
        setLeftCompareAttribute: setLeftCompareAttribute,
        setLeftRemaining: setLeftRemaining,
        // ---------------------------------
        setCompareAttributeUnits: setCompareAttributeUnits,
        setCompareNullValue: setCompareNullValue,
        setCompareDataValue: setCompareDataValue,
        setCompareElement: setCompareElement,
        // ---------------------------------
        createCompareDataValue: createCompareDataValue,
        createCompareNullValue: createCompareNullValue,
        createCompareElement: createCompareElement,
        createCompareAttribute: createCompareAttribute,
        createElementExists: createElementExists,
        createOr: createOr
    };

    function getConditionType(condition) {
        /**
         * When dragged/dropped from rigt panel
         */
        if (condition.category) {
            return condition.category;
        }
        var type;
        if (condition.expressionItem.operator === "OR") {
            type = "Or";
        } else if (condition.expressionItem.right.expressionItem.value === "null") {
            type = "ElementExists";
        } else if (condition.expressionItem.left.expressionItem.attribute === "null_flavor") {
            type = "CompareNullValue";
        } else if (condition.expressionItem.left.expressionItem.hasOwnProperty("attribute")) {
            type = "CompareAttribute";
        //} else if (condition.expressionItem.right.expressionItem.code) {
        } else if (condition.expressionItem.right.expressionItem.hasOwnProperty("code")) {
            type = "CompareElement";
        } else {
            type = "CompareDataValue";
        }
        return type;
    }

    function getDataForModal(condition) {
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
        } else if (conditionType === 'CompareAttribute') {
            modalData.headerText = condition.expressionItem.left.expressionItem.attribute;
        }
        return modalData;
    }

    /**
     * Gets the options for the left side modal
     * @param condition
     * @returns {{}}
     */
    function getOptionsForLeftModal(condition) {
        var conditionType = getConditionType(condition);
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
                if (conditionType === "CompareAttribute") {
                    var archetypeElement = guidelineFactory.getElementByGtCode(element.id);
                    viewElement.children = ATTRIBUTES[archetypeElement.dataType];
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

    /**
     * Gets the options for the right side modal
     * @param condition
     * @returns {{}}
     */
    function getOptionsForRightModal(condition) {
        var conditionType = getConditionType(condition);
        var modalOptions = {};
        modalOptions.resolve = {};
        var modalItems = [];

        if(conditionType === 'CompareElement') {
            return getOptionsForLeftModal(condition);
        } else if (conditionType === 'CompareNullValue') {
            modalOptions.component = "modalWithInputAndDropdownComponent";
            modalOptions.resolve.items = function() {
                for(var i in NULLVALUE) {
                    modalItems.push({viewText: NULLVALUE[i].viewText, value: NULLVALUE[i].value});
                }
                return modalItems;
            };
            modalOptions.resolve.default = function() {
                var defaultOption = {
                    viewText: condition.expressionItem.right.expressionItem.codedText ? condition.expressionItem.right.expressionItem.codedText.value : {},
                    value: condition.expressionItem.right.expressionItem.codedText ? condition.expressionItem.right.expressionItem.codedText.definingCode.codeString : {}
                };
                return defaultOption;
            };
        } else if (conditionType === 'CompareDataValue') {
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
        } else if (conditionType === 'CompareAttribute') {
            modalOptions.component = "modalWithInputAndDropdownComponent";
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
                var def = condition.expressionItem.right.expressionItem.value;
                var defaultOption = {
                    viewText: def
                };
                return defaultOption;
            };
        }
        return modalOptions;
    }


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
     * Fills the "Compare Attribute" condition with the new values from the user input
     * @param right the right part of the condition
     * @param data information from the user input
     */
    function setCompareAttributeUnits (right, data) {
        //FIXME: What's the differnence between them?
        var string = data.viewText;
        var value = data.viewText;

        right.expressionItem = {
            string: string,
            value: value
        };
    }


    /**
     * Fills the "Compare Null" condition with the new values from the user input
     * @param right the right part of the condition
     * @param data information from the user input
     */
    function setCompareNullValue(right, data) {
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

        var magnitude = response.data.input.value;
        var units = response.data.selectedItem.viewText;

        right.expressionItem = {
            quantity: {
                magnitude: magnitude,
                precision: 0,
                units: units,
                accuracy: 0.0,
                accuracyPercent: false
            },
            value: magnitude + "," + units
        };
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
}
