/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.controllers')
    .controller('GdlCtrl', GdlCtrl);

function GdlCtrl($timeout, $log, gdlFactory, guidelineFactory, utilsFactory, modalService) {

    vm = this;
    vm.guide = {};
    vm.guide.id = guidelineFactory.getId();
    vm.updateGdl = updateGdl;
    vm.errorMsg;

    vm.updateIcon = "../assets/img/entry_evaluation.png";

    vm.editorOptions = {
        lineNumbers: true
    };

    update();

    function update() {
        var guideline = guidelineFactory.getCurrentGuide();

        if(areUnselectedItems(guideline)) {
            var modalDefaults = {component: 'dialogComponent'};
            var text;
            if (item.archetypeId) {
                text = 'You have an item with no link to the archetype "' + item.archetypeId + '"'
            } else {
                text = 'You have an item with no link to the rule "' + guidelineFactory.getOntology().termDefinitions.en.terms[item.id].text + '" in conditions'
            }

            var modalOptions = {
                headerText: 'Guideline not updated!',
                bodyText: text
            };
            modalService.showModal(modalDefaults, modalOptions);
            return;
        }

        guideline = utilsFactory.convertToPost(guideline);

        guidelineFactory.insertGuideline(guideline).then(insertGuidelineComplete, insertGuidelineFailed);

        function insertGuidelineComplete(response) {
            console.log("Guideline saved correctly");
            console.log(response.config.data);
            getGuideline(guideline.id);
        }

        function insertGuidelineFailed(response) {
            var modalDefaults = {size: 'md'};

            var modalOptions = {
                headerText: 'Error!',
                bodyText: 'The guideline ' + response.config.data.id + ' has not been updated.'
            };
            modalService.showModal(modalDefaults, modalOptions);
            $log.info('Error at inserting guide (code status ' + response.status + '): ' + response);
        }
    }

    function getGuideline (guideId) {
        guidelineFactory.getGuideline(guideId).then(
            function (data) {
                guidelineFactory.setCurrentGuideline(data);
                getGdl(data.id);
            },
            function (error) {
                vm.errorMsg = error.error;
            }
        );
    }

    function getGdl(guideline) {
        return gdlFactory.getGdl(guideline).then(function(response) {
            vm.gdl = response;
        })
    }

    function areUnselectedItems (guideline) {
        /*
         * In archetypeBindings
         */
        for(var archetypeBinding in guideline.definition.archetypeBindings) {
            for(var element in guideline.definition.archetypeBindings[archetypeBinding].elements) {
                if(guideline.definition.archetypeBindings[archetypeBinding].elements[element].unselected) {
                    item = guideline.definition.archetypeBindings[archetypeBinding];
                    return true;
                }
            }
        }
        /*
         * In rules
         */
        for (var rule in guideline.definition.rules) {
            if(typeof guideline.definition.rules[rule].whenStatements === 'undefined') {
                continue;
            }
            for (var i=0; i<guideline.definition.rules[rule].whenStatements.length; i++) {
                if (guideline.definition.rules[rule].whenStatements[i].expressionItem.left.unselected ||guideline.definition.rules[rule].whenStatements[i].expressionItem.right.unselected) {
                    item = guideline.definition.rules[rule];
                    return true;
                }
            }
        }


        return false;
    }

    function updateGdl(node) {
        var guidelineId = node.vm.guide.id;
        var gdl = node.vm.gdl;
        gdlFactory.updateGdl(guidelineId, gdl).then(function() {
            $timeout(function () {
                guidelineFactory.getGuideline(guidelineId).then(function(data) {
                    guidelineFactory.setCurrentGuideline(data);
                });
            }, 1000, guidelineId);
        })
    }



}
