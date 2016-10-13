/**
 * Created by jbarros on 6/08/15.
 */

angular.module('app.constants', [])
    //FIXME: This URL should be enviroment dependent and specified at building time
    .constant('API_URL','http://localhost:8080/km/admin')
    .constant('GT_HEADER', 'gt');