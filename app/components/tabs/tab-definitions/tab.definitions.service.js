/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.services')
    .factory('definitionsFactory', definitionsFactory);

function definitionsFactory(DV, expressionItemFactory, guidelineFactory, utilsFactory) {

    return {
        createElementInstantiation: createElementInstantiation,
        createPredicateDatavalue: createPredicateDatavalue,
        createPredicateFunction: createPredicateFunction,
        createPredicateExists: createPredicateExists,
        createPredicateExpression: createPredicateExpression,
        createArchetypeInstantiation: createArchetypeInstantiation,
        isDroppable: isDroppable,
        existsInRules: existsInRules,
        existsInPreconditions: existsInPreconditions,
        convertModel: convertModel,
        getPredicateStatementType: getPredicateStatementType,
        getDataForModal: getDataForModal,
        getOptionsForModal: getOptionsForModal,
        getName: getName,
        isElement: isElement,
        isPredicate: isPredicate,
        sort: sort
    }

    function createArchetypeInstantiation(model) {

    }

    function createElementInstantiation (model) {
        model.id = utilsFactory.generateGt(vm.guide);
        model.path = "";
        vm.guide.ontology.termDefinitions.en.terms[model.id] = {
            id: model.id
        }
    }

    /**
     * Generates the left side operand depending on the type of the definition
     * @param model
     * @returns The model with the left operand added
     */
    function createLeftOperand(model) {
        model.unselected = true;
        var item = utilsFactory.isUnaryExpression(model) ? "operand" : "left";
        model.expressionItem = {};
        model.expressionItem[item] = {};
        model.expressionItem[item].type = "Variable";
        model.expressionItem[item].expressionItem = {};
        return model;
    }

    /**
     * Create a new definition: Predicate (DataValue)
     * @param model The model upon which a "data value definition" is created
     */
    function createPredicateDatavalue(model) {
        createLeftOperand(model);
        model.expressionItem.right = {};
        model.expressionItem.right.expressionItem = {};
        model.expressionItem.right.expressionItem.value = "Select DataValue";
        model.expressionItem.operator = "IS_A";
        return model;
    };

    /**
     * Create a new definition: Predicate (Function)
     * @param model The model upon which a "predicate function definition" is created
     */
    function createPredicateFunction(model) {
        createLeftOperand(model);
        model.expressionItem.operator = "MAX";
        return model;
    }

    /**
     * Create a new definition: Predicate (Exists)
     * @param model The model upon which a "predicate exists definition" is created
     */
    function createPredicateExists(model) {
        createLeftOperand(model);
        model.expressionItem.right = {};
        model.expressionItem.right.type = "ConstantExpression";
        model.expressionItem.right.expressionItem = {};
        model.expressionItem.right.expressionItem.value = "null";
        model.expressionItem.operator = "INEQUAL";
        return model;
    }

    /**
     * Create a new definition: Predicate (Expression)
     * @param model The model upon which a "predicate expression definition" is created
     */
    function createPredicateExpression(model) {
        model.expression = "Expression";
        createLeftOperand(model);
        model.expressionItem.right = {};
        model.expressionItem.right.type = "BinaryExpression";
        model.expressionItem.right.expressionItem = {};
        model.expressionItem.right.expressionItem.left = {};
        model.expressionItem.right.expressionItem.right = {};
        model.expressionItem.operator = "EQUALITY";
        return model;
    }


    /**
     * Determine whether a node is droppable or not
     * @param node
     */
    function isDroppable(sourceNodeScope, destNodeScope) {
        //console.log(sourceNodeScope.$modelValue);
        return (sourceNodeScope.depth() === 2 && destNodeScope.depth() === 1) ||
            (sourceNodeScope.$modelValue.type === "ArchetypeInstantiation" && destNodeScope.depth() === 0) ||
            (sourceNodeScope.$modelValue.title === "Element instantiation" && destNodeScope.depth() === 1)   ||
            (sourceNodeScope.$modelValue.type === "UnaryExpression" && destNodeScope.depth() === 1)   ||
            (sourceNodeScope.$modelValue.type === "BinaryExpression" && destNodeScope.depth() === 1)
    }

    /**
     * Checks if the element is being used in the rules
     * @param element The element to check
     * @returns {boolean}
     */
    function existsInRules(element) {
        var rules = guidelineFactory.getRulelist();
        if (Object.keys(rules).indexOf(element.id) !== -1) {
            return true;
        }
        for (var index in rules) {
            var rule = rules[index];
            for (var i = 0; i < rule.then.length; i++) {
                var item = rule.then[i];
                if (item.indexOf(element.id) > -1) {
                    return true;
                }
            }
            for (var i = 0; i < rule.when.length; i++) {
                var item = rule.when[i];
                if (item.indexOf(element.id) > -1) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * Checks if the element is being used in the preconditions
     * @param element The element to check
     * @returns {boolean}
     */
    function existsInPreconditions (element) {
        var result = false;
        angular.forEach(guidelineFactory.getPreConditions(), function (item) {
            if (item.indexOf(element.id) > -1) {
                result = true;
            }
        });
        return result;
    }

    /**
     * Converts the model to fit the angular UI tree component
     * @param archertypeBindings
     * @returns {Array|*}
     */
    function convertModel(archertypeBindings){
        // converts the elements
        angular.forEach(archertypeBindings, function (archetypeBinding) {
            if (archetypeBinding.elements) {
                archetypeBinding.elements = utilsFactory.objectToArray(archetypeBinding.elements);
            }
        });
        // converts the archetypeBindings
        archertypeBindings = utilsFactory.objectToArray(archertypeBindings);
        return archertypeBindings;
    }

    /**
     * Gets the predicate statement type
     * @param predicateStatement
     * @returns
     */
    function getPredicateStatementType(predicateStatement) {

        if(isElement(predicateStatement)) {
            return;
        }
        var type;
        if(utilsFactory.isUnaryExpression(predicateStatement)) {
            type = "PredicateFunction";
        } else if(predicateStatement.expressionItem.right.expressionItem.value === "null") {
            type = "PredicateExists";
//      } else if(predicateStatement.expressionItem.left.attribute) {  // FIXME: this should be the right way to check if it is a PredicateExpression
        } else if(utilsFactory.isBinaryExpression(predicateStatement.expressionItem.right)) {
            predicateStatement.expression = expressionItemFactory.getExpression(predicateStatement.expressionItem.right);
            type = "PredicateExpression";
        } else {
            type = "PredicateDatavalue";
        }
        return type;
    }

    /**
     * Checks whether an item is an element
     * @param item
     * @returns {boolean|*}
     */
    function isElement(item) {
        return item && item.hasOwnProperty("id") && item.hasOwnProperty("path");
    }

    /**
     * Gets the data for the modal
     * @param archetype
     * @param predicate
     * @returns {{}}
     */
    function getDataForModal(archetype, predicate) {
        var elementName = getName(archetype.archetypeId, predicate.expressionItem);
        var path = archetype.elementMaps[elementName].path;
        var atCode = path.substring(path.lastIndexOf("[") + 1, path.lastIndexOf("]"));
        var modalData = {};
        var bodyText;
        // TODO: bodyText in event time?
        if(guidelineFactory.getTerms()[archetype.archetypeId][atCode]) {
            bodyText = guidelineFactory.getTermDescription(archetype.archetypeId, atCode)
        }
        if(predicate.expressionItem.operator === "IS_A") {
            modalData.headerText = "Select a local term";
        } else {
            modalData.headerText = elementName;
            modalData.bodyText = bodyText;
        }
        return modalData;
    }

    /**
     * Gets the options for the modal
     * @param archetype
     * @param predicate
     * @returns {{}}
     */
    function getOptionsForModal(archetype, predicate) {
        var leftElementName = getName(archetype.archetypeId, predicate.expressionItem);
        var leftElementType = archetype.elementMaps[leftElementName].dataType;
        var rightElementType = predicate.expressionItem.right.type;
        var modalOptions = {};
        modalOptions.resolve = {};
        var modalItems = [];

        if(getPredicateStatementType(predicate) === "PredicateExpression") {
            modalOptions.component = "modalWithTextareaComponent";
            modalOptions.resolve.expression = function() {
                return predicate.expression;
            }
        } else if(predicate.expressionItem.operator === "IS_A") {
            modalOptions.component = "modalWithTreeComponent";
            modalOptions.resolve.items = function() {
                var terms = guidelineFactory.getOntology().termDefinitions.en.terms;
                var modalItems = [];
                angular.forEach(terms, function (term) {
                    term.viewText = term.id + " - " + term.text;
                    term.type = leftElementType;
                    modalItems.push(term);
                });
                modalItems = modalItems.sort(compare);
                return modalItems;
            }
        } else if(leftElementType === DV.CODEDTEXT) {
            var defaultOption = {};
            modalOptions.component = "modalWithInputAndDropdownComponent";
            modalOptions.resolve.items = function() {
                var attributes = archetype.elementMaps[leftElementName].attributeMaps;
                for(var attribute in attributes) {
                    if(rightElementType === "CodedTextConstant" && predicate.expressionItem.right.expressionItem.codedText &&
                       predicate.expressionItem.right.expressionItem.codedText.definingCode &&
                       attributes[attribute].code == predicate.expressionItem.right.expressionItem.codedText.definingCode.codeString) {
                         defaultOption = attributes[attribute];
                    }
                    attributes[attribute].viewText = attributes[attribute].text;
                    attributes[attribute].type = leftElementType;
                    modalItems.push(attributes[attribute]);
                }
                return modalItems;
            };
            modalOptions.resolve.default = function() {
                return defaultOption;
            }
        } else if(leftElementType === DV.TEXT) {
            modalOptions.component = "modalWithInputAndDropdownComponent";
            modalOptions.resolve.input = {};
            modalOptions.resolve.input.type = leftElementType;
            // TODO: What are string and value for? What is the difference between them?
            if(rightElementType === "StringConstant") {
                modalOptions.resolve.input.string = predicate.expressionItem.right.expressionItem.string;
                modalOptions.resolve.input.value = predicate.expressionItem.right.expressionItem.value;
            }
        } else if(leftElementType === DV.QUANTITY) {
            modalOptions.component = "modalWithInputAndDropdownComponent";
            var quantity = predicate.expressionItem.right.expressionItem.quantity || {};
            var magnitude = quantity.magnitude;
            modalOptions.resolve.input = function() {
                var input = {
                    type: leftElementType,
                    value: magnitude
                }
                return input;
            };
            modalOptions.resolve.items = function() {
                // FIXME: Get the options in a right way
                var options = ["cm", "in"];
                var modalItems = [];
                for(var i in options) {
                    modalItems.push({viewText: options[i], type: leftElementType});
                }
                return modalItems;
            };
            modalOptions.resolve.default = function() {
                var units = quantity.units || {};
                var defaultOption = {
                  type: leftElementType,
                  viewText: units
                }
                return defaultOption;
            };
        } else if(leftElementType === DV.DATETIME) {
            modalOptions.component = "modalWithDatepickerComponent";

            var dateTime;
            if(rightElementType === "DateTimeConstant") {
                dateTime = predicate.expressionItem.right.expressionItem.value;
            } else {
                dateTime = new Date().toISOString().split(".")[0];
            }

            modalOptions.resolve.date = function() {
                var date = {
                    type: leftElementType,
                    value: dateTime
                }
                return date;
            };
        } else if(leftElementType === DV.ORDINAL) {
            var defaultOption = {};
            modalOptions.component = "modalWithInputAndDropdownComponent";
            modalOptions.resolve.items = function() {
                var attributes = archetype.elementMaps[leftElementName].attributeMaps;
                for(attribute in attributes) {
                    if(predicate.expressionItem.right.expressionItem.ordinal && attributes[attribute].code == predicate.expressionItem.right.expressionItem.ordinal.symbol.definingCode.codeString) {
                        defaultOption = attributes[attribute];
                    }
                    attributes[attribute].viewText = attributes[attribute].text;
                    attributes[attribute].type = leftElementType;
                    modalItems.push(attributes[attribute]);
                }
                return modalItems;
            };
            modalOptions.resolve.default = function() {
                return defaultOption;
            }
        } else if(leftElementType === DV.COUNT) {
            modalOptions.component = "modalWithInputAndDropdownComponent";
            var value = predicate.expressionItem.right.expressionItem.value;
            modalOptions.resolve.input = function() {
                return { type: DV.COUNT, value: value };
            };
            return modalOptions;
        }
        return modalOptions;
    }

    /**
     * Used to sort by name the gt codes displayed in the popup when an IS_A choice is selected
     * @param a
     * @param b
     * @returns {number}
     */
    function compare(a,b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }

    /**
     * Gets the name of an expressionItem
     * @param archetypeId
     * @param expressionItem
     * @returns {*}
     */
    function getName(archetypeId, expressionItem) {
        var side = expressionItem.left ? "left" : "operand";
        var path = expressionItem[side].expressionItem.path;
        if(path == null) {
            return "Select one"
        }
        return guidelineFactory.getElementByArchetypIdAndPath(archetypeId, path).elementMapId;
    }

    function isPredicate(item) {
        return item.expressionItem;
    }

    function sort (archertypeBindings) {
        angular.forEach(archertypeBindings, function(archetypeBinding) {
            angular.forEach(archetypeBinding.elements, function (element) {
                if(isPredicate(element)) {
                    if(!archetypeBinding.predicateStatements) {
                        archetypeBinding.predicateStatements = [];
                    }
                    archetypeBinding.predicateStatements.push(element);
                    archetypeBinding.elements.splice(archetypeBinding.elements.indexOf(element));
                }
            });
            angular.forEach(archetypeBinding.predicateStatements, function (predicateStatement) {
                if(isElement(predicateStatement)) {
                    if(!archetypeBinding.elements) {
                        archetypeBinding.elements = [];
                    }
                    archetypeBinding.elements.push(predicateStatement);
                    archetypeBinding.predicateStatements.splice(archetypeBinding.predicateStatements.indexOf(predicateStatement));
                }
            })
        })
    }

}