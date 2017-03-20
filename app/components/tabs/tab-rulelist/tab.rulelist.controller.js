/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.controllers')
    .controller('RulelistCtrl', RulelistCtrl);

function RulelistCtrl($state, guidelineFactory) {

    vm = this;
    vm.guide = {};
    vm.guide.ontology = guidelineFactory.getOntology();

    vm.delete = "../assets/img/del.png";
    vm.accept = "../assets/img/accept.png";
    vm.pencil = "../assets/img/pencil.png";

    vm.data = [];

    createView();

    function createView() {
        var rulelist = guidelineFactory.getRulelist();
        for(var rule in rulelist) {
            vm.data.push(rulelist[rule]);
        }
    };

    vm.remove = function (scope) {
        scope.remove();
    };

    vm.openRuleEditor = function(rule) {
        var rule = rule.$nodeScope.$modelValue;
        $state.go("rule-editor", {ruleId: rule.id});
    }



};