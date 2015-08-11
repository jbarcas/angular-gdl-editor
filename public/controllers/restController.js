/**
 * Created by jbarros on 22/02/2015.
 */

app.controller('RestController', function($scope, guideFactory) {

    $scope.formData = {};
    $scope.guide = {};
    $scope.checked;

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

    //$scope.lifecycleState = $scope.lifecycleStates[0];

    getGuides();

    function getGuides() {
        guideFactory.getGuides()
            .success(function(data) {
                $scope.guides = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    $scope.getGuide = function(id) {
        guideFactory.getGuide(id)
            .success(function(data, status, headers, config) {
                $scope.checked = id;
                $scope.guide = data;
                $scope.authorDate = new Date(data.description.originalAuthor.date);
                console.log(data);
            })
            .error(function(data) {
                console.log('Error at getting guide: ' + data);
            });
    };

    $scope.insertGuide = function () {
        guideFactory.insertGuide($scope.guide)
            .success(function (data, status, headers, config) {
                alert($scope.guide.id + "updated!");
            }).
            error(function (data, status, headers, config) {
                console.log('Error at inserting guide: ' + data);
            })
    }

    $scope.updateDate = function (parameter) {
        $scope.guide.description.originalAuthor.date = parameter.toISOString().slice(0,10);
    }

});
