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
        setCompareAttributeUnits: setCompareAttributeUnits,
        setCompareNullValue: setCompareNullValue,
        setCompareDataValue: setCompareDataValue,
        setCompareElement: setCompareElement
    }

    function getConditionType(condition) {
        var type;
        if (condition.expressionItem.operator === "OR") {
            type = "Or";
        } else if (condition.expressionItem.right.expressionItem.value === "null") {
            type = "ElementExists";
        } else if (condition.expressionItem.left.expressionItem.name) {
            type = "CompareNullValue";
        } else if (condition.expressionItem.left.expressionItem.attribute) {
            type = "CompareAttribute";
        } else if (condition.expressionItem.right.expressionItem.code) {
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
     * @param archetypes
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
            /**
             * Add the already instantiated elements
             */
            angular.forEach(elements, function (element) {
                var viewElement = angular.copy(element);
                viewElement.viewText = termDefinitions[element.id].text;
                /**
                 * If it is a compare attribute, we should add its attributes
                 */
                if (conditionType === "CompareAttribute") {
                    var archetypeElement = guidelineFactory.getElementByGtCode(element.id);
                    viewElement.children = ATTRIBUTES[archetypeElement.dataType];
                    viewElement.dataType = archetypeElement.dataType;
                }
                modalItems.push(viewElement);
            });
            /**
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
                    viewText: condition.expressionItem.right.expressionItem.codedText.value,
                    value: condition.expressionItem.right.expressionItem.codedText.definingCode.codeString
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
                }
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
                }
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
                }
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
        console.log(element);
    }


    function setCompareAttributeUnits (right, data) {
        right.expressionItem.string = data.viewText;
        right.expressionItem.value = data.viewText;
    }

    function setCompareNullValue (right, data) {
        right.expressionItem.codedText.definingCode.codeString = data.value;
        right.expressionItem.codedText.value = data.viewText;
        right.expressionItem.value =
            right.expressionItem.codedText.definingCode.terminologyId.value + '::' +
            right.expressionItem.codedText.definingCode.codeString + '|' +
            right.expressionItem.codedText.value + '|';
    }

    function setCompareDataValue (right, response) {
        right.expressionItem.quantity.magnitude = response.data.input.value;
        right.expressionItem.quantity.units = response.data.selectedItem.viewText;
        right.expressionItem.value =
            right.expressionItem.quantity.magnitude + ',' +
            right.expressionItem.quantity.units;
    }

    function setCompareElement(right, selected) {
        /**
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
