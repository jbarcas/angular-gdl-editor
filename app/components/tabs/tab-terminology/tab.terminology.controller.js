/**
 * Created by jbarros on 22/02/2015.
 */

angular.module('app.controllers')
    .controller('TerminologyCtrl', TerminologyCtrl);

function TerminologyCtrl(utilsFactory, guidelineFactory, LANGUAGES, modalService, $log) {

    var vm = this;

    vm.guide = {};
    vm.termDefinitions = guidelineFactory.getTermDefinitions();
    vm.termDefinition = vm.termDefinitions ? vm.termDefinitions[Object.keys(vm.termDefinitions)[0]] : {};
    vm.changeLanguage = changeLanguage;
    vm.saveTerm = saveTerm;
    vm.removeTerm = removeTerm;
    vm.addTerm = addTerm;
    vm.getLanguageName = getLanguageName;
    vm.newLanguage = newLanguage;
    vm.newTerm = newTerm;

    vm.pencil = "../assets/img/pencil.png";
    vm.delete = "../assets/img/del.png";


    function changeLanguage(tab) {
        vm.termDefinition = tab;
    }

    // save term
    function saveTerm (data, id) {
        angular.extend(data, {id: id});
    }

    // remove term
    function removeTerm (term) {
        delete vm.termDefinitions[vm.termDefinition.id].terms[term];
    }

    // add term
    function addTerm () {
        vm.inserted = {
            id: generateGtCode(guidelineFactory.getCurrentGuide()),
            text: '',
            description: ''
        };
        vm.termDefinitions[vm.termDefinition.id].terms[vm.inserted.id] = vm.inserted;
    }

    // Gets the language name from ISO 639-1 language code
    function getLanguageName(code) {
        return LANGUAGES[code];
    }

    function generateGtCode(guide) {
        return utilsFactory.generateGt(guide, vm.termDefinition.id);
    }

    /**
     * Create a new terminology in which you can add termBindings.
     *
     */
    function newLanguage() {

        var items = [];
        angular.forEach(LANGUAGES, function(language, code) {
            items.push({viewText: language + "(" + code + ")", code: code});
        });

        var modalOptions = {
            component: 'modalWithTreeComponent',
            size: 'md',
            resolve: {
                items: function() {
                    return items;
                },
                labels: function() {
                    return modalData;
                }
            }
        };

        var modalData = {
            headerText: "Add new language",
            bodyText: "New language"
        };

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }

            var code = modalResponse.data.selectedItem.code;
            // If the code already exists
            if(code in vm.termDefinitions) {
                return;
            }

            var newTermDefinition = {
                id: code,
                terms: {}
            };

            // set the termBinding into the guideline
            guidelineFactory.setTermDefinitions(newTermDefinition);

            // Refresh the view
            vm.termDefinitions = guidelineFactory.getTermDefinitions();
            //vm.active = Object.keys(vm.termDefinitions).length-1;

        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in newTerminology()');
        }

    }

    function newTerm() {
        var modalOptions = {};
        modalOptions.resolve = {};
        modalOptions.component = "modalWithTreeComponent";
        modalOptions.resolve.items = function() {
            var terms = guidelineFactory.getOntology().termDefinitions.en.terms;
            var modalItems = [];
            angular.forEach(terms, function (term) {
                term.viewText = term.id + " - " + term.text;
                modalItems.push(term);
            });
            modalItems = modalItems.sort(compare);
            return modalItems;
        }
        modalService.showModal(modalOptions, {headerText: "Select local term"}).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            var response = modalResponse.data.selectedItem;
            var termDefinition = {
                id: response.id,
                text: response.text,
                description: response.description
            };
            guidelineFactory.getCurrentGuide().ontology.termDefinitions[vm.termDefinition.id].terms[termDefinition.id] = termDefinition;
            console.log(modalResponse);
        }

        function showModalFailed(modalResponse) {
            console.log(modalResponse);
        }
    }

    /**
     * Used to sort by name the gt codes displayed in the popup when an IS_A choice is selected
     * @param a
     * @param b
     * @returns {number}
     */
    function compare(a,b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }

}
