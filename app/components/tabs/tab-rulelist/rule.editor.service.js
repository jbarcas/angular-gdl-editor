/**
 * Created by jbarros on 11/04/17.
 */

angular.module('app.services')
    .factory('ruleFactory', ruleFactory);

function ruleFactory(guidelineFactory, utilsFactory, ATTRIBUTES) {

    return {
        getConditionType: getConditionType,
        getOptionsForModal: getOptionsForModal,
        addToElements: addToElements
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
    };

    /**
     * Gets the options for the modal
     * @param archetypes
     * @param condition
     * @returns {{}}
     */
    function getOptionsForModal(archetypes, condition) {
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
            angular.forEach(archetypes, function (archetype) {
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
     * Adds an element into the Archetype Binding definitions
     * @param element
     */
    function addToElements(element) {
        var archetypeId = element.parent.viewText;
        guidelineFactory.addElementToDefinitions(element, archetypeId);
        console.log(element);
    }

}
