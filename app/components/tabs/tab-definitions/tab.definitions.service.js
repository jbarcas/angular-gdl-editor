/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.services')
    .factory('definitionsFactory', definitionsFactory);

function definitionsFactory(DV, guidelineFactory, utilsFactory) {

    var operators = {
        'MULTIPLICATION': "*",
        "ADDITION": "+",
        "SUBSTRATION": "-",
        "DIVISION": "/",
        "EXPONENT": "^"
    };

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
        setCodedTextConstant: setCodedTextConstant,
        setStringConstant: setStringConstant,
        setQuantityConstant: setQuantityConstant,
        setDateTimeConstant: setDateTimeConstant,
        setOrdinalConstant: setOrdinalConstant,
        convertModel: convertModel,
        getExpression: getExpression,
        getPredicateStatementType: getPredicateStatementType,
        getDataForModal: getDataForModal,
        getOptionsForModal: getOptionsForModal
    }

    function createArchetypeInstantiation(model) {

    }

    function createElementInstantiation (model) {
        model.id = utilsFactory.generateGt(vm.guide);
        vm.guide.ontology.termDefinitions.en.terms[model.id] = {
            id: model.id,
            text: "Select an element"
        }
    }

    /**
     * Generates the left side operand depending on the type of the definition
     * @param model
     * @returns The model with the left operand added
     */
    function createLeftOperand(model) {
        model.unselected = true;
        var item = model.type === "UnaryExpression" ? "operand" : "left";
        model.expressionItem = {};
        model.expressionItem[item] = {};
        model.expressionItem[item].type = "Variable";
        model.expressionItem[item].expressionItem = {};
        model.expressionItem[item].expressionItem.name = "Select an element";
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

    /*
     * Checks if the element is being used in the preconditions
     */
    function existsInPreconditions (element) {
        var result = false;
        angular.forEach(vm.guide.definition.preConditions, function (item) {
            if (item.indexOf(element.id) > -1) {
                result = true;
            }
        });
        return result;
    };


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

    function setStringConstant (stringConstant, dataFromInput) {
        // TODO: properties string y value differences?
        var value = dataFromInput.data.input.value;
        stringConstant.type = "StringConstant";
        stringConstant.expressionItem = {
            string: value,
            value: value
        }
    }

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

    function setDateTimeConstant(dateTimeConstant, dataFromPicker) {
        dateTimeConstant.type = "DateTimeConstant";
        dateTimeConstant.expressionItem = {
            value: dataFromPicker.data.date
        }
    }

    function setOrdinalConstant(ordinalConstant, dataFromDropdown) {
        var value = parseInt(dataFromDropdown.data.option.value);
        var code = dataFromDropdown.data.option.code;
        var text = dataFromDropdown.data.option.text;

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
        }
        ordinalConstant.ordinal.value = value + "|" + ordinalConstant.expressionItem.ordinal.symbol.definingCode.terminologyId.value + "::" + code + "|" + text + "|"

    }

    function convertModel(archertypeBindings){
        // converts the elements
        angular.forEach(archertypeBindings, function (archetypeBinding) {
            if (archetypeBinding.elements) {
                archetypeBinding.elements = objectToArray(archetypeBinding.elements);
            }
            angular.forEach(archetypeBinding.predicateStatements, function (predicateStatement) {
                var path = getPredicateStatementPath(predicateStatement);
                var name = guidelineFactory.getElementName(archetypeBinding.archetypeId, path);

                if (isUnaryExpression(predicateStatement)) {
                    predicateStatement.expressionItem.operand.expressionItem.name = name;
                }
                if (isBinaryExpression(predicateStatement)) {
                    predicateStatement.expressionItem.left.expressionItem.name = name;
                }
                predicateStatement.ruleLine = getPredicateStatementType(predicateStatement);
                /*
                 * It might not contain elements
                 */
                if(!archetypeBinding.elements) {
                    archetypeBinding.elements = [];
                }
                archetypeBinding.elements.push(predicateStatement);
            })
            // Clear the predicateStatements
            archetypeBinding.predicateStatements = [];

        });

        // converts the archetypeBindings
        archertypeBindings = objectToArray(vm.guide.definition.archetypeBindings);
        return archertypeBindings;
    }

    /**
     * Converts the model to the one necessary for the tree component
     * @param object the object to convert
     * @returns {Array} the converted array
     */
    function objectToArray(object) {
        var array = [];
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                array.push(object[property]);
            }
        }
        return array;
    }

    function getPredicateStatementPath(predicateStatement) {

        var side = predicateStatement.type === "UnaryExpression" ? "operand" : "left";

        if (getPredicateStatementType(predicateStatement) === "PredicateExpression") {
            var res = predicateStatement.expressionItem.left.expressionItem.path.split("/value");
            path = res[0];
            predicateStatement.expressionItem.left.attribute = res[1].substring(1);
        }
        return predicateStatement.expressionItem[side].expressionItem.path;
    }

    function getPredicateStatementType(predicateStatement) {
        var type;
        if(predicateStatement.type === "UnaryExpression") {
            type = "PredicateFunction";
        } else if(predicateStatement.expressionItem.right.expressionItem.value === "null") {
            type = "PredicateExists";
//      } else if(predicateStatement.expressionItem.left.attribute) {  // FIXME: this should be the right way to check if it is a PredicateExpression
        } else if(isExpression(predicateStatement.expressionItem.right)) {
            predicateStatement.expression = getExpression(predicateStatement.expressionItem.right);
            type = "PredicateExpression";
        } else {
            type = "PredicateDatavalue";
        }
        return type;
    }

    function isBinaryExpression(predicateStatement) {
        return predicateStatement.type === "BinaryExpression";
    }

    function isUnaryExpression(predicateStatement) {
        return predicateStatement.type === "UnaryExpression";
    }

    function isExpression(object) {
        return Object.keys(operators).indexOf(object.expressionItem.operator) !== -1;
    }

    function getExpression(expression) {

        if (typeof str === 'undefined' || !str) {
            str= "";
        } else if (str.startsWith("(") && str.endsWith(")")) {
            str = "";
        }

        if (!isExpression(expression)) {
            str += expression.expressionItem.code + "." + expression.expressionItem.attribute;
        } else {
            str += '(';
            getExpression(expression.expressionItem.left);
            str += " " + operators[expression.expressionItem.operator] + " ";
            getExpression(expression.expressionItem.right);
            str += ')';
        }
        console.log(str);
        return str;
    }

    function getDataForModal(archetype, predicate) {
        var elementName = predicate.expressionItem.left.expressionItem.name;
        var path = archetype.elementMaps[elementName].path;
        var atCode = path.substring(path.lastIndexOf("[") + 1, path.lastIndexOf("]"));
        var modalData = {};
        var bodyText;
        // TODO: bodyText in event time?
        if(guidelineFactory.getTerms()[archetype.archetypeId][atCode]) {
            //bodyText = guidelineFactory.getTerms()[archetype.archetypeId][atCode].description;
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

    function getOptionsForModal(archetype, predicate) {
        var leftElementName = predicate.expressionItem.left.expressionItem.name;
        var leftElementType = archetype.elementMaps[leftElementName].dataType;

        var rightElementType = predicate.expressionItem.right.type;

        var modalOptions = {};
        modalOptions.resolve = {};
        var modalItems = [];
        if(predicate.expressionItem.operator === "IS_A") {
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
                    if(attributes[attribute].code == predicate.expressionItem.right.expressionItem.ordinal.symbol.definingCode.codeString) {
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
            // TODO: DV.COUNT
        }
        return modalOptions;
    }

    function compare(a,b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }


}