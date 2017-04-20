/**
 * Created by jbarros on 11/05/15.
 */

angular.module('app.controllers', [])
    .controller('DefinitionsCtrl', DefinitionsCtrl);


function DefinitionsCtrl($log, $filter, archetypeFactory, utilsFactory, guidelineFactory, definitionsFactory, terminologyFactory, modalService, DV, ATTRIBUTES) {

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
    vm.updateArchetype = updateArchetype;
    vm.openExpression = openExpression;

    vm.showLeftName = showLeftName;
    vm.showRightName = showRightName;
    vm.getAttribute = getAttribute;
    vm.getPredicateOptions = getPredicateOptions;
    vm.getText = getText;
    vm.getTextDebug = getTextDebug;

    vm.openEditor = openEditor;

    vm.showOptions = showOptions;

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

    var predicateFunctionOptions = [
        {label: 'MAX', value: 'MAX'},
        {label: 'MIN', value: 'MIN'}
    ];

    var predicateExistsOptions = [
        {label: 'exists', value: 'INEQUAL'},
        {label: 'does not exist', value: 'EQUALITY'}
    ];

    var predicateExpressionOptions = [
        {label: '==', value: 'EQUALITY'},
        {label: '>=', value: 'GREATER_THAN_OR_EQUAL'},
        {label: '<=', value: 'LESS_THAN_OR_EQUAL'}
    ];

    var predicateDataValueOptions = [
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
        beforeDrop: function(event) {
            var cloneModel = event.source.cloneModel;
            cloneModel.unselected = true;
            if(cloneModel.title === "Archetype instantiation") {
                definitionsFactory.createArchetypeInstantiation(cloneModel);
            } else if(cloneModel.title === "Element instantiation") {
                definitionsFactory.createElementInstantiation(cloneModel);
            } else if (cloneModel.ruleLine === "PredicateDatavalue") {
                definitionsFactory.createPredicateDatavalue(cloneModel);
            } else if (cloneModel.ruleLine === "PredicateFunction") {
                definitionsFactory.createPredicateFunction(cloneModel);
            } else if (cloneModel.ruleLine === "PredicateExists") {
                definitionsFactory.createPredicateExists(cloneModel);
            } else if (cloneModel.ruleLine === "PredicateExpression") {
                definitionsFactory.createPredicateExpression(cloneModel);
            }
            delete cloneModel.ruleLine;
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
            /**
             * Remove the archetype from the service
             */
            guidelineFactory.deleteGuidelineArchetype(archetype.archetypeId);
            /**
             * Remove the terms from the service
             */
            guidelineFactory.removeTerm(archetype.archetypeId);
            scope.remove();
        } else {
            showModal();
        }

        function showModal() {
            var modalDefaults = {size: 'sm'};

            var modalOptions = {
                headerText: 'Warning!',
                bodyText: 'The archetype you are trying to delete is being used. These references must be deleted before proceeding.'
            };
            modalService.showModal(modalDefaults, modalOptions);            
        }
    }


    /**
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
            var modalDefaults = {size: 'sm'};

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
        
        //archetypeFactory.getArchetype(archetypeBinding.archetypeId).then(createElementComplete, createElementFailed);

        var archetype = guidelineFactory.getGuidelineArchetype(archetypeBinding.archetypeId);
            
            var modalData = {headerText: 'Select an element'};

            var modalOptions = {
                component: 'modalWithTreeComponent',
                resolve: {
                    items: function() {
                        var elementMaps = [];
                        angular.forEach(archetype.elementMaps, function(elementMap) {
                            elementMap.viewText = elementMap.elementMapId;
                            elementMaps.push(elementMap);
                        });
                        return elementMaps;
                    },
                    labels: function() {
                        return dataForModal;
                    }
                }
            };

            modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

            function showModalComplete(dataFromTree) {
                if(dataFromTree.data.selectedItem === undefined) {
                    return;
                }                        
                var gtCode = utilsFactory.generateGt(vm.guide);
                var path = dataFromTree.data.selectedItem.path;
                var name = dataFromTree.data.selectedItem.elementMapId;
                var atCode = path.substring(path.lastIndexOf("[") + 1, path.lastIndexOf("]"));

                var element = {
                    id: gtCode,
                    path: path
                };
                var archetypeBindingIndex = vm.guide.definition.archetypeBindings.indexOf(archetypeBinding);
                vm.guide.definition.archetypeBindings[archetypeBindingIndex].elements.push(element);
                // FIXME: Where can I get the thext anf description?
                var term = {
                    id: gtCode,
                    text: $filter('removeUnderscore')(name),
                    description:  guidelineFactory.getTermDescription(archetype.archetypeId, atCode)
                };
                var language = 'en';
                var ontology = guidelineFactory.getOntology();
                ontology.termDefinitions[language].terms[gtCode] = term;
            }

            function showModalFailed() {
                $log.info('Modal dismissed at: ' + new Date() + ' in createElement');
            }

    }

    function updateLeftItem(node) {

        var archetypeBinding = node.$nodeScope.$parentNodeScope.$modelValue;
        var elementIndex = node.$nodeScope.$index;
        var element = node.$nodeScope.$modelValue;

        var type = definitionsFactory.getPredicateStatementType(element);

        var archetype = guidelineFactory.getGuidelineArchetype(archetypeBinding.archetypeId);

        var modalData = {headerText: 'Select an element from "' + archetype.archetypeId + '"'};


        var modalOptions = {
                component: 'modalWithTreeComponent',
                resolve: {
                    items: function () {
                        var elementMaps = [];
                        angular.forEach(archetype.elementMaps, function (elementMap) {
                            var treeObject = angular.copy(elementMap);
                            treeObject.viewText = elementMap.elementMapId;
                            // TODO: add css to leaf nodes
                            if(type === "PredicateExpression") {
                                treeObject.children = ATTRIBUTES[treeObject.dataType];
                            }
                            elementMaps.push(treeObject);
                        });
                        return elementMaps;
                    },
                    labels: function () {
                        return modalData;
                    }
                }
            };

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete(dataFromTree) {
            // if no item selected...
            if (dataFromTree.data.selectedItem === undefined) {
                return;
            }

            var archetypeBindingIndex = vm.guide.definition.archetypeBindings.indexOf(archetypeBinding);

            var elementToUpdate = vm.guide.definition.archetypeBindings[archetypeBindingIndex].elements[elementIndex];
            delete elementToUpdate.unselected;

            var selectedItem;
            var path;
            if(type === "PredicateExpression") {
                selectedItem = dataFromTree.data.selectedItem.parent;
                path = selectedItem.path + "/value/" + dataFromTree.data.selectedItem.viewText;
            } else {
                selectedItem = dataFromTree.data.selectedItem;
                path = selectedItem.path;
            }

            var name = selectedItem.elementMapId;
            var atCode = path.substring(path.lastIndexOf("[") + 1, path.lastIndexOf("]"));

            /*
             * BinaryExpression matches with PredicateAttribute, PredicateExists and PredicateExpression
             * UnaryExpression matches with PredicateFunction
             */
            if(element.type === "BinaryExpression") {
                elementToUpdate.expressionItem.left.expressionItem.path = path;
            } else if (element.type === "UnaryExpression") {
                elementToUpdate.expressionItem.operand.expressionItem.path = path;
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
                    description: guidelineFactory.getTermDescription(archetype.archetypeId, atCode)
                };
            }

        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in updateLeftItem');
        }
    }

    function openExpression(node) {
        var archetypeBindingIndex = node.$nodeScope.$parentNodeScope.$index;
        var elementIndex = node.$nodeScope.$index;

        var expression = node.$nodeScope.$modelValue.expression;
        var dataForModal = {headerText: 'Enter expression'};

        var defaults = {
            component: 'modalWithTextareaComponent',
            resolve: {
                labels: function() {
                    return dataForModal;
                },
                expression: function() {
                    return expression;
                }
            }
        };

        modalService.showModal(defaults).then(showModalComplete, showModalFailed);
        function showModalComplete(response) {
            vm.guide.definition.archetypeBindings[archetypeBindingIndex].elements[elementIndex].expression = response;
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in openExpression()');
        }
    }

    function updateRightItem(node) {

        var archetypeBinding = node.$nodeScope.$parentNodeScope.$modelValue;
        var elementIndex = node.$nodeScope.$index;
        var predicate = node.$nodeScope.$modelValue;
        var archetype = guidelineFactory.getGuidelineArchetype(archetypeBinding.archetypeId);
        var isHierarchy = predicate.expressionItem.operator === "IS_A";

        /**
         * If the left item has not been selected yet
         */
        if(!predicate.expressionItem.left.expressionItem.path) {
            var modalData = {headerText: 'Select an element', bodyText: 'You have to select an element before choosing a data value'};
            var modalOptions = {component: 'dialogComponent'};
            modalService.showModal(modalOptions, modalData);
            return;
        }

        /**
         * If the Predicate Statement is a Predicate Expression, the expression editor is opened
         */
        var type = definitionsFactory.getPredicateStatementType(predicate);
        if (type === "PredicateExpression") {
            openEditor(node);
            return;
        }

        var data = definitionsFactory.getDataForModal(archetype, predicate);
        var options = definitionsFactory.getOptionsForModal(archetype, predicate);

        modalService.showModal(options, data).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }

            var archetypeBindingIndex = vm.guide.definition.archetypeBindings.indexOf(archetypeBinding);
            var constantExpression = vm.guide.definition.archetypeBindings[archetypeBindingIndex].elements[elementIndex].expressionItem.right;

            if (modalResponse.data.type === DV.CODEDTEXT || isHierarchy) {
                definitionsFactory.setCodedTextConstant(constantExpression, modalResponse);
            } else if(modalResponse.data.type === DV.TEXT) {
                definitionsFactory.setStringConstant(constantExpression, modalResponse);
            } else if(modalResponse.data.type === DV.QUANTITY) {
                definitionsFactory.setQuantityConstant(constantExpression, modalResponse);
            } else if(modalResponse.data.type === DV.DATETIME) {
                definitionsFactory.setDateTimeConstant(constantExpression, modalResponse);
            } else if(modalResponse.data.type === DV.ORDINAL) {
                definitionsFactory.setOrdinalConstant(constantExpression, modalResponse);
            } else if (constantExpression.type === "CodePhraseConstant") {
                $log.info("CodePhraseText");
            } else if(definitionsFactory.getPredicateStatementType(predicate) === "PredicateExpression") {
                vm.guide.definition.archetypeBindings[archetypeBindingIndex].elements[elementIndex].expression = modalResponse.data;
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
     * Modifies an archetype instantiation
     * @param archetypeBindingIndex
     */
    function updateArchetype(archetype) {

        var archetypeBindingIndex = archetype.$nodeScope.$index;
        var archetypeBinding = archetype.$nodeScope.$modelValue;
        var archetypeId = archetypeBinding.archetypeId;

        archetypeFactory.getArchetypes().then(updateArchetypesComplete, updateArchetypesFailed);

        function updateArchetypesComplete(response) {

            var domains = [
                {name: "EHR", value: "EHR"},
                {name: "CDS", value: "CDS"},
                {name: "ANY", value: "ANY"}
            ];

            var dataForModal = {
                headerText: 'Select an archetype'
            };
            
            var modalDefaults = {
                component: 'modalWithTreeComponent',
                resolve: {
                    items: function() {
                        var archetypes = [];
                        angular.forEach(response, function(archetypeId) {
                            archetypes.push({viewText: archetypeId, dataType: utilsFactory.getArchetypeType(archetypeId)});
                        });
                        return archetypes;
                    },
                    domains: function() {
                        return domains;
                    }
                }
            };

            modalService.showModal(modalDefaults, dataForModal).then(showModalComplete, showModalFailed);

            function showModalComplete(dataFromTree) {

                if(dataFromTree.data.selectedItem === undefined) {
                    return;
                }

                archetypeFactory.getArchetype(dataFromTree.data.selectedItem.viewText).then(updateArchetypeComplete, updateArchetypeFailed);

                function updateArchetypeComplete(response) {

                    /**
                     * Remove the archetype from the service
                     */
                    guidelineFactory.deleteGuidelineArchetype(archetypeId);

                    /**
                     * Save the archetype in the service so that we have not to request it constantly
                     */
                    guidelineFactory.setGuidelineArchetype(response);

                    /**
                     * Remove the terms from the service
                     */
                    guidelineFactory.removeTerm(archetypeId);

                    /**
                     * Add the terms to the service
                     */
                    terminologyFactory.getTerms(response.archetypeId).then(function(data) {
                        guidelineFactory.addTerm(response.archetypeId, data);
                    });


                    /**
                     * Replace the archetype binding
                     * @type {{archetypeId: (string|*), elements: Array, predicates: Array, domain: *, id: *}}
                     */
                    vm.guide.definition.archetypeBindings[archetypeBindingIndex] = {
                        id: vm.guide.definition.archetypeBindings[archetypeBindingIndex].id || utilsFactory.generateGt(vm.guide),
                        archetypeId: response.archetypeId,
                        domain: dataFromTree.data.domain,
                        elements: [],
                        predicates: [],
                        predicateStatements: []
                    };

                    console.log( vm.guide.definition.archetypeBindings);
                    //guidelineFactory.setArchetypeBindings(vm.guide.definition.archetypeBindings);


                    // TODO: Ontology: text and description?
                    /*var language = 'en';
                    var ontology = guidelineFactory.getOntology();
                    var termId = vm.guide.definition.archetypeBindings[archetypeBindingIndex].id;
                    vm.guide.ontology.termDefinitions[language].terms[termId] = ontology.termDefinitions[language].terms[termId] || {};
                    vm.guide.ontology.termDefinitions[language].terms[termId] = {id: termId}*/
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

    /**
     * On the flight, gets the name of the left part of a predicate statement
     * @param node
     * @returns {*}
     */
    function showLeftName(node) {
        /**
         * item may be an element or a predicate statement
         */
        var item = node.$modelValue;
        var archetypeId = node.$nodeScope.$parentNodeScope.$modelValue.archetypeId;
        var name;

        if(isPredicate(item)) {
            var expressionItem = node.$modelValue.expressionItem;
            name = definitionsFactory.getName(archetypeId, expressionItem);
        } else {
            /**
             * If the element has a path (it is not a new element) => Get its name from the ontology
             * If the element does not have a path (it is a new element) => Prompt the user for input a name
             */
            name = item.path ? vm.guide.ontology.termDefinitions.en.terms[item.id].text : "Select one";
        }
        return name;

    }

    function isPredicate(item) {
        return item.expressionItem;
    }

    function getAttribute(node) {
        if(definitionsFactory.getPredicateStatementType(node) !== "PredicateExpression") {
            return;
        }
        var path = node.expressionItem.left.expressionItem.path;
        var attribute = path.split(/\/value(.+)/)[1];
        return attribute.substring(1);
    }


    /**
     * Gets the predicate options to show in the combo box. It depends on the type of predicate statement
     * @param node
     * @returns {*}
     */
    function getPredicateOptions(node) {

        /**
         * If the node is an element, show no options
         */
        if(definitionsFactory.isElement(node)) {
            return;
        }

        var predicateStatementType = definitionsFactory.getPredicateStatementType(node);
        var options;
        if(predicateStatementType === "PredicateFunction") {
            options = predicateFunctionOptions;
        } else if(predicateStatementType === "PredicateExists") {
            options = predicateExistsOptions;
        } else if(predicateStatementType === "PredicateExpression") {
            options = predicateExpressionOptions;
        } else {
            options = predicateDataValueOptions;
        }
        return options;
    }

    /**
     * On the flight, gets the name of the right part of a predicate statement
     * @param node
     * @returns {*}
     */
    function showRightName(node) {
        var predicateStatement = node.$modelValue;
        var predicateStatementType = definitionsFactory.getPredicateStatementType(predicateStatement);
        var value;

        /**
         * If the node is an element, a predicate function or a predicate exists, then it has no right part.
         */
        if(definitionsFactory.isElement(predicateStatement) || predicateStatementType === "PredicateFunction" || predicateStatementType === "PredicateExists") {
            return;
        } else if(predicateStatementType === "PredicateExpression") {
            value = predicateStatement.expression;
        } else {
            value = predicateStatement.expressionItem.right.expressionItem.value
        }
        return value;
    }

    /**
     * whether to show the combobox or not
     * @param node
     * @returns {boolean}
     */
    function showOptions(node) {
        var modelValue = node.$modelValue;
        return !definitionsFactory.isElement(modelValue);
    }

    function getText(node) {
        var modelValue = node.$modelValue;
        if(definitionsFactory.isElement(modelValue)) {
            text = "Instantiate element "
        } else {
            text = "With element "
        }
        return text;
    }

    function getTextDebug(node) {
        var modelValue = node.$modelValue;
        if(definitionsFactory.isElement(modelValue)) {
            text = "Instantiate element "
        } else {
            text = definitionsFactory.getPredicateStatementType(modelValue)
        }
        return text;
    }

    function openEditor(node) {
        var archetypeBinding = node.$nodeScope.$parentNodeScope.$modelValue;
        var elementIndex = node.$nodeScope.$index;
        var element = node.$nodeScope.$modelValue;

        var type = definitionsFactory.getPredicateStatementType(element);

        var archetype = guidelineFactory.getGuidelineArchetype(archetypeBinding.archetypeId);

        var modalData = {headerText: 'Expression editor'};


        var modalOptions = {
            size: 'lg',
            component: 'expressionEditorComponent',
            resolve: {
                expression: function () {
                    return element.expression;
                },
                modelExpression: function() {
                    return element.expressionItem.right.expressionItem;
                },
                labels: function () {
                    return modalData;
                },
                items: function () {
                    var elementMaps = [];
                    angular.forEach(archetype.elementMaps, function (elementMap) {
                        var treeObject = angular.copy(elementMap);
                        treeObject.viewText = elementMap.elementMapId;
                        console.log(element);
                        console.log(archetypeBinding);
                        // TODO: add css to leaf nodes
                        if(type === "PredicateExpression") {
                            treeObject.children = ATTRIBUTES[treeObject.dataType];
                        }
                        elementMaps.push(treeObject);
                    });
                    return elementMaps;
                }
            }
        };

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete() {
            $log.info('Modal completed at: ' + new Date() + ' in openEditor()');
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in openEditor()');
        }
    }

}
