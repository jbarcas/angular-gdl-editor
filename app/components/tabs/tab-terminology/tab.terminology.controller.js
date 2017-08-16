/**
 * Created by jbarros on 22/02/2015.
 */

angular.module('app.controllers')
    .controller('TerminologyCtrl', TerminologyCtrl);

function TerminologyCtrl(utilsFactory, guidelineFactory) {

    var vm = this;

    vm.guide = {};
    vm.guide.ontology = guidelineFactory.getOntology();
    vm.saveTerm = saveTerm;
    vm.removeTerm = removeTerm;
    vm.addTerm = addTerm;

    vm.pencil = "../assets/img/pencil.png";
    vm.delete = "../assets/img/del.png";

    // save term
    function saveTerm (data, id) {
        angular.extend(data, {id: id});
    }

    // remove term
    function removeTerm (term) {
        delete vm.guide.ontology.termDefinitions['en'].terms[term];
    }

    // add term
    function addTerm () {
        vm.inserted = {
            id: generateGtCode(vm.guide),
            text: '',
            description: ''
        };
        vm.guide.ontology.termDefinitions['en'].terms[vm.inserted.id] = vm.inserted;
    }

    function generateGtCode(guide) {
        return utilsFactory.generateGt(guide);
    }
}
