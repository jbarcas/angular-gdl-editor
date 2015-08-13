/**
 * Created by jbarros on 13/08/15.
 */

angular.module('app').controller('DescriptionCtrl', DescriptionCtrl);

function DescriptionCtrl ($scope) {
    //TODO: lifecycleState = 'Not set' should remove the JSON entry description.lifecycleState
    $scope.lifecycleStates = [
        {name: '-- choose lifecycle state --'},
        {name: 'Not set'},
        {name: 'Initial', value: 'Initial'},
        {name: 'Author draft', value: 'Author draft'},
        {name: 'Committee draft', value: 'Committee draft'},
        {name: 'Organisation draft', value: 'Organisation draft'},
        {name: 'Submitted', value: 'Submitted'},
        {name: 'Candidate', value: 'Candidate'},
        {name: 'Approved candidate', value: 'Approved candidate'},
        {name: 'Published', value: 'Published'},
        {name: 'Rejected', value: 'Rejected'},
        {name: 'Obsolete', value: 'Obsolete'}
    ];
}
