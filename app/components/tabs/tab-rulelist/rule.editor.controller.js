/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.controllers')
    .controller('RuleEditorCtrl', RuleEditorCtrl);

function RuleEditorCtrl($stateParams, guidelineFactory) {

    vm = this;

    vm.rule = guidelineFactory.getRule($stateParams.ruleId);

};