/**
 * Created by jbarros on 6/08/15.
 */

angular.module('app.services')
    .factory('utilsFactory', utilsFactory);

function utilsFactory(guidelineFactory, GT_HEADER) {

    return {
        generateGt: generateGt,
        convertToPost: convertToPost,
        isBinaryExpression: isBinaryExpression,
        isUnaryExpression: isUnaryExpression,
        getArchetypeType: getArchetypeType,
        objectToArray: objectToArray
    };

    function generateGt(guide) {

        if (!guide.ontology) {
            guide.ontology = guidelineFactory.getOntology();
        }

        //var originalLanguage = guide.language.originalLanguage.codeString;
        // TODO: Other languages
        var originalLanguage = "en";
        /*
         * First, we fetch the gt codes from the Ontology section
         */
        var usedTerms = Object.keys(guide.ontology.termDefinitions[originalLanguage].terms);

        /*
         * It could be that gt codes exist outside Ontology section
         */
        if (guide.definition && guide.definition.archetypeBindings) {
            angular.forEach(guide.definition.archetypeBindings, function (archetypeBinding) {
                /*
                 * We check if the archetype binding id was retrieved
                 */
                if(archetypeBinding.id && usedTerms.indexOf(archetypeBinding.id) == -1) {
                    usedTerms.push(archetypeBinding.id);                            
                }
                /*
                 * The gt code may exist in the elements, so we check there to fetch them.
                 * The element.id verification is needed because of the converted model
                 * considering that the predicate statements don't have gt code
                 */
                angular.forEach(archetypeBinding.elements, function(element) {
                    if(element.id && usedTerms.indexOf(element.id) == -1) {
                        usedTerms.push(element.id);
                    }
                })
            })
        }
        var high = usedTerms.sort().pop();
        var generatedCode = high.split(GT_HEADER)[1];
        generatedCode++;
        generatedCode = "" + generatedCode;
        var pad = "0000";
        var gtCode = GT_HEADER + pad.substring(0, pad.length - generatedCode.length) + generatedCode;
        return gtCode;
    }

    /**
     * Converts the guideline when it necessary due to the model conversion for the angular ui tree component
     *
     * @param guideline The guideline as the tree component needs
     * @returns {*} The guideline as gdl backend understands
     */
    function convertToPost(guideline) {
        for (var archetypeBinding in guideline.definition.archetypeBindings) {
            if (guideline.definition.archetypeBindings.hasOwnProperty(archetypeBinding)) {
                var elements = guideline.definition.archetypeBindings[archetypeBinding].elements;
                var predicateStatements = guideline.definition.archetypeBindings[archetypeBinding].predicateStatements || [];
                /**
                 *  If "elements" is an array, then the model has been modified, so we need to re-convert the model
                 */
                if (angular.isArray(elements)) {
                    guideline.definition.archetypeBindings[archetypeBinding].elements = {};
                    for (var i = 0, len = elements.length; i < len; i++) {
                        var element = elements[i];
                        guideline.definition.archetypeBindings[archetypeBinding].elements[element.id] = element;
                    }
                    for (var i = 0, len = predicateStatements.length; i < len; i++) {
                        var predicateStatement = predicateStatements[i];
                        delete predicateStatement.expression;
                    }
                }
            }
        }
        var ab = guideline.definition.archetypeBindings;
        guideline.definition.archetypeBindings = {};
        for(var i=0; i<ab.length; i++) {
            guideline.definition.archetypeBindings[ab[i].id] = ab[i];
        }
        return guideline;
    }

    /**
     * Checks if the provided expression is a UnaryExpression
     * @param expressionItem
     * @returns {boolean}
     */
    function isUnaryExpression(expressionItem) {
        return expressionItem && expressionItem.type === "UnaryExpression";
    }

    /**
     * Checks if the provided expression is a BinaryExpression
     * @param expressionItem
     * @returns {boolean}
     */
    function isBinaryExpression(expressionItem) {
        return expressionItem && expressionItem.type === "BinaryExpression";
    }

    /**
     * Gets the archetype type
     * @param archetypeId
     */
    function getArchetypeType(archetypeId) {
        var parts = archetypeId.split('-');
        return parts[2].split('.')[0];
    }

    /**
     * Converts an object into an array to fit the angular UI tree requirements
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
}