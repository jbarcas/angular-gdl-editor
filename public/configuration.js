/**
 * Created by jbarros on 6/08/15.
 */

//FIXME: This URL should be enviroment dependent and specified at building time
angular.module('configuration', [])
    .constant('API_URL','http://localhost:8080/km/admin')
    .constant('language', 'en');