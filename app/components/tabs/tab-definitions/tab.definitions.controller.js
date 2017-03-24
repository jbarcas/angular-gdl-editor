/**
 * Created by jbarros on 11/05/15.
 */

angular.module('app.controllers', [])
    .controller('DefinitionsCtrl', DefinitionsCtrl);


function DefinitionsCtrl($log, $filter, archetypeFactory, utilsFactory, guidelineFactory, definitionsFactory, modalService, DV) {

    vm = this;

    vm.guide = {};
    vm.guide.definition = {};
    vm.guide.definition.archetypeBindings = guidelineFactory.getArchetypeBindings();
    vm.guide.ontology = guidelineFactory.getOntology();

    vm.removeArchetype = removeArchetype;
    vm.removeElement = removeElement;
    vm.createElement = createElement;
    vm.updateLeftItem = updateLeftItem;

    vm.updateRightItem = updateRightItem;
    vm.updateArchetypesModal = updateArchetypesModal;
    vm.openExpression = openExpression;

    vm.getExpression = definitionsFactory.getExpression;

    vm.delete = "../assets/img/del.png";
    vm.add = "../assets/img/add.png";

    vm.guide.definition.archetypeBindings = definitionsFactory.convertModel(vm.guide.definition.archetypeBindings);

    vm.definitions = [
        {title: 'Archetype instantiation', type: "ArchetypeInstantiation", archetypeId: 'Select an archetype',   draggable: true},
        {title: 'Element instantiation',                                                                         draggable: true},
        {title: 'Predicate (DataValue)',   type: "BinaryExpression", ruleLine: "PredicateDatavalue",  draggable: true},
        {title: 'Predicate (Function)',    type: "UnaryExpression",  ruleLine: "PredicateFunction",   draggable: true},
        {title: 'Predicate (Exists)',      type: "BinaryExpression", ruleLine: "PredicateExists",     draggable: true},
        {title: 'Predicate (Expression)',  type: "BinaryExpression", ruleLine: "PredicateExpression", draggable: true}
    ];

    vm.predicateFunctionOptions = ['MAX', 'MIN'];

    vm.predicateExistsOptions = [
        {label: 'exists', value: 'INEQUAL'},
        {label: 'does not exist', value: 'EQUALITY'}
    ];

    vm.predicateExpressionOptions = [
        {label: '==', value: 'EQUALITY'},
        {label: '>=', value: 'GREATER_THAN_OR_EQUAL'},
        {label: '<=', value: 'LESS_THAN_OR_EQUAL'}
    ];

    vm.predicateDataValueOptions = [
        {label: '==', value: 'EQUALITY'},
        {label: '>=', value: 'GREATER_THAN_OR_EQUAL'},
        {label: '<=', value: 'LESS_THAN_OR_EQUAL'},
        {label: 'IS_A', value: 'IS_A'}
    ];

    /*
     * Options to manage the drag and drop nested level
     */
    vm.treeOptions = {
        accept: function (sourceNodeScope, destNodeScope) {
            return definitionsFactory.isDroppable(sourceNodeScope, destNodeScope)
        }
    };

    vm.treeDefinitions = {
        /**
         * Transforms the model before dragging
         * @param event
         */
        beforeDrop: function (event) {
            var cloneModel = event.source.cloneModel;
            cloneModel.unselected = true;
            if(cloneModel.title === "Element instantiation") {
                cloneModel.id = utilsFactory.generateGt(vm.guide);
                vm.guide.ontology.termDefinitions.en.terms[cloneModel.id] = {
                    id: cloneModel.id,
                    text: "Select an element"
                }
            } else if (cloneModel.ruleLine === "PredicateDatavalue") {
                definitionsFactory.createPredicateDatavalue(cloneModel);
            } else if (cloneModel.ruleLine === "PredicateFunction") {
                definitionsFactory.createPredicateFunction(cloneModel);
            } else if (cloneModel.ruleLine === "PredicateExists") {
                definitionsFactory.createPredicateExists(cloneModel);
            } else if (cloneModel.ruleLine === "PredicateExpression") {
                definitionsFactory.createPredicateExpression(cloneModel);
            }
            //delete cloneModel.type;
            delete cloneModel.draggable;
            delete cloneModel.title;

        }
    };

    function removeArchetype(scope) {
        var unused = true;
        var archetype = scope.$modelValue;

        angular.forEach(archetype.elements, function (element) {
            if (definitionsFactory.existsInRules(element) || definitionsFactory.existsInPreconditions(element)) {
                unused = false;
            }
        });

        if (unused) {
            guidelineFactory.deleteGuidelineArchetype(archetype.archetypeId);
            scope.remove();
        } else {
            showModal();
        }

        function showModal() {
            var modalDefaults = {
                size: 'sm'
            };

            var modalOptions = {
                headerText: 'Warning!',
                bodyText: 'The archetype you are trying to delete is being used. These references must be deleted before proceeding.'
            };
            modalService.showModal(modalDefaults, modalOptions);            
        }
    }


    /*
     * Removes an archetype element (if it is possible due to element usage)
     */
    function removeElement(scope) {

        var element = scope.$modelValue;

        if (definitionsFactory.existsInRules(element) || definitionsFactory.existsInPreconditions(element)) {
            showModal();
        } else {
            scope.remove();
        }
        
        function showModal() {
            var modalDefaults = {
                size: 'sm'
            };

            var modalOptions = {
                headerText: 'Warning!',
                bodyText: 'The element you are trying to delete is being used. These references must be deleted before proceeding.'
            };
            modalService.showModal(modalDefaults, modalOptions);            
        }
    }

    function createElement(archetypeBinding) {

        if(archetypeBinding.archetypeId === "Select an archetype") {
            // TODO: trigger a modal with information
            return;
        }
        
        archetypeFactory.getArchetype(archetypeBinding.archetypeId).then(createElementComplete, createElementFailed);


        function createElementComplete(response) {
            
            var dataForModal = {
                headerText: 'Select an element',
                closeButtonText: 'Close',
                actionButtonText: 'OK'
            };

            var modalDefaults = {
                size: 'sm',
                component: 'modalWithTreeComponent',
                resolve: {
                    items: function() {
                        var elementMaps = [];
                        angular.forEach(response.elementMaps, function(elementMap) {
                            elementMaps.push({ name: elementMap.elementMapId, children: [] });
                        });
                        return elementMaps;
                    },
                    labels: function() {
                        return dataForModal;
                    }
                }
            };

            modalService.showModal(modalDefaults).then(showModalComplete, showModalFailed);

            function showModalComplete(dataFromTree) {
                if(dataFromTree.selectedItem === undefined) {
                    return;
                }                        
                var gtCode = utilsFactory.generateGt(vm.guide);
                var element = {
                    id: gtCode,
                    path: response.elementMaps[dataFromTree.selectedItem.name].path,
                    name: dataFromTree.selectedItem.name
                };
                var archetypeBindingIndex = vm.guide.definition.archetypeBindings.indexOf(archetypeBinding);
                vm.guide.definition.archetypeBindings[archetypeBindingIndex].elements.push(element);
                // FIXME: Where can I get the thext anf description?
                var term = {
                    id: gtCode,
                    text: "createElement text",
                    description: 'createElement description'
                }
                var language = 'en';
                var ontology = guidelineFactory.getOntology();
                ontology.termDefinitions[language].terms[gtCode] = term;    
            }

            function showModalFailed() {
                $log.info('Modal dismissed at: ' + new Date() + ' in createElement');
            }
            
        }

        function createElementFailed(error) {
            $log.info('Error at getting archetype in getArchetype - createElement: ' + error);
        }
    }

    function updateLeftItem(node) {

        var archetypeBinding = node.$nodeScope.$parentNodeScope.$modelValue;
        var elementIndex = node.$nodeScope.$index;
        var element = node.$nodeScope.$modelValue;

        var archetype = guidelineFactory.getGuidelineArchetype(archetypeBinding.archetypeId);

        var dataForModal = {
            headerText: 'Select an element from "' + archetype.archetypeId + '"',
            closeButtonText: 'Close',
            actionButtonText: 'OK'
        };

        var modalOptions = {
            size: 'md',
            component: 'modalWithTreeComponent',
            resolve: {
                items: function () {
                    var elementMaps = [];
                    angular.forEach(archetype.elementMaps, function (elementMap) {
                        elementMap.viewText = elementMap.elementMapId;
                        elementMaps.push(elementMap);
                    });
                    return elementMaps;
                },
                labels: function () {
                    return dataForModal;
                }
            }
        };

        modalService.showModal(modalOptions).then(showModalComplete, showModalFailed);

        function showModalComplete(dataFromTree) {
            // if no item selected...
            if (dataFromTree.selectedItem === undefined) {
                return;
            }
            var archetypeBindingIndex = vm.guide.definition.archetypeBindings.indexOf(archetypeBinding);
            var elementToUpdate = vm.guide.definition.archetypeBindings[archetypeBindingIndex].elements[elementIndex];
            delete elementToUpdate.unselected;

            var path = dataFromTree.selectedItem.path;
            var name = dataFromTree.selectedItem.elementMapId;

            /*
             * BinaryExpression matches with PredicateAttribute, PredicateExists and PredicateExpression
             * UnaryExpression matches with PredicateFunction
             */
            if(element.type === "BinaryExpression") {
                elementToUpdate.expressionItem.left.expressionItem.path = path;
                elementToUpdate.expressionItem.left.expressionItem.name = name;
            } else if (element.type === "UnaryExpression") {
                elementToUpdate.expressionItem.operand.expressionItem.path = path;
                elementToUpdate.expressionItem.operand.expressionItem.name = name;
            } else {
                elementToUpdate.path = path;
                // FIXME: Where can I get the text and description?
                var language = 'en';
                if (!elementToUpdate.hasOwnProperty('id')) {
                    elementToUpdate.id = utilsFactory.generateGt(vm.guide);
                    vm.guide.ontology.termDefinitions[language].terms[elementToUpdate.id] = {};
                }
                vm.guide.ontology.termDefinitions[language].terms[elementToUpdate.id] = {
                    id: elementToUpdate.id,
                    text: $filter('removeUnderscore')(name),
                    description: name // TODO: Description?
                };
            }

        };

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in updateLeftItem');
        }
    }

    function updateRightItem(node) {

        var archetypeBinding = node.$nodeScope.$parentNodeScope.$modelValue;
        var elementIndex = node.$nodeScope.$index;
        var predicate = node.$nodeScope.$modelValue;
        var archetype = guidelineFactory.getGuidelineArchetype(archetypeBinding.archetypeId);
        if (definitionsFactory.getPredicateStatementType(predicate) === "PredicateDatavalue") {
            var data = definitionsFactory.getDataForModal(archetype, predicate);
            var options = definitionsFactory.getOptionsForModal(archetype, predicate);
        }

        modalService.showModal(options, data).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }

            var archetypeBindingIndex = vm.guide.definition.archetypeBindings.indexOf(archetypeBinding);
            var constantExpression = vm.guide.definition.archetypeBindings[archetypeBindingIndex].elements[elementIndex].expressionItem.right;

            if (modalResponse.data.type === DV.CODEDTEXT) {
                definitionsFactory.setCodedTextConstant(constantExpression, modalResponse);
            } else if(modalResponse.data.type === DV.TEXT) {
                definitionsFactory.setStringConstant(constantExpression, modalResponse);
            } else if (constantExpression.type === "CodePhraseConstant") {
                $log.info("CodePhraseText");
            }


            // FIXME: Where can I get the text and description?
            // FIXME: Fix term bindings
            //var language = 'en';
            //var ontology = guidelineFactory.getOntology();
            //ontology.termDefinitions[language].terms[elementToUpdate.id].text = "updateRightItem text";
            //ontology.termDefinitions[language].terms[elementToUpdate.id].description = "updateRightItem description";
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in updateRightItem');
        }

    }

    /**
     * Used to modify an archetype instantiation
     * @param archetypeBindingIndex
     */
    function updateArchetypesModal(archetypeBindingIndex) {

        archetypeFactory.getArchetypes().then(updateArchetypesComplete, updateArchetypesFailed);

        function updateArchetypesComplete(response) {

            var domains = [
                {name: "EHR", value: "EHR"},
                {name: "CDS", value: "CDS"},
                {name: "ANY", value: "ANY"}
            ];

            var dataForModal = {
                headerText: 'Select an archetype',
                closeButtonText: 'Close',
                actionButtonText: 'OK'
            };
            
            var modalDefaults = {
                size: 'md',
                component: 'modalWithTreeComponent',
                resolve: {
                    items: function() {
                        var archetypes = [];
                        angular.forEach(response, function(archetype, key) {
                            item = {
                                id: key,
                                name: archetype,
                                children: []
                            };
                            archetypes.push(item);
                        });
                        return archetypes;
                    },
                    labels: function() {
                        return dataForModal;
                    },
                    domains: function() {
                        return domains;
                    }
                }
            };

            modalService.showModal(modalDefaults).then(showModalComplete, showModalFailed);

            function showModalComplete(dataFromTree) {

                if(dataFromTree.selectedItem === undefined) {
                    return;
                }

                archetypeFactory.getArchetype(dataFromTree.selectedItem.name).then(updateArchetypeComplete, updateArchetypeFailed);

                function updateArchetypeComplete(response) {

                    guidelineFactory.setGuidelineArchetype(response);
                    
                    vm.guide.definition.archetypeBindings[archetypeBindingIndex] = {
                        archetypeId: response.archetypeId,
                        elements: [],
                        predicates: [],
                        domain: dataFromTree.domain,
                        id: vm.guide.definition.archetypeBindings[archetypeBindingIndex].id || utilsFactory.generateGt(vm.guide)                        
                    };
                    
                    // FIXME: Where can I get the text and description?
                    var language = 'en';
                    var ontology = guidelineFactory.getOntology();
                    ontology.termDefinitions[language].terms[vm.guide.definition.archetypeBindings[archetypeBindingIndex].id] = ontology.termDefinitions[language].terms[vm.guide.definition.archetypeBindings[archetypeBindingIndex].id] || {};
                    ontology.termDefinitions[language].terms[vm.guide.definition.archetypeBindings[archetypeBindingIndex].id] = {
                        id: vm.guide.definition.archetypeBindings[archetypeBindingIndex].id,
                        text: "updateArchetypesModal text",
                        description: "updateArchetypesModal description"
                    }
                }

                function updateArchetypeFailed(error) {
                    $log.info('Error at getting archetype in getArchetype - updateArchetypesModal: ' + error);
                }

            }

            function showModalFailed() {
                $log.info('Modal dismissed at: ' + new Date() + ' in updateArchetypesModal');
            }
            
        }

        function updateArchetypesFailed(error) {
            $log.info('Error at getting the list of archetypes in getArchetypes - updateArchetypesModal: ' + error);
        }
    }

    function openExpression(node) {

        var archetypeBinding = node.$nodeScope.$parentNodeScope.$modelValue;
        var archetypeBindingIndex = node.$nodeScope.$parentNodeScope.$parent.$index;
        var elementIndex = node.$nodeScope.$index;

        var expression = node.$nodeScope.$modelValue.expression;
        var dataForModal = {
            headerText: 'Enter expression',
            closeButtonText: 'Close',
            actionButtonText: 'OK'
        };

        var defaults = {
            component: 'modalWithTextareaComponent',
            templateUrl: '',
            resolve: {
                labels: function() {
                    return dataForModal;
                },
                expression: function() {
                    return expression;
                }
            }
        }

        modalService.showModal(defaults).then(showModalComplete, showModalFailed);
        function showModalComplete(response) {
            vm.guide.definition.archetypeBindings[archetypeBindingIndex].elements[elementIndex].expression = response;
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in openExpression()');
        }
    }

}
