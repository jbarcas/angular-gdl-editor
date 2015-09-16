/**
 * Created by jbarros on 6/08/15.
 */

//FIXME: This URL should be enviroment dependent and specified at building time
angular.module('app.core', [])
    .constant('API_URL','http://localhost:8080/km/admin')
    .constant('API_URL_MISC','http://localhost:8080/km/misc')
    .constant('GT_HEADER', 'gt');