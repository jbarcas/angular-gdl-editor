/**
 * Created by jbarros on 11/05/15.
 */

angular.module('app.controllers', [])
    .controller('DefinitionsCtrl', DefinitionsCtrl);


function DefinitionsCtrl($uibModal, $log, archetypeFactory, utilsFactory, guidelineFactory, modalService) {

    vm = this;

    vm.guide = {};
    vm.guide.definition = guidelineFactory.getDefinition();

    vm.removeArchetype = removeArchetype;
    vm.removeElement = removeElement;
    vm.createElement = createElement;
    vm.updateElementsModal = updateElementsModal;
    vm.updateArchetypesModal = updateArchetypesModal;

    vm.delete = "../assets/img/del.png";
    vm.add = "../assets/img/add.png";

    vm.list = [
        {'title': 'Archetype instantiation', 'archetypeId': 'Select an archetype'},
        {'title': 'Element instantiation'},
        {'title': 'Predicate (DataValue)'},
        {'title': 'Predicate (Function)'},
        {'title': 'Predicate (Exists)'},
        {'title': 'Predicate (Expression)'}
    ]

    /*
     * Options to manage the drag and drop nested level
     */
    vm.treeOptions = {
        accept: function (sourceNodeScope, destNodesScope) {
            return (sourceNodeScope.depth() === 2 && destNodesScope.depth() === 1) || (sourceNodeScope.depth() === 1 && destNodesScope.depth() === 0)
        }
    };


    if(vm.guide.definition) {
        vm.guide.definition.archetypeBindings = convertArchetypeBindings(vm.guide.definition.archetypeBindings);        
    }

    function convertArchetypeBindings(archetypeBindings) {

        var archetypeBindingsArray = Object.keys(archetypeBindings).map(function (key) {
            archetypeBindings[key].elements = getElements(archetypeBindings[key]);
            return archetypeBindings[key];
        });
        vm.guide.definition.archetypeBindings = archetypeBindingsArray;
        return archetypeBindingsArray;
    }

    function getElements(archetypeBinding) {
        var elements = archetypeBinding.elements;
        var predicates = archetypeBinding.predicateStatements;
        var archetypeId = archetypeBinding.archetypeId;
        if (elements == null) {
            return [];
        }
        /*
         * Converts the object into the desired array
         */
        var elementsArray = Object.keys(elements).map(function (key) {
            /*
             * Create "name" property used to map the element path with its name
             */
            archetypeFactory.getArchetype(archetypeId).then(
                function (data) {
                    angular.forEach(data.elementMaps, function (elementMap) {
                        if (elementMap.path === elements[key].path) {
                            elements[key].name = elementMap.elementMapId;
                        }
                    })
                },
                function (err) {
                    console.log('Error at getting archetype: ' + err);
                }
            );
            return elements[key];
        });

        /*
         * Create the 'name' property in the predicates to map the element path with its name
         */
        angular.forEach(predicates, function(predicate) {
            if(predicate.type === "UnaryExpression") {
                archetypeFactory.getElementName(archetypeId, predicate.expressionItem.operand.expressionItem.path).then(
                    function(response) {
                        console.log(response);
                    },
                    function(error) {
                        $log.info('Error at getting element name in getElements(): ' + error);
                    }
                )
            }
        })

        return elementsArray;
    };

    function removeArchetype(scope) {
        var unused = true;
        
        angular.forEach(scope.$modelValue.elements, function (element) {
            if (existsInRules(element) || existsInPreconditions(element)) {
                unused = false;
            }
        });

        unused ? scope.remove() : showModal();

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

    };


    /*
     * Removes an archetype element (if it is possible due to element usage)
     */
    function removeElement(scope) {

        var element = scope.$modelValue;

        if (existsInRules(element) || existsInPreconditions(element)) {
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
    };


    /*
     * Checks if the element is being used in the rules
     */
    var existsInRules = function (element) {

        var rules = vm.guide.definition.rules;

        if (Object.keys(rules).indexOf(element.id) !== -1) {
            return true;
        }

        for (var index in rules) {
            var rule = rules[index];
            for (var i = 0; i < rule.then.length; i++) {
                var item = rule.then[i];
                if (item.indexOf(element.id) > -1) {
                    return true;
                }
            }
            for (var i = 0; i < rule.when.length; i++) {
                var item = rule.when[i];
                if (item.indexOf(element.id) > -1) {
                    return true;
                }
            }
        }

        return false;
    };

    /*
     * Checks if the element is being used in the preconditions
     */
    var existsInPreconditions = function (element) {
        var result = false;
        angular.forEach(vm.guide.definition.preConditions, function (item) {
            if (item.indexOf(element.id) > -1) {
                result = true;
            }
        });
        return result;
    };

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
            }

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
            };

            function showModalFailed() {
                $log.info('Modal dismissed at: ' + new Date() + ' in createElement');
            }
            
        };

        function createElementFailed(error) {
            $log.info('Error at getting archetype in getArchetype - createElement: ' + error);
        }
        

    };

    function updateElementsModal(archetypeBinding, element, elementIndex) {      
        
        archetypeFactory.getArchetype(archetypeBinding.archetypeId).then(updateElementComplete, updateElementFailed);

        function updateElementComplete(response) {

            var dataForModal = {
                headerText: 'Select an element',
                closeButtonText: 'Close',
                actionButtonText: 'OK'
            }              
            
            var modalDefaults = {
                size: 'sm',
                component: 'modalWithTreeComponent',
                resolve: {
                    items: function() {
                        var elementMaps = [];
                        angular.forEach(response.elementMaps, function(elementMap) {
                            elementMaps.push({ name: elementMap.elementMapId, path: elementMap.path, children: [] });
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
                console.log(elementIndex);
                if(dataFromTree.selectedItem === undefined) {
                    return;
                }                        

                var archetypeBindingIndex = vm.guide.definition.archetypeBindings.indexOf(archetypeBinding);
                var elementToUpdate =  vm.guide.definition.archetypeBindings[archetypeBindingIndex].elements[elementIndex];
                elementToUpdate.path = element.path;
                elementToUpdate.name = dataFromTree.selectedItem.name;

                // FIXME: Where can I get the thext anf description?
                var language = 'en';
                var ontology = guidelineFactory.getOntology();
                ontology.termDefinitions[language].terms[elementToUpdate.id].text = "updateElementsModal text";
                ontology.termDefinitions[language].terms[elementToUpdate.id].description = "updateElementsModal description";
            };

            function showModalFailed() {
                $log.info('Modal dismissed at: ' + new Date() + ' in updateElementsModal');
            }
            
        };

        function updateElementFailed(error) {
            $log.info('Error at getting archetype in getArchetype - updateElementsModal: ' + error);
        }

    };

    /**
     * Used to modify an archetype instantiation
     * @param node
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
            }         
            
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
                            }
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
                    
                    vm.guide.definition.archetypeBindings[archetypeBindingIndex] = {
                        archetypeId: response.archetypeId,
                        elements: [],
                        predicates: [],
                        domain: dataFromTree.domain,
                        id: vm.guide.definition.archetypeBindings[archetypeBindingIndex].id || utilsFactory.generateGt(vm.guide)                        
                    }
                    
                    // FIXME: Where can I get the thext anf description?
                    var language = 'en';
                    var ontology = guidelineFactory.getOntology();
                    ontology.termDefinitions[language].terms[vm.guide.definition.archetypeBindings[archetypeBindingIndex].id] = ontology.termDefinitions[language].terms[vm.guide.definition.archetypeBindings[archetypeBindingIndex].id] || {};
                    ontology.termDefinitions[language].terms[vm.guide.definition.archetypeBindings[archetypeBindingIndex].id] = {
                        id: vm.guide.definition.archetypeBindings[archetypeBindingIndex].id,
                        text: "updateArchetypesModal text",
                        description: "updateArchetypesModal description"
                    }
                };

                function updateArchetypeFailed(error) {
                    $log.info('Error at getting archetype in getArchetype - updateArchetypesModal: ' + error);
                }

            };

            function showModalFailed() {
                $log.info('Modal dismissed at: ' + new Date() + ' in updateArchetypesModal');
            }
            
        };

        function updateArchetypesFailed(error) {
            $log.info('Error at getting the list of archetypes in getArchetypes - updateArchetypesModal: ' + error);
        }

    };

}
