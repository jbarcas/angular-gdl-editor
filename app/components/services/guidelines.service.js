angular.module('app.services')
    .factory('guidelineFactory', guidelineFactory);

function guidelineFactory($http, API_URL, $q, archetypeFactory, terminologyFactory) {
    
    var guideline = {};
    var guidelineArchetypes = [];
    var terms = {};

    return {
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
        updateGuideline: updateGuideline,
        deleteGuideline: deleteGuideline,
        getSourceGuideline: getSourceGuideline,
        //------------------------------------
        getGuidelineArchetypes: getGuidelineArchetypes,
        setGuidelineArchetypes: setGuidelineArchetypes,
        getGuidelineArchetype: getGuidelineArchetype,
        setGuidelineArchetype: setGuidelineArchetype,
        deleteGuidelineArchetype: deleteGuidelineArchetype,
        getElementName: getElementName,
        //-------------------------------------
        getRulelist: getRulelist,
        setRulelist: setRulelist,
        getRule: getRule,
        setRule: setRule,
        getArchetypeBindings: getArchetypeBindings,
        setArchetypeBindings: setArchetypeBindings,
        //-------------------------------------
        getTerms: getTerms,
        addTerm: addTerm,
        removeTerm: removeTerm,
        getTermDescription: getTermDescription
    };

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
        console.log(terms);
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
        console.log(guidelineArchetypes.toString())
    }

    function getElementName(archetypeId, path) {
        var archetype = getGuidelineArchetype(archetypeId);
        for (var elementMap in archetype.elementMaps) {
            if (archetype.elementMaps.hasOwnProperty(elementMap)) {
                if(path.startsWith(archetype.elementMaps[elementMap].path)) {
                    return elementMap;
                }
            }
        }
        return null;
    }

    // Rulelist
    function getRulelist() {
        return guideline.definition.rules;
    }
    function setRulelist(rulelist) {
        guideline.definition.rules = rulelist;
    }

    // ArchetypeBindings
    function getArchetypeBindings() {
        if(guideline.definition) {
            return guideline.definition.archetypeBindings;
        };
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

    }

}