/**
 * Created by jbarros on 13/08/15.
 */

angular.module('app.controllers')
    .controller('DescriptionCtrl', DescriptionCtrl);

function DescriptionCtrl(guidelineFactory, modalService) {

    var vm = this;

    vm.guide = {};
    vm.guide.description = guidelineFactory.getDescription();
    vm.guide.ontology = guidelineFactory.getOntology();
    vm.guide.concept = guidelineFactory.getConcept();
    vm.addKeyword = addKeyword;
    vm.addOtherContributor = addOtherContributor;
    vm.removeKeyword = removeKeyword;
    vm.removeContributor = removeContributor;

    vm.addImg = "../../assets/img/add.png";
    vm.delImg = "../../assets/img/del.png";

    //TODO: lifecycleState = 'Not set' should remove the JSON entry description.lifecycleState
    vm.lifecycleStates = [
        {name: '-- choose lifecycle state --'},
        {name: 'Not set'},
        {name: 'Initial', value: 'Initial'},
        {name: 'Author draft', value: 'Author draft'},
        {name: 'Committee draft', value: 'Committee draft'},
        {name: 'Organisation draft', value: 'Organisation draft'},
        {name: 'Submitted', value: 'Submitted'},
        {name: 'Candidate', value: 'Candidate'},
        {name: 'Approved candidate', value: 'Approved candidate'},
        {name: 'Published', value: 'Published'},
        {name: 'Rejected', value: 'Rejected'},
        {name: 'Obsolete', value: 'Obsolete'}
    ];

    function addKeyword () {

        var data = {headerText: 'Add keyword'};
        var options = {component: 'modalWithInputAndDropdownComponent', resolve: {input: {}}};

        modalService.showModal(options, data).then(showModalComplete, showModalFailed);

        function showModalComplete(response) {
            if(response == "") {
                return;
            }
            var language = "en";
            var keyword = response.data.input.value;
            if(angular.isUndefined(vm.guide.description.details[language].keywords)) {
                vm.guide.description.details[language].keywords = [];
            }
            if(vm.guide.description.details[language].keywords.indexOf(keyword) == -1) {
                vm.guide.description.details[language].keywords.push(keyword);
            }
        }

        function showModalFailed(error) {
            console.log(error);
            console.log("You have not add a new keyword");
        }
    }

    function addOtherContributor () {

        var data = {headerText: 'Add keyword'};
        var options = {component: 'modalWithInputAndDropdownComponent', resolve: {input: {}}};

        modalService.showModal(options, data).then(showModalComplete, showModalFailed);

        function showModalComplete(response) {
            if(response == "") {
                return;
            }
            var contributor = response.data.input.value;
            if(angular.isUndefined(vm.guide.description.otherContributors)) {
                vm.guide.description.otherContributors = [];
            }
            if(vm.guide.description.otherContributors.indexOf(contributor) == -1) {
                vm.guide.description.otherContributors.push(contributor);
            }
        }

        function showModalFailed(error) {
            console.log(error);
            console.log("You have not add a new contributor");
        }
    }

    function removeKeyword(index) {
        modalService.showModal(
            {component: 'dialogComponent'},
            {bodyText: 'Are you sure you want remove the keyword "' + vm.guide.description.details['en'].keywords[index] +'?"'}
        ).then(showModalComplete, showModalFailed);

        function showModalComplete() {
            vm.guide.description.details['en'].keywords.splice(index, 1);
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in removeKeyword()');
        }
    }

    function removeContributor(index) {
        modalService.showModal(
            {component: 'dialogComponent'},
            {bodyText: 'Are you sure you want remove the contibutor "' + vm.guide.description.otherContributors[index] +'?"'}
        ).then(showModalComplete, showModalFailed);

        function showModalComplete() {
            vm.guide.description.otherContributors.splice(index,1);
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in removeKeyword()');
        }
    }


}
