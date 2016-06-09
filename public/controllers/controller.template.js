/**
 * Created by jbarros on 3/04/16.
 */

angular.module('app').controller('TemplateCtrl', function ($scope, ngDialog) {

    $scope.$parent.value = {name: 'CHA2DS2VASc_Score_calculation.v1'};

    $scope.archetypesInModal = getArchetypesInModal($scope.archetypes);

    function getArchetypesInModal(archetypes) {
        var archetypesModel = [];
        for (var i = 0; i < archetypes.length; ++i) {
            var archetypeObject = {};
            archetypeObject.id = i;
            archetypeObject.parent = "#";
            archetypeObject.text = archetypes[i];
            archetypesModel.push(archetypeObject);
        }
        return archetypesModel;
    }

    $scope.changedCB = function(e, data) {
        var i, j, r = [];
        for (i = 0, j = data.selected.length; i < j; i++) {
            r.push(data.instance.get_node(data.selected[i]).text);
        }
        $scope.value = r.join(', ');
        console.log($scope.value);

        for (var i=0; i<$scope.guide.definition.archetypeBindings.length; i++) {
            if ($scope.guide.definition.archetypeBindings[i].archetypeId == $scope.node) {
                $scope.guide.definition.archetypeBindings[i].archetypeId = $scope.value;
            }
        }
    };

});