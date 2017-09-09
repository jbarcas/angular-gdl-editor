/**
 * Created by jbarros on 17/08/16.
 */

angular.module('app.services')

    .factory('SharedProperties', function() {

        var sharedProperty = {
            checked: '',
            checkedName: ''
        };

        return {

            getChecked: function () {
                return sharedProperty.checked;
            },
            setChecked: function(checked) {
                sharedProperty.checked = checked;
            },

            getCheckedName: function () {
                return sharedProperty.checkedName;
            },
            setCheckedName: function(checkedName) {
                sharedProperty.checkedName = checkedName;
            }
        };

    });