/**
 * Created by jbarros on 6/08/15.
 */

angular.module('app.services')
    .factory('utilsFactory', utilsFactory);

function utilsFactory(guidelineFactory, GT_HEADER) {

    return {
        generateGt: generateGt,
        convertToPost: convertToPost
    }

    function generateGt(guide) {

        if (!guide.ontology) {
            guide.ontology = guidelineFactory.getOntology();
        }

        //var originalLanguage = guide.language.originalLanguage.codeString;
        // TODO: Other languages
        var originalLanguage = "en";
        /*
         * First, we fecth the gt codes from the Ontology section
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
    };

    function convertToPost(guideline) {
        guideline.definition.archetypeBindings.map(function (archetypeBindingValue, archetypebindingKey) {
            if (!angular.isUndefined(archetypeBindingValue.elements)) {
                archetypeBindingValue.elements.map(function (elementValue, elementKey) {

                    if(elementValue.type === "BinaryExpression") {
                        delete elementValue.ruleLine;
                        delete elementValue.expressionItem.left.expressionItem.name;
                        guideline.definition.archetypeBindings[archetypebindingKey].predicateStatements.push(elementValue);
                    } else if(elementValue.type === "UnaryExpression") {
                        delete elementValue.ruleLine;
                        delete elementValue.expressionItem.operand.expressionItem.name;
                        guideline.definition.archetypeBindings[archetypebindingKey].predicateStatements.push(elementValue);
                    } else {
                        guideline.definition.archetypeBindings[archetypebindingKey].elements[elementValue.id] = elementValue;
                        /*
                         * Delete the "name" property (used to map the gt code element to its name in the archetype)
                         */
                        delete guideline.definition.archetypeBindings[archetypebindingKey].elements[elementValue.id].name;
                    }

                    delete guideline.definition.archetypeBindings[archetypebindingKey].elements[elementKey];
                });
                var element = {};
                angular.extend(element, guideline.definition.archetypeBindings[archetypebindingKey].elements);
                guideline.definition.archetypeBindings[archetypebindingKey].elements = element;
                guideline.definition.archetypeBindings[archetypeBindingValue.id] = archetypeBindingValue;
                delete guideline.definition.archetypeBindings[archetypebindingKey];
            }
        })
        var newObj = {};
        angular.extend(newObj, guideline.definition.archetypeBindings);
        guideline.definition.archetypeBindings = newObj;
        return guideline;
    }



}