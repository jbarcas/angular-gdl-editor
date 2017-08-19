angular.module('app.controllers')
    .controller('RulelistCtrl', RulelistCtrl);

function RulelistCtrl($state, $log, guidelineFactory, rulelistFactory, modalService) {

    vm = this;
    vm.guide = {};
    vm.guide.ontology = guidelineFactory.getOntology();
    vm.addRule = addRule;
    vm.editName = editName;
    vm.delete = "../assets/img/del.png";
    vm.accept = "../assets/img/accept.png";
    vm.pencil = "../assets/img/pencil.png";
    var rulelist = guidelineFactory.getRulelist();
    vm.rules = rulelistFactory.convertModel(rulelist);

    vm.remove = function (scope) {

        var rule = scope.$modelValue;

        modalService.showModal(
            {component: 'dialogComponent'},
            {bodyText: 'Are you sure you want remove the rule "' + guidelineFactory.getText(rule.id) +'"'}
        ).then(showModalComplete, showModalFailed);

        function showModalComplete() {
            guidelineFactory.removeRule(rule);
            scope.remove();
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in removeBinding()');
        }
    };

    vm.openRuleEditor = function(node) {
        var rule = node.$nodeScope.rule;
        $state.go("rule-editor", {ruleId: rule.id});
    };

    function editName(node) {
        var rule = node.$nodeScope.rule;
        var data = {headerText: 'Rule name'};
        var options = {
            component: 'modalWithInputAndDropdownComponent',
            resolve: {
                input: function() {
                    var input = {
                        value: guidelineFactory.getOntology().termDefinitions.en.terms[rule.id].text
                    };
                    return input;
                },
                class: function() {
                    return "rule-name"
                }
            }
        };

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
            guidelineFactory.getOntology().termDefinitions.en.terms[rule.id].text = ruleName;

        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in RulelistCtrl.addRule()');
        }


    }

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
            var maxPriority = getMaxPriority(vm.rules);
            var priority = maxPriority + 1;
            var rule = rulelistFactory.createRule(ruleName, priority);
            /*
             * Insert the rule into the rules
             */
            guidelineFactory.setRule(rule);
            /*
             * Update the view
             */
            vm.rules.push(rule);
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in RulelistCtrl.addRule()');
        }
    }

    vm.treeRulelist = {
        /**
         * Used to re-order the priorities
         * @param event Drag and drop event
         */
        beforeDrop: function(event) {
            rulelistFactory.reorderPriority(event);
        }
    };

    function getMaxPriority(rules) {
        var max = 0;
        angular.forEach(rules, function(rule) {
            if(rule.priority > max) {
                max = rule.priority;
            }
        });
        return max;
    }
}