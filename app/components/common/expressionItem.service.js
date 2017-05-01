/**
 * Created by jbarros on 1/05/17.
 */


angular.module('app.services')
    .factory('expressionItemFactory', expressionItemFactory);

function expressionItemFactory() {

    return {
        setCodedTextConstant: setCodedTextConstant,
        setStringConstant: setStringConstant,
        setQuantityConstant: setQuantityConstant,
        setDateTimeConstant: setDateTimeConstant,
        setOrdinalConstant: setOrdinalConstant,
        setConstantExpression: setConstantExpression
    };

    /**
     * Fills the codedTextConstant with the new values from the user input
     * @param codedTextConstant
     * @param dataFromTree
     */
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

    /**
     * Fills the stringConstant with the new values from the user input
     * @param stringConstant
     * @param dataFromInput
     */
    function setStringConstant (stringConstant, dataFromInput) {
        // TODO: properties string y value differences?
        var value = dataFromInput.data.input.value;
        stringConstant.type = "StringConstant";
        stringConstant.expressionItem = {
            string: value,
            value: value
        }
    }


    /**
     * Fills the quantityConstant with the new values from the user input
     * @param quantityConstant
     * @param dataFromModal
     */
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

    /**
     * Fills the dateTimeConstant with the new values from the user input
     * @param dateTimeConstant
     * @param dataFromPicker
     */
    function setDateTimeConstant(dateTimeConstant, dataFromPicker) {
        dateTimeConstant.type = "DateTimeConstant";
        dateTimeConstant.expressionItem = {
            value: dataFromPicker.data.date
        }
    }

    /**
     * Fills the ordinalConstant  with the new values from the user input
     * @param ordinalConstant
     * @param dataFromDropdown
     */
    function setOrdinalConstant(ordinalConstant, dataFromDropdown) {
        var value = parseInt(dataFromDropdown.data.selectedItem.value);
        var code = dataFromDropdown.data.selectedItem.code;
        var text = dataFromDropdown.data.selectedItem.text;

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
        ordinalConstant.expressionItem.value = value + "|" + ordinalConstant.expressionItem.ordinal.symbol.definingCode.terminologyId.value + "::" + code + "|" + text + "|"
    }

    /**
     * Fills the constantExpression with the new values from the user input
     * @param constantExpression
     * @param dataFromInput
     */
    function setConstantExpression (constantExpression, dataFromInput) {
        var value = dataFromInput.data.input.value;
        constantExpression.type = "ConstantExpression";
        constantExpression.expressionItem = {
            value: value
        }
    }

}