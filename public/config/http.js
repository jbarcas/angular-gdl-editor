/**
 * Created by jbarros on 10/04/16.
 */

angular.module('app')

    .config(function ($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'text/plain';
    })

    .config(function ($httpProvider) {
        $httpProvider.defaults.transformRequest = function(data) {
            if (data === undefined) {
                return data;
            }
            data.definition.archetypeBindings.map(function (archetypeBindingValue, archetypebindingKey) {
                if (!angular.isUndefined(archetypeBindingValue.elements)) {
                    archetypeBindingValue.elements.map(function (elementValue, elementKey) {
                        data.definition.archetypeBindings[archetypebindingKey].elements[elementValue.id] = elementValue;
                        /*
                         * Delete the "name" property (used to map the gt code element to its name in the archetype)
                         */
                        delete data.definition.archetypeBindings[archetypebindingKey].elements[elementValue.id].name;
                        delete data.definition.archetypeBindings[archetypebindingKey].elements[elementKey];
                    });
                    var element = {};
                    angular.extend(element, data.definition.archetypeBindings[archetypebindingKey].elements);
                    data.definition.archetypeBindings[archetypebindingKey].elements = element;
                    data.definition.archetypeBindings[archetypeBindingValue.id] = archetypeBindingValue;
                    delete data.definition.archetypeBindings[archetypebindingKey];
                }
            })
            var newObj = {};
            angular.extend(newObj, data.definition.archetypeBindings);
            data.definition.archetypeBindings = newObj;
            return angular.toJson(data);
        }
    });