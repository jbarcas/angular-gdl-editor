angular.module('app.directives', [])
    .directive('ngEnter', ngEnter)

function ngEnter($document) {
  return {
    scope: {
      ngEnter: "&"
    },
    link: function(scope, element, attrs) {
      var enterWatcher = function(event) {
        if (event.which === 13) {
          scope.ngEnter();
          scope.$apply();
          event.preventDefault();
          $document.unbind("keydown keypress", enterWatcher);
        }
      };
      $document.bind("keydown keypress", enterWatcher);
    }
  }
}