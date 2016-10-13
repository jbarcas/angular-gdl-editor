/**
 * Created by jbarros on 13/08/15.
 */

angular.module('app.controllers')
    .controller('DescriptionCtrl', DescriptionCtrl);

function DescriptionCtrl(guidelineFactory, SharedProperties, modalService) {

    var vm = this;

    vm.guide = {};
    vm.guide.description = guidelineFactory.getDescription();
    vm.guide.ontology = guidelineFactory.getOntology();
    vm.guide.concept = guidelineFactory.getConcept();
    vm.addKeyword = addKeyword;
    vm.addOtherContributor = addOtherContributor;

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

    var defaults = {
        size: 'sm',
        component: 'modalWithInputComponent',
        templateUrl: '',
        resolve: {}
    }

    function addKeyword () {

        defaults.resolve.labels = function() {
            label = {
                headerText: 'Add keyword',
                bodyText: 'Insert the new keyword',
                closeButtonText: 'Close',
                actionButtonText: 'OK'
            };
            return label;
        }
       
        modalService.showModal(defaults).then(
            function(response) {
                if(response == "") {
                    return;
                }
                var language = "en";
                if(angular.isUndefined(vm.guide.description.details[language].keywords)) {
                    vm.guide.description.details[language].keywords = [];
                }
                if(vm.guide.description.details[language].keywords.indexOf(response) == -1) {
                    vm.guide.description.details[language].keywords.push(response);
                }
            },
            function(error) {
                console.log(error);
                console.log("You have not add a new keyword");
            }
        ); 
    };

    function addOtherContributor () {

        defaults.resolve.labels = function() {
            label = {
                headerText: 'Add contributor',
                bodyText: 'Insert the new contributor',
                closeButtonText: 'Close',
                actionButtonText: 'OK'
            };
            return label;
        };
       
        modalService.showModal(defaults).then(
            function(response) {
                if(response == "") {
                    return;
                }
                if(angular.isUndefined(vm.guide.description.otherContributors)) {
                    vm.guide.description.otherContributors = [];
                }
                if(vm.guide.description.otherContributors.indexOf(response) == -1) {
                    vm.guide.description.otherContributors.push(response);
                }
            },
            function(error) {
                console.log(error);
                console.log("You have not add a new contributor");
            }
        );            
       
    };

}
