/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.services')
  .factory('rulelistFactory', rulelistFactory);

function rulelistFactory($filter, utilsFactory, guidelineFactory) {

  return {
    createRule: createRule,
    convertModel: convertModel,
    reorderPriority: reorderPriority
  }

  function createRule(ruleName, priority) {

    var rule;

    rule = {
      id: utilsFactory.generateGt(guidelineFactory.getCurrentGuide()),
      when: [],
      then: [],
      priority: priority,
      whenStatements: [],
      thenStatements: []
    };

    guidelineFactory.getOntology().termDefinitions.en.terms[rule.id] = {
      id: rule.id,
      description: "*",
      text: ruleName
    }
    return rule;
  }

  function convertModel(rulelist) {
    return utilsFactory.objectToArray(rulelist);
  }

  function reorderPriority(event) {
    var destArray = $filter('orderBy')(event.dest.nodesScope.$modelValue, 'priority', true);
    var dest = destArray[event.dest.index];
    var temp = dest.priority;
    dest.priority = event.source.nodeScope.rule.priority;
    event.source.nodeScope.rule.priority = temp;
  }

}