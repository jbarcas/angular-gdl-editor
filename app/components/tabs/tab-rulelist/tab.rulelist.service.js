/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.services')
  .factory('rulelistFactory', rulelistFactory);

function rulelistFactory(utilsFactory, guidelineFactory) {

  return {
    createRule: createRule
  }

  function createRule(ruleName) {

    var rule;

    rule = {
      id: utilsFactory.generateGt(guidelineFactory.getCurrentGuide()),
      when: [],
      then: [],
      priority: 2,
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

}