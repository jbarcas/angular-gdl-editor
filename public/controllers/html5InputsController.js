/**
 * Created by jbarros on 23/02/2015.
 */

app.controller('Html5InputsController', function($scope) {
    $scope.guideline = {
        email: 'email@example.com',
        tel: '123-45-67',
        number: 29,
        range: 10,
        url: 'http://example.com',
        search: 'blabla',
        color: '#6a4415',
        date: null,
        time: '12:30',
        datetime: null,
        month: null,
        week: null
    };
});

app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

