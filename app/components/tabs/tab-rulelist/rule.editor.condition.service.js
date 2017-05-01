/**
 * Created by jbarros on 1/05/17.
 */

angular.module('app.services')
    .factory('conditionFactory', conditionFactory);

function conditionFactory(guidelineFactory, definitionsFactory, utilsFactory, ATTRIBUTES, NULLVALUE, DV) {

    return {
        getType: getType,
        createCompareDataValue: createCompareDataValue,
        createCompareNullValue: createCompareNullValue,
        createCompareElement: createCompareElement,
        createCompareAttribute: createCompareAttribute,
        createElementExists: createElementExists,
        createOr: createOr
    };


    function getType(condition) {
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


    /* *************************************************************************************
     *                                                                                     *
     *  Object creation                                                                    *
     *                                                                                     *
     ***************************************************************************************/

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
