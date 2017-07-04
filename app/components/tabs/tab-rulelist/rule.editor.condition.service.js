/**
 * Created by jbarros on 1/05/17.
 */

angular.module('app.services')
    .factory('conditionFactory', conditionFactory);

function conditionFactory() {

    return {
        createCompareDataValue: createCompareDataValue,
        createCompareNullValue: createCompareNullValue,
        createCompareElement: createCompareElement,
        createCompareAttribute: createCompareAttribute,
        createElementExists: createElementExists,
        createOr: createOr,
        beforeDrop: beforeDrop
    };


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

    function beforeDrop(event) {
        var cloneModel = event.source.cloneModel;
        if(cloneModel.category === "CompareDataValue") {
            createCompareDataValue(cloneModel);
        } else if(cloneModel.category === "CompareNullValue") {
            createCompareNullValue(cloneModel);
        } else if (cloneModel.category === "CompareElement") {
            createCompareElement(cloneModel);
        } else if (cloneModel.category === "CompareAttribute") {
            createCompareAttribute(cloneModel);
        } else if (cloneModel.category === "ElementExists") {
            createElementExists(cloneModel);
        } else if (cloneModel.category === "Or") {
            createOr(cloneModel);
        }
        delete cloneModel.category;
        delete cloneModel.draggable;
        delete cloneModel.title;
    }

}
