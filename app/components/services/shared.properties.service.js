/**
 * Created by jbarros on 17/08/16.
 */

angular.module('app.services')

    .factory('SharedProperties', function() {

        var sharedProperty = {
            checked: ''
        };

        return {
            // Selected guideline
            getChecked: function () {
                return sharedProperty.checked;
            },
            setChecked: function(checked) {
                sharedProperty.checked = checked;
            }
        };

    });