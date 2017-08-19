/**
 * Created by jbarros on 1/05/17.
 */

angular.module('app.services')
    .factory('actionFactory', actionFactory);

function actionFactory($log, expressionItemFactory, modalService) {

    return {
        createEntry: createEntry,
        createSetDataValue: createSetDataValue,
        createSetNullValue: createSetNullValue,
        createSetElement: createSetElement,
        createSetAttribute: createSetAttribute,
        updateActionLeft: updateActionLeft,
        updateActionRight: updateActionRight,
        beforeDrop: beforeDrop,
        getActionName: getActionName
    };

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
        model.variable.attribute = 'attribute';

        model.assignment = {};
        model.assignment.unselected = true;
        model.assignment.type = '';
        model.assignment.expressionItem = {};
    }

    function updateActionLeft(node) {
        var action = node.$modelValue;
        var type = expressionItemFactory.getActionType(action);

        var modalData = {headerText: 'Select element instance'};
        var modalOptions = expressionItemFactory.getOptionsForTreeModal(action);

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }
            var selected = modalResponse.data.selectedItem;
            /*
             * Delete the unselected property used to highlight the text in the view
             */
            delete action.variable.unselected;

            type === "Attribute" ? expressionItemFactory.setLeftAttribute(action, selected) : expressionItemFactory.setLeftRemaining(action, selected, type);
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.action.service.updateActionLeft()');
        }
    }

    function updateActionRight(node) {
        var action = node.$modelValue;
        var type = expressionItemFactory.getActionType(action);
        /*
         * If the action has a 'magnitude' left side attribute, the expression editor is opened
         */
        if (action.variable.attribute === 'magnitude') {
            //expressionItemFactory.openExpressionEditor(action.assignment);
            expressionItemFactory.openExpressionEditor(action);
            return;
        }
        /*
         * If the action at hand is a CompareDatavalue and the left item has not been selected yet
         */
        if(!action.variable.code && (type === "DataValue" || type === "Attribute")) {
            var modalData = {headerText: 'Select an element', bodyText: 'You have to select an element before choosing a data value'};
            var modalOptions = {component: 'dialogComponent'};
            modalService.showModal(modalOptions, modalData);
            return;
        }

        var data = expressionItemFactory.getDataModal(action);
        var options = expressionItemFactory.getOptionsModal(action);

        modalService.showModal(options, data).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }
            var selected = modalResponse.data.selectedItem;
            var variable = action.variable;
            var assignment = action.assignment;
            /*
             * Delete the unselected property used to highlight the text in the view
             */

            delete assignment.unselected;
            var type = modalResponse.data.type;

            if(type === "NullValue") {
                expressionItemFactory.setNullValue(assignment, selected);
            } else if(type === "ElementValue") {
                expressionItemFactory.setCompareElement (assignment, selected);
            } else if(type === "AttributeValue") {
                expressionItemFactory.setAttribute(variable, assignment, modalResponse);
            } else {
                expressionItemFactory.setCompareDataValue(assignment, modalResponse);
            }
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in rule.editor.action.service.updateActionRight()');
        }

    }

    function beforeDrop(event) {
        var cloneModel = event.source.cloneModel;
        if(cloneModel.category === "CreateEntry") {
            createEntry(cloneModel);
        } else if(cloneModel.category === "SetDataValue") {
            createSetDataValue(cloneModel);
        } else if (cloneModel.category === "SetNullValue") {
            createSetNullValue(cloneModel);
        } else if (cloneModel.category === "SetElement") {
            createSetElement(cloneModel);
        } else if (cloneModel.category === "SetAttribute") {
            createSetAttribute(cloneModel);
        }
        delete cloneModel.category;
        delete cloneModel.draggable;
        delete cloneModel.title;
    }

    function getActionName(action) {
        var thenStatement = action.$modelValue;
        if (thenStatement.assignment.type === 'BinaryExpression') {
            if(thenStatement.expressionItem) {
                thenStatement.assignment.expressionItem.right.expressionItem = thenStatement.expressionItem;
                delete thenStatement.expressionItem;
            }
            return expressionItemFactory.getLiteralExpression(thenStatement.assignment);
        }
        return thenStatement.assignment.expressionItem.value; //|| vm.terms[thenStatement.assignment.expressionItem.code].text
    }

}
