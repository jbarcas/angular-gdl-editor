(function(){
  'use strict';
  var app = angular.module('app.components');

  app.component('gdlPanel', {

    bindings: {
      title: '<'
    },

    templateUrl: 'components/layout/panel.html',

    controller: function ($scope, SharedProperties) {

      var getChecked = function () {
        return SharedProperties.getCheckedName();
      }

      $scope.$watch(getChecked, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.checkedName = newValue;
      });
    }
  });
})();