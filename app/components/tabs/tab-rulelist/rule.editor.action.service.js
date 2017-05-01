/**
 * Created by jbarros on 1/05/17.
 */

angular.module('app.services')
    .factory('actionFactory', actionFactory);

function actionFactory(guidelineFactory, definitionsFactory, utilsFactory, ATTRIBUTES, NULLVALUE, DV) {

    return {
        getType: getType,
        createEntry: createEntry,
        createSetDataValue: createSetDataValue,
        createSetNullValue: createSetNullValue,
        createSetElement: createSetElement,
        createSetAttribute: createSetAttribute
    };

    function getType(action) {
        var type;
        if (action.variable.attribute === "null_flavor") {
            type = "NullValue";
        } else if (hasAttribute(action)) {
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
                if(ATTRIBUTES[key].indexOf(expression.variable.attribute) > -1) {
                    return true;
                }
            }
        }
        return false;
    }



    /* *************************************************************************************
     *                                                                                     *
     *  Object creation                                                                    *
     *                                                                                     *
     ***************************************************************************************/

    function createEntry(model) {

    }

    function createSetDataValue(model) {
        model.variable = {};
        model.variable.unselected = true;
        model.variable.code = '';

        model.assignment = {};
        model.assignment.unselected = true;
        model.assignment.type = '';
        model.assignment.expressionItem = {};
    }

    function createSetNullValue(model) {
        model.variable = {};
        model.variable.unselected = true;
        model.variable.code = '';
        model.variable.attribute = 'null_flavor';

        model.assignment = {};
        model.assignment.unselected = true;
        model.assignment.type = 'CodedTextConstant';
        model.assignment.expressionItem = {};
    }

    function createSetElement(model) {
        model.variable = {};
        model.variable.unselected = true;
        model.variable.code = '';

        model.assignment = {};
        model.assignment.unselected = true;
        model.assignment.type = 'Variable';
        model.assignment.expressionItem = {};
        model.assignment.expressionItem.code = '';
    }

    function createSetAttribute(model) {
        model.variable = {};
        model.variable.unselected = true;
        model.variable.code = '';
        model.variable.attribute = 'units';

        model.assignment = {};
        model.assignment.unselected = true;
        model.assignment.type = '';
        model.assignment.expressionItem = {};
    }

}
