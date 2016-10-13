angular.module('app.services')
    .factory('guidelineFactory', guidelineFactory);

function guidelineFactory($http, API_URL, $q) {
    
    var guideline = {};

    return {
        getGuideline: getGuideline,
        getCurrentGuide: getCurrentGuide,
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
        getSourceGuideline: getSourceGuideline
    }

    //gets the parts of a guideline
    function getGuideline(guideId) {
        var deferred = $q.defer();
        $http.get(API_URL + '/guidelines/json/' + guideId).then(

            function (response) {
                guideline = response.data;
                deferred.resolve(guideline);
            },
            function (response) {
                deferred.reject(response.data);
            }
        );
        return deferred.promise;
    };

    function getCurrentGuide() {
        return guideline;
    };


    // GDL Version
    function getGdlVersion() {
        return guideline.gdlVersion;
    };
    function setGdlVersion(gdlVersion) {
        guideline.gdlVersion = gdlVersion;
    };


    // Id
    function getId() {
        return guideline.id;
    };
    function setId(id) {
        guideline.id = id;
    };


    // Concept
    function getConcept() {
        return guideline.concept;
    };
    function setConcept(concept) {
        guideline.concept = concept;
    };


    // Language
    function getLanguage() {
        return guideline.language;
    };
    function setLanguage(language) {
        guideline.language = language;
    };


    // Description
    function getDescription() {
        return guideline.description;
    };
    function setDescription(description) {
        guideline.description = description;
    };


    // Definition
    function getDefinition() {
        return guideline.definition;
    };
    function setDefinition(definition) {
        guideline.definition = definition;
    };


    // Ontology
    function getOntology() {
        return guideline.ontology;
    };
    function setOntology(ontology) {
        guideline.ontology = ontology;
    };

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

}