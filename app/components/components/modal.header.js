/**
 * Created by jbarros on 9/04/17.
 */
angular.module('app.components')
  .component('modalHeader', {
    templateUrl: 'assets/templates/modal-header.html',
    bindings: {
      resolve: '<'
    },
    controller: function () {
      var $ctrl = this;
      $ctrl.labels = $ctrl.resolve.resolve.labels;
    }
  });