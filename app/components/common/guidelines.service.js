angular.module('app.services')
    .factory('guidelineFactory', guidelineFactory);

function guidelineFactory($http, API_URL, $q, archetypeFactory, terminologyFactory, SharedProperties) {
    
    var guideline = {};
    var guidelineArchetypes = [];
    var terms = {};

    return {
        newGuideline: newGuideline,
        getGuideline: getGuideline,
        getCurrentGuide: getCurrentGuide,
        setCurrentGuideline: setCurrentGuideline,
        getGdlVersion: getGdlVersion,
        setGdlVersion: setGdlVersion,
        getId: getId,
        setId: setId,
        getConcept: getConcept,
        setConcept: setConcept,
        getLanguage: getLanguage,
        setLanguage: setLanguage,
        getDescription: getDescription,
        setDescription: setDescription,
        getDefinition: getDefinition,
        setDefinition: setDefinition,
        getOntology: getOntology,
        setOntology: setOntology,
        //-------------------------
        insertGuideline: insertGuideline,
        insertSourceGuideline: insertSourceGuideline,
        updateGuideline: updateGuideline,
        deleteGuideline: deleteGuideline,
        getSourceGuideline: getSourceGuideline,
        //------------------------------------
        getGuidelineArchetypes: getGuidelineArchetypes,
        setGuidelineArchetypes: setGuidelineArchetypes,
        getGuidelineArchetype: getGuidelineArchetype,
        setGuidelineArchetype: setGuidelineArchetype,
        deleteGuidelineArchetype: deleteGuidelineArchetype,
        getElementByArchetypIdAndPath: getElementByArchetypIdAndPath,
        getElementByGtCode: getElementByGtCode,
        getElementType: getElementType,
        getPreConditions: getPreConditions,
        setPreConditions: setPreConditions,
        //-------------------------------------
        getRulelist: getRulelist,
        setRulelist: setRulelist,
        getRule: getRule,
        setRule: setRule,
        removeRule: removeRule,
        getArchetypeBindings: getArchetypeBindings,
        setArchetypeBindings: setArchetypeBindings,
        //-------------------------------------
        getTerms: getTerms,
        addTerm: addTerm,
        removeTerm: removeTerm,
        getTermDescription: getTermDescription,
        //-------------------------------------
        addElementToDefinitions: addElementToDefinitions,
        getText: getText,
        //getDescription: getDescription
        getTermDefinitions: getTermDefinitions,
        setTermDefinitions: setTermDefinitions,
        getTermBindings: getTermBindings,
        getTermBinding: getTermBinding,
        setTermBinding: setTermBinding,
        removeBindingTerminology: removeBindingTerminology,
        setTermDefinition: setTermDefinition,
        getLanguages: getLanguages
    };

    function newGuideline(guidelineId) {

        var newGuide = {
            "gdlVersion": "0.1",
            "id": guidelineId,
            "concept": "gt0000",
            "language": {},
            "description": {},
            "definition": {
                "archetypeBindings": {},
                "preConditions": [],
                "defaultActions": [],
                "rules": {},
                "defaultActionExpressions": []
            },
            "ontology": {
                "termDefinitions": {
                    "en": {
                        "id": "en",
                        "terms": {
                            "gt0000": {
                                "id": "gt0000",
                                "text": toName(guidelineId),
                                "description": "*"
                            }
                        }
                    }
                }
            }
        };
        guideline = newGuide;
        return newGuide;
    }

    function getTermDescription(archetypeId, atCode) {
        if(atCode === 'undefined' || atCode === "") {
            return "";
        }
        return terms[archetypeId][atCode].description;
    }

    function getTerms() {
        return terms;
    }

    function addTerm(archetypeId, data) {
        terms[archetypeId] = data;
    }

    function removeTerm(archetypeId) {
        delete terms[archetypeId];
    }

    function setGuidelineArchetypes(guideline) {
        var archetypeIds = [];
        for (var ab in guideline.definition.archetypeBindings) {
            archetypeIds.push(guideline.definition.archetypeBindings[ab].archetypeId);
        }
        // Remove duplicates: this way we avoid unnecessary calls.
        archetypeIds = archetypeIds.filter(function (item, pos) {
            return archetypeIds.indexOf(item) == pos;
        });
        guidelineArchetypes = [];
        angular.forEach(archetypeIds, function (archetypeId) {
            archetypeFactory.getArchetype(archetypeId).then(function (data) {
                guidelineArchetypes.push(data);
                terminologyFactory.getTerms(archetypeId).then(function(response) {
                    terms[data.archetypeId] = response;
                })
            });
        })
    }

    //gets the parts of a guideline
    function getGuideline(guideId) {
        var deferred = $q.defer();
        $http.get(API_URL + '/guidelines/json/' + guideId).then(
            function (response) {
                guideline = response.data;
                setGuidelineArchetypes(guideline);
                deferred.resolve(guideline);
            },
            function (response) {
                deferred.reject(response.data);
            }
        );
        return deferred.promise;
    }

    function getCurrentGuide() {
        return guideline;
    }

    function setCurrentGuideline(guide) {
        guideline = guide;
    }


    // GDL Version
    function getGdlVersion() {
        return guideline.gdlVersion;
    }
    function setGdlVersion(gdlVersion) {
        guideline.gdlVersion = gdlVersion;
    }


    // Id
    function getId() {
        return guideline.id;
    }
    function setId(id) {
        guideline.id = id;
    }


    // Concept
    function getConcept() {
        return guideline.concept;
    }
    function setConcept(concept) {
        guideline.concept = concept;
    }


    // Language
    function getLanguage() {
        return guideline.language;
    }
    function setLanguage(language) {
        guideline.language = language;
    }


    // Description
    function getDescription() {
        return guideline.description;
    }
    function setDescription(description) {
        guideline.description = description;
    }


    // Definition
    function getDefinition() {
        return guideline.definition;
    }
    function setDefinition(definition) {
        guideline.definition = definition;
    }


    // Ontology
    function getOntology() {
        return guideline.ontology;
    }
    function setOntology(ontology) {
        guideline.ontology = ontology;
    }

    //------------------------------
  
    function insertGuideline(guide) {
        var deferred = $q.defer();
        $http.post(API_URL + '/guidelines/json/' + guide.id, guide).then(
            function (response) {
                deferred.resolve(response);
            },
            function (response) {
                deferred.reject(response);
            }
        );
        return deferred.promise;
    }

    function insertSourceGuideline(guideId, gdlCode) {
        var deferred = $q.defer();
        $http.post(API_URL + '/guidelines/' + guideId, gdlCode, {headers:{'Content-Type': 'text/plain'}}).then(
            function (response) {
                deferred.resolve(response);
            },
            function (response) {
                deferred.reject(response);
            }
        );
        return deferred.promise;
    }

    function updateGuideline(guide) {
        var deferred = $q.defer();
        $http.put(API_URL + '/guidelines/json/' + guide.id, guide).then(
            function (response) {
                deferred.resolve(response);
            },
            function (response) {
                deferred.reject(response);
            }
        );
        return deferred.promise;
    }

    function deleteGuideline(id) {
        var deferred = $q.defer();
        $http.delete(API_URL + '/guidelines/' + id).then(
            function (response) {
                deferred.resolve(response);
            },
            function (response) {
                deferred.reject(response);
            }
        );
        return deferred.promise;
    }

    function getSourceGuideline(id) {
        var deferred = $q.defer();
        $http.get(API_URL + '/guidelines/source/' + id).then(
            function (response) {
                deferred.resolve(response);
            },
            function (response) {
                deferred.reject(response);
            }
        );
        return deferred.promise;
    }

    function getGuidelineArchetypes() {
        return guidelineArchetypes;
    }

    function getGuidelineArchetype(archetypeId) {
        for(var i=0; i<guidelineArchetypes.length; i++) {
            if (guidelineArchetypes[i].archetypeId === archetypeId) {
                return guidelineArchetypes[i];
            }
        }
        return null;
    }

    function setGuidelineArchetype(archetype) {
        guidelineArchetypes.push(archetype);
    }

    function deleteGuidelineArchetype(archetypeId) {
        for(var i=0; i<guidelineArchetypes.length; i++) {
            if (guidelineArchetypes[i].archetypeId === archetypeId) {
                guidelineArchetypes.splice(i, 1);
            }
        }
    }

    function getElementType(code) {
        var archetypeId;
        var element;
        angular.forEach(getArchetypeBindings(), function(archetypeBinding) {
            angular.forEach(archetypeBinding.elements, function(e) {
                if(code === e.id) {
                    element = e;
                    archetypeId = archetypeBinding.archetypeId;
                }
            })
        });
        return getElementByArchetypIdAndPath(archetypeId, element.path).dataType;
    }

    function getElementByArchetypIdAndPath(archetypeId, path) {
        var archetype = getGuidelineArchetype(archetypeId);
        for (var elementMap in archetype.elementMaps) {
            if (archetype.elementMaps.hasOwnProperty(elementMap)) {
                if(path.startsWith(archetype.elementMaps[elementMap].path)) {
                    return archetype.elementMaps[elementMap];
                }
            }
        }
        return null;
    }

    function getElementByGtCode (gtCode) {
        /**
         * First: get the archetypeId and the path of the gtCode
         * Second: iterate over the archetype and return the element that matches with the previous path
         */
        var archetypeId;
        var path;
        var element;
        angular.forEach(getArchetypeBindings(), function(archetypeBinding) {
            if (archetypeBinding.elements instanceof Array) {
                angular.forEach(archetypeBinding.elements, function(element) {
                    if(gtCode === element.id) {
                        archetypeId = archetypeBinding.archetypeId;
                        path = element.path
                    }
                })
            } else {
                if(gtCode in archetypeBinding.elements) {
                    archetypeId = archetypeBinding.archetypeId;
                    path = archetypeBinding.elements[gtCode].path
                }
            }
        });
        angular.forEach(guidelineArchetypes, function(archetype) {
            if(archetype.archetypeId === archetypeId) {
                angular.forEach(archetype.elementMaps, function(elementMap) {
                    if(elementMap.path === path) {
                        element = elementMap;
                    }
                })
            }
        });
        return element;
    }

    // Preconditions
    function getPreConditions() {
        if(!guideline.definition) {
            return null;
        }
        return guideline.definition.preConditionExpressions;
    }

    function setPreConditions (preConditions) {
        guideline.definition.preConditionExpressions = preConditions;
    }

    // Rulelist
    function getRulelist() {
        if(!guideline.definition) {
            return null;
        }
        return guideline.definition.rules;
    }
    function setRulelist(rulelist) {
        guideline.definition.rules = rulelist;
    }

    // ArchetypeBindings
    function getArchetypeBindings() {
        if(guideline.definition) {
            return guideline.definition.archetypeBindings;
        }
        return {};
    }
    function setArchetypeBindings(archetypeBindings) {
        guideline.definition.archetypeBindings = archetypeBindings;
    }

    // Rules
    function getRule(ruleId) {
        for (var rule in guideline.definition.rules) {
            if(guideline.definition.rules[rule].id == ruleId) {
                return guideline.definition.rules[rule];
            }
        }
        return null;
    }

    function setRule(rule) {
        guideline.definition.rules[rule.id] = rule;
    }

    function removeRule(rule) {
        var id = rule.id;
        delete guideline.definition.rules[id];
        /*
         * Remove the corresponding entry in the termDefinitions (Ontology)
         */
        delete getOntology().termDefinitions.en.terms[id];
    }


    function addElementToDefinitions(element, archetypeId) {
        angular.forEach(getDefinition().archetypeBindings, function(archetypeBinding) {
            if(archetypeBinding.archetypeId === archetypeId) {
                var newElement = {
                    id: element.id,
                    path: element.path
                };
                // FIXME: Do not modify the model in definitions
                if(archetypeBinding.elements instanceof Array) {
                    archetypeBinding.elements.push(newElement);
                } else {
                    archetypeBinding.elements[newElement.id] = newElement;
                }
            }
        });
    }

    function getText(gtCode) {
        if(gtCode && getOntology().termDefinitions.en.terms) {
            if(gtCode==="currentDateTime") {
                return gtCode;
            }
            return getOntology().termDefinitions.en.terms[gtCode].text;
        }
        return null;
    }

    /*function getDescription(gtCode) {
        if(gtCode && getOntology().termDefinitions.en.description) {
            return getOntology().termDefinitions.en.description[gtCode].text;
        }
        return null;
    }*/

    function getTermDefinitions() {
        if(!guideline.ontology) {
            return null;
        }
        return guideline.ontology.termDefinitions;
    }

    // TODO: merge with setTermDefinition method
    function setTermDefinitions(termDefinition) {
        if(!guideline.ontology.termDefinitions) {
            guideline.ontology.termDefinitions = {};
        }
        guideline.ontology.termDefinitions[termDefinition.id] = termDefinition;
    }

    function getTermBindings() {
        if(!guideline.ontology) {
            return null;
        }
        return guideline.ontology.termBindings;
    }

    function setTermBinding(termBinding) {
        if(!guideline.ontology.termBindings) {
            guideline.ontology.termBindings = {};
        }
        guideline.ontology.termBindings[termBinding.id] = termBinding;

    }

    function getTermBinding(id) {
        return guideline.ontology.termBindings[id];
    }

    function removeBindingTerminology(terminologyId) {
        delete guideline.ontology.termBindings[terminologyId];
    }

    function setTermDefinition(termDefinition) {
        var termDefinitionId = termDefinition.id;
        guideline.ontology.termDefinitions.en.terms[termDefinitionId] = termDefinition;
    }

    function toName (guidelineId) {
        var name = guidelineId.charAt(0).toUpperCase() + guidelineId.substr(1).toLowerCase().replace(/\./g, ' ');
        if(/v\d+/.test(name)) {
            name = name.slice(0, name.lastIndexOf(".")-1);
        }
        SharedProperties.setCheckedName(name);
        return name;
    }

    function getLanguages() {
        console.log(guideline.ontology.termDefinitions);
        return Object.keys(guideline.ontology.termDefinitions);
    }
}