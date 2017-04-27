/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.controllers')
    .controller('RulelistCtrl', RulelistCtrl);

function RulelistCtrl($state, guidelineFactory, rulelistFactory, modalService) {

    vm = this;
    vm.guide = {};
    vm.guide.ontology = guidelineFactory.getOntology();
    vm.addRule = addRule;

    vm.delete = "../assets/img/del.png";
    vm.accept = "../assets/img/accept.png";
    vm.pencil = "../assets/img/pencil.png";

    vm.rules = guidelineFactory.getRulelist();

    vm.remove = function (scope) {
        scope.remove();
    };

    vm.openRuleEditor = function(rule) {
        var rule = rule.$nodeScope.rule;
        $state.go("rule-editor", {ruleId: rule.id});
    };

    function addRule() {
        var data = {headerText: 'Rule name'};
        var options = {component: 'modalWithInputAndDropdownComponent', resolve: {input: {}}};

        modalService.showModal(options, data).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            /*
             * If there is no input, do nothing
             */
            if (modalResponse.data === undefined) {
                return;
            }
            /*
             * Fetch the rule name from the user input
             */
            var ruleName = modalResponse.data.input.value;
            /*
             * Create the rule
             */
            var rule = rulelistFactory.createRule(ruleName);
            /*
             * Insert the rule into the rules
             */
            guidelineFactory.setRule(rule);
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in RulelistCtrl.addRule()');
        }
    }

}