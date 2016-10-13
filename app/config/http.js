/**
 * Created by jbarros on 10/04/16.
 */

angular.module('app')
    .config(function ($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'text/plain';
    });
