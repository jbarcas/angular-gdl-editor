/**
 * Created by jbarros on 11/05/15.
 */

angular.module('app.controllers', [])
    .controller('DefinitionsCtrl', DefinitionsCtrl);


function DefinitionsCtrl($log, $filter, archetypeFactory, utilsFactory, guidelineFactory, modalService) {

    vm = this;

    vm.guide = {};
    vm.guide.definition = guidelineFactory.getDefinition();
    vm.destNode = {};
    vm.sourceNode = {};

    vm.removeArchetype = removeArchetype;
    vm.removeElement = removeElement;
    vm.createElement = createElement;
    vm.updateElementsModal = updateElementsModal;
    vm.updatePredicateFunctionModal = updatePredicateFunctionModal;

    vm.updateLeftItem = updateLeftItem;
    vm.updateRightItem = updateRightItem;
    vm.updateArchetypesModal = updateArchetypesModal;

    vm.delete = "../assets/img/del.png";
    vm.add = "../assets/img/add.png";

    vm.list = [
        {title: 'Archetype instantiation', archetypeId: 'Select an archetype', type: "ArchetypeInstantiation", draggable: true},
        {title: 'Element instantiation', type: "element", draggable: true},
        {title: 'Predicate (DataValue)', type: "BinaryExpression", draggable: true},
        {title: 'Predicate (Function)', type: "UnaryExpression", draggable: true},
        {title: 'Predicate (Exists)', draggable: false},
        {title: 'Predicate (Expression)', draggable: false}
    ];

    vm.predicateFunctionOptions = [
        'MAX', 'MIN'
    ];

    vm.predicateDataValueOptions = [
        '==', 'IS_A', '>=', '<='
    ];

    /*
     * Options to manage the drag and drop nested level
     */
    vm.treeOptions = {
        accept: function (sourceNodeScope, destNodesScope) {
            vm.sourceNode = sourceNodeScope;
            vm.destNode = destNodesScope;
            return (sourceNodeScope.depth() === 2 && destNodesScope.depth() === 1) ||
                   (sourceNodeScope.$modelValue.type === "ArchetypeInstantiation" && destNodesScope.depth() === 0) ||
                   (sourceNodeScope.$modelValue.type === "element" && destNodesScope.depth() === 1)   ||
                   (sourceNodeScope.$modelValue.type === "UnaryExpression" && destNodesScope.depth() === 1)   ||
                   (sourceNodeScope.$modelValue.type === "BinaryExpression" && destNodesScope.depth() === 1)

        }
    };

    vm.treeDefinitions = {
        /**
         * Transforms the model before dragging
         * @param event
         */
        beforeDrop: function (event) {
            if(event.source.cloneModel.type === "element") {
                event.source.cloneModel.name = "Select an element";
                event.source.cloneModel.id = utilsFactory.generateGt(vm.guide);
            } else if (event.source.cloneModel.type === "UnaryExpression") {
                event.source.cloneModel.expressionItem = {};
                event.source.cloneModel.expressionItem.operand = {};
                event.source.cloneModel.expressionItem.operand.type = "Variable";
                event.source.cloneModel.expressionItem.operand.expressionItem = {};
                event.source.cloneModel.expressionItem.operand.expressionItem.name = "Element";
                event.source.cloneModel.expressionItem.operator = "MAX";
            } else if (event.source.cloneModel.type === "BinaryExpression") {
                event.source.cloneModel.expressionItem = {};

                event.source.cloneModel.expressionItem.left = {};
                event.source.cloneModel.expressionItem.left.type = "Variable";
                event.source.cloneModel.expressionItem.left.expressionItem = {};
                event.source.cloneModel.expressionItem.left.expressionItem.name = "Select element";

                event.source.cloneModel.expressionItem.right = {};
                event.source.cloneModel.expressionItem.right.type = "CodedTextConstant";
                event.source.cloneModel.expressionItem.right.expressionItem = {};
                event.source.cloneModel.expressionItem.right.expressionItem.codedText = {};
                event.source.cloneModel.expressionItem.right.expressionItem.codedText.value = "Select DataValue";

                event.source.cloneModel.expressionItem.operator = "IS_A";

            }
            delete event.source.cloneModel.draggable;
            delete event.source.cloneModel.title;
        }
    };


    function getPredicateStatementPath(predicateStatement) {
        var path;
        switch (predicateStatement.type) {
            case "UnaryExpression":
                path = predicateStatement.expressionItem.operand.expressionItem.path;
                break;
            case "BinaryExpression":
                path = predicateStatement.expressionItem.left.expressionItem.path
                break;
            default:
                path = null
        }
        return path;
    }

    function isPredicateDataValue(predicateStatement) {
        return predicateStatement.type === "BinaryExpression";
    }

    function isPredicateFunction(predicateStatement) {
        return predicateStatement.type === "UnaryExpression";
    }


    if (vm.guide.definition) {

        // converts the elements
        angular.forEach(vm.guide.definition.archetypeBindings, function (archetypeBinding) {
            if (archetypeBinding.elements) {
                archetypeBinding.elements = elementsToArray(archetypeBinding);
            }
            angular.forEach(archetypeBinding.predicateStatements, function (predicateStatement) {
                var path = getPredicateStatementPath(predicateStatement);
                var name = guidelineFactory.getElementName(archetypeBinding.archetypeId, path);

                if (isPredicateFunction(predicateStatement)) {
                    predicateStatement.expressionItem.operand.expressionItem.name = name;
                }
                if (isPredicateDataValue(predicateStatement)) {
                    predicateStatement.expressionItem.left.expressionItem.name = name;
                }
                archetypeBinding.elements.push(predicateStatement);

            })
            // Clear the predicateStatements
            archetypeBinding.predicateStatements = [];

        });

        // converts the archetypeBindings
        vm.guide.definition.archetypeBindings = objectToArray(vm.guide.definition.archetypeBindings);

    }

    /**
     * Converts the model to the one necessary for the tree component
     * @param object the object to convert
     * @param isElement Indicates whether the object is an element or not
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


    function elementsToArray(object) {
        var array = [];
        angular.forEach(object.elements, function(index, element) {
            if (object.elements.hasOwnProperty(element)) {
                if (object.elements[element].type == 'UnaryExpression') {
                    object.elements[element].type = 'UnaryExpression';
                } else if (object.elements[element].type == 'BinaryExpression') {
                    object.elements[element].type = 'BinaryExpression';
                } else {
                    object.elements[element].type = 'element';
                }
                object.elements[element].name = guidelineFactory.getElementName(object.archetypeId, object.elements[element].path);
                array.push(object.elements[element]);
            }
        });
        return array;
    }


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

    }


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
    }


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

    function updateElementsModal(archetypeBinding, element, elementIndex) {      
        
        archetypeFactory.getArchetype(archetypeBinding.archetypeId).then(updateElementComplete, updateElementFailed);

        function updateElementComplete(response) {

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
                elementToUpdate.path = dataFromTree.selectedItem.path;
                elementToUpdate.name = dataFromTree.selectedItem.name;

                // FIXME: Where can I get the thext anf description?
                var ontology = guidelineFactory.getOntology();
                var language = 'en';
                if (!elementToUpdate.hasOwnProperty('id')) {
                    elementToUpdate.id = utilsFactory.generateGt(vm.guide);
                    ontology.termDefinitions[language].terms[elementToUpdate.id] = {};
                }

                ontology.termDefinitions[language].terms[elementToUpdate.id] = {
                    text: 'updateElementsModal text',
                    description: 'updateElementsModal description'
                };
            };

            function showModalFailed() {
                $log.info('Modal dismissed at: ' + new Date() + ' in updateElementsModal');
            }
            
        }

        function updateElementFailed(error) {
            $log.info('Error at getting archetype in getArchetype - updateElementsModal: ' + error);
        }

    }

    function updatePredicateFunctionModal(archetypeBinding, element, elementIndex) {

        archetypeFactory.getArchetype(archetypeBinding.archetypeId).then(updatePredicateFunctionComplete, updatePredicateFunctionFailed);

        function updatePredicateFunctionComplete(response) {

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

                elementToUpdate.expressionItem.operand.expressionItem.path = dataFromTree.selectedItem.path;
                elementToUpdate.expressionItem.operand.expressionItem.name = dataFromTree.selectedItem.name;

                // FIXME: Where can I get the text and description?
                // FIXME: Fix term bindings
                //var language = 'en';
                //var ontology = guidelineFactory.getOntology();
                //ontology.termDefinitions[language].terms[elementToUpdate.id].text = "updateElementsModal text";
                //ontology.termDefinitions[language].terms[elementToUpdate.id].description = "updateElementsModal description";
            }

            function showModalFailed() {
                $log.info('Modal dismissed at: ' + new Date() + ' in updateElementsModal');
            }

        }

        function updatePredicateFunctionFailed(error) {
            $log.info('Error at getting archetype in getArchetype - updateElementsModal: ' + error);
        }

    };

    function updateLeftItem(archetypeBinding, element, elementIndex) {

        archetypeFactory.getArchetype(archetypeBinding.archetypeId).then(updatePredicateFunctionComplete, updatePrefucateFunctionFailed);

        function updatePredicateFunctionComplete(response) {

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

                elementToUpdate.expressionItem.left.expressionItem.path = dataFromTree.selectedItem.path;
                elementToUpdate.expressionItem.left.expressionItem.name = dataFromTree.selectedItem.name;

                // FIXME: Where can I get the text and description?
                // FIXME: Fix term bindings
                //var language = 'en';
                //var ontology = guidelineFactory.getOntology();
                //ontology.termDefinitions[language].terms[elementToUpdate.id].text = "updateElementsModal text";
                //ontology.termDefinitions[language].terms[elementToUpdate.id].description = "updateElementsModal description";
            }

            function showModalFailed() {
                $log.info('Modal dismissed at: ' + new Date() + ' in updateElementsModal');
            }

        }

        function updatePrefucateFunctionFailed(error) {
            $log.info('Error at getting archetype in getArchetype - updateElementsModal: ' + error);
        }

    }

    function compare(a,b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }

    function updateRightItem(archetypeBinding, element, elementIndex) {

            var dataForModal = {
                headerText: 'Select a local term',
                closeButtonText: 'Close',
                actionButtonText: 'OK'
            };

            var modalDefaults = {
                size: 'md',
                component: 'modalWithTreeComponent',
                resolve: {
                    items: function() {
                        var terms = guidelineFactory.getOntology().termDefinitions.en.terms;
                        var modalItems = [];
                        angular.forEach(terms, function(term) {
                            modalItems.push({ name: term.id + " - " + term.text, code: term.id, children: [] });
                        });
                        modalItems = modalItems.sort(compare);
                        return modalItems;
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

                dataFromTree.selectedItem.name = dataFromTree.selectedItem.name.replace(dataFromTree.selectedItem.code + " - ", "");

                var archetypeBindingIndex = vm.guide.definition.archetypeBindings.indexOf(archetypeBinding);
                var elementToUpdate =  vm.guide.definition.archetypeBindings[archetypeBindingIndex].elements[elementIndex];

                if(elementToUpdate.expressionItem.right.type === "CodedTextConstant") {
                    elementToUpdate.expressionItem.right.expressionItem.codedText.value = dataFromTree.selectedItem.name;
                    if(!elementToUpdate.expressionItem.right.expressionItem.codedText.definingCode) {
                        elementToUpdate.expressionItem.right.expressionItem.codedText.definingCode = {};
                        elementToUpdate.expressionItem.right.expressionItem.codedText.definingCode.terminologyId = {};
                    }
                    elementToUpdate.expressionItem.right.expressionItem.codedText.definingCode.codeString = dataFromTree.selectedItem.code;
                    // TODO: terminology id set as local::local. Allow other terminologies
                    elementToUpdate.expressionItem.right.expressionItem.codedText.definingCode.terminologyId.name = "local";
                    elementToUpdate.expressionItem.right.expressionItem.codedText.definingCode.terminologyId.value = "local";
                    elementToUpdate.expressionItem.right.expressionItem.name = dataFromTree.selectedItem.name;
                    elementToUpdate.expressionItem.right.expressionItem.value =
                        elementToUpdate.expressionItem.right.expressionItem.codedText.definingCode.terminologyId.value
                    + "::" + elementToUpdate.expressionItem.right.expressionItem.codedText.definingCode.codeString + "|"
                    + elementToUpdate.expressionItem.right.expressionItem.codedText.value;

                }


                // FIXME: Where can I get the text and description?
                // FIXME: Fix term bindings
                //var language = 'en';
                //var ontology = guidelineFactory.getOntology();
                //ontology.termDefinitions[language].terms[elementToUpdate.id].text = "updateElementsModal text";
                //ontology.termDefinitions[language].terms[elementToUpdate.id].description = "updateElementsModal description";
            }

            function showModalFailed() {
                $log.info('Modal dismissed at: ' + new Date() + ' in updateElementsModal');
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

}
