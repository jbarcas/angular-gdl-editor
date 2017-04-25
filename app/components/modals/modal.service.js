angular.module('app.services')
  .service('modalService', modalService);
    
function modalService ($uibModal) {

  var modalDefaults = {
    size: 'md',
    backdrop: 'static',
    keyboard: true,
    modalFade: true,
    templateUrl: 'modal.html'
  };

  var modalLabels = {
    closeButtonText: 'Close',
    actionButtonText: 'OK',
    headerText: 'Proceed?'
  };

  this.showModal = function (customModalDefaults, customModalLabels) {
    if (!customModalDefaults) {
      customModalDefaults = {};
    }
    return this.show(customModalDefaults, customModalLabels);
  };

  this.show = function (customModalDefaults, customModalLabels) {
    //Create temp objects to work with since we're in a singleton service
    var tempModalDefaults = {};
    var tempModalLabels = {};

    //Map angular-ui modal custom defaults to modal defaults defined in service
    angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

    //Map modal.html $scope custom properties to defaults defined in service
    angular.extend(tempModalLabels, modalLabels, customModalLabels);

    var labels = function() {
      return tempModalLabels;
    };

    if(!tempModalDefaults.resolve) {
      tempModalDefaults.resolve = {};
    }
    tempModalDefaults.resolve.labels = labels;

    return $uibModal.open(tempModalDefaults).result;
  };

};