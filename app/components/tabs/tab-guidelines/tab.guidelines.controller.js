angular.module('app.controllers')
    .controller('GuidelineCtrl', GuidelineCtrl);

function GuidelineCtrl(guidelineFactory, guidelinesFactory, SharedProperties) {

  var vm = this;
  vm.guidelines = [];
  vm.getGuidelines = getGuidelines;

  vm.guideline = {};
  vm.getGuideline = getGuideline;
  
  vm.errorMsg = false;

  activate();

  function activate() {
    return getGuidelines().then(function() {
      vm.checked = SharedProperties.getChecked();
    })
  }

  function getGuidelines() {
    return guidelinesFactory.getGuidelines().then(
      function (data) {
        vm.guidelines = data;
        return vm.guidelines;
      },
      function (error) {
        vm.errorMsg = error.error;
      }
    );
  }

  function getGuideline (guideId) {
    guidelineFactory.getGuideline(guideId).then(
      function (data) {
        vm.guideline = data;
        SharedProperties.setCheckedName(guidelineFactory.getText(data.concept));
        SharedProperties.setChecked(data.id);
      },
      function (error) {
        vm.errorMsg = error.error;
      }
    );
  }

}



