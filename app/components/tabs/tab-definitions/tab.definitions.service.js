/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.services')
    .factory('definitionsFactory', definitionsFactory);

function definitionsFactory(guidelineFactory) {

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
        isDroppable: isDroppable,
        existsInRules: existsInRules,
        existsInPreconditions: existsInPreconditions,
        generateCodedTextConstant: generateCodedTextConstant,
        convertModel: convertModel,
        getExpression: getExpression
    }

    function createElementInstantiation (model) {

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
        model.expressionItem.right.type = "CodedTextConstant";
        model.expressionItem.right.expressionItem = {};
        model.expressionItem.right.expressionItem.codedText = {};
        model.expressionItem.right.expressionItem.codedText.value = "Select DataValue";
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


    function generateCodedTextConstant (element, dataFromTree) {
        element.expressionItem.codedText.value = dataFromTree.selectedItem.name;
        if(!element.expressionItem.codedText.definingCode) {
            element.expressionItem.codedText.definingCode = {};
            element.expressionItem.codedText.definingCode.terminologyId = {};
        }
        element.expressionItem.codedText.definingCode.codeString = dataFromTree.selectedItem.code;
        // TODO: terminology id set as local::local. Allow other terminologies
        element.expressionItem.codedText.definingCode.terminologyId.name = "local";
        element.expressionItem.codedText.definingCode.terminologyId.value = "local";
        //element.expressionItem.name = dataFromTree.selectedItem.name;
        element.expressionItem.value =
            element.expressionItem.codedText.definingCode.terminologyId.value
            + "::" + element.expressionItem.codedText.definingCode.codeString + "|"
            + element.expressionItem.codedText.value + "|";
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
                predicateStatement.ruleLine = setRuleLine(predicateStatement);
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
     * @param isElement Indicates whether the object is an element or not
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
        var path;
        switch (predicateStatement.type) {
            case "UnaryExpression":
                path = predicateStatement.expressionItem.operand.expressionItem.path;
                break;
            case "BinaryExpression":
                path = predicateStatement.expressionItem.left.expressionItem.path;

                if (isPredicateExpression(predicateStatement)) {
                    var res = predicateStatement.expressionItem.left.expressionItem.path.split("/value");
                    path = res[0];
                    predicateStatement.expressionItem.left.attribute = res[1].substring(1);
                }

                break;
            default:
                path = null
        }
        return path;
    }

    function isBinaryExpression(predicateStatement) {
        return predicateStatement.type === "BinaryExpression";
    }

    function isUnaryExpression(predicateStatement) {
        return predicateStatement.type === "UnaryExpression";
    }

    function isPredicateDataValue(predicateStatement) {
        return predicateStatement.expressionItem.right.type === "CodedTextConstant" || predicateStatement.expressionItem.right.type === "CodePhraseConstant";
    }

    function isPredicateExists(predicateStatement) {
        return predicateStatement.expressionItem.right.expressionItem.value === "null";
    }

    function isPredicateExpression(predicateStatement) {
        return isExpression(predicateStatement.expressionItem.right);
    }

    function setRuleLine(predicateStatement) {

        /* Predicate(DataValue) */
        if(isBinaryExpression(predicateStatement)) {
            if(isPredicateDataValue(predicateStatement)) {
                return "PredicateDatavalue";
            }
        }

        /* Predicate(Function) */
        if(isUnaryExpression(predicateStatement)) {
            return "PredicateFunction";
        }

        /* Predicate(Exists) */
        if(isBinaryExpression(predicateStatement)) {
            if(isPredicateExists(predicateStatement)) {
                return "PredicateExists";
            }
        }

        /* Predicate(Expression) */
        if(isBinaryExpression(predicateStatement)) {
            if(isPredicateExpression(predicateStatement)) {
                // Add the expression
                predicateStatement.expression = getExpression(predicateStatement.expressionItem.right);
                return "PredicateExpression";
            }
        }

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


}