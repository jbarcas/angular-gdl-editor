/**
 * Created by jbarros on 22/02/2015.
 */

app.controller('RestController', function($scope, guideFactory, language) {

    $scope.formData = {};
    $scope.checked;
    $scope.lifecycleStates = [
        {name: '-- choose lifecycle state --'},
        {name: 'Not set'},
        {name: 'Initial'},
        {name: 'Author draft'},
        {name: 'Committee draft'},
        {name: 'Organisation draft'},
        {name: 'Sumitted'},
        {name: 'Candidate'},
        {name: 'Approved candidate'},
        {name: 'Published'},
        {name: 'Rejected'},
        {name: 'Obsolete'}
    ];

    $scope.lifecycleState = $scope.lifecycleStates[0];

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
            .success(function(data) {
                $scope.checked = id;
                $scope.currentGuide = data;
                $scope.guidelineName = Object.byString(data, "ontology.termDefinitions." + language + ".terms." + data.concept + ".text");
                $scope.authorName = data.description.originalAuthor.name;
                $scope.authorEmail = data.description.originalAuthor.email;
                $scope.authorOrganisation = data.description.originalAuthor.organisation;
                $scope.authorDate = new Date(data.description.originalAuthor.date);
                $scope.lifecycleState.name = data.description.lifecycleState;
                $scope.copyright = Object.byString(data, "description.details." + language + ".copyright");
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    Object.byString = function(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }

});