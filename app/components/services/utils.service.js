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

        for(var archetypeBinding in guideline.definition.archetypeBindings) {
            if (guideline.definition.archetypeBindings.hasOwnProperty(archetypeBinding)) {
                var elements = guideline.definition.archetypeBindings[archetypeBinding].elements;
                /**
                 *  If "elements" is an array, then the model has been modified, so we need to re-convert the model
                 */
                if(angular.isArray(elements)) {
                    guideline.definition.archetypeBindings[archetypeBinding].elements = {};
                    for (var i= 0,len=elements.length; i<len; i++) {
                        if(isElement(elements[i])) {
                            var element = elements[i];
                            guideline.definition.archetypeBindings[archetypeBinding].elements[element.id] = element;
                        } else {
                            var predicateStatement = elements[i];
                            guideline.definition.archetypeBindings[archetypeBinding].predicateStatements.push(predicateStatement);
                        }
                    }
                }
            }
        }
        return guideline;
    }

    function isElement(item) {
        return item.hasOwnProperty("id");
    }
}