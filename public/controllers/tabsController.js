/**
 * Created by jbarros on 22/02/2015.
 */

app.controller('TabsController', function($scope, $window) {

    $scope.tabs = [
        { title:'Definitions', content:'References to the archetypes used in the rules and preconditions' },
        { title:'Rule list', content:'Allows managing of all the rules inside the guideline.', disabled: true },
        { title:'Preconditions', content:'A list of conditions that have to be fulfilled before any rule is executed.' },
        { title:'Terminology', content:'Translations for each one of the terms used in the guidelines.' },
        { title:'Binding', content:'Mapping of the local codes used in the guideline to external terminologies.' },
        { title:'GDL', content:'The output of the editor (in GDL format).' },
        { title:'HTML', content:'The output of the editor (in HTML format).' },
        { title:'Implementation view', content:'The output of the editor in a rule engine format (JBoss Drools in this case' }
    ];

    $scope.alertMe = function() {
        setTimeout(function() {
            $window.alert('You\'ve selected the alert tab!');
        });
    };
});