/**
 * Created by jbarros on 6/08/15.
 */

angular.module('app.constants', [])
    //FIXME: This URL should be enviroment dependent and specified at building time
    .constant('API_URL','http://localhost:8080/km/admin')
    .constant('API_MISC_URL','http://localhost:8080/km/misc')
    .constant('GT_HEADER', 'gt')
    .constant('DV', {
        QUANTITY: 'DV_QUANTITY',
        TEXT: 'DV_TEXT',
        CODEDTEXT: 'DV_CODED_TEXT',
        DATETIME: 'DV_DATE_TIME',
        ORDINAL: 'DV_ORDINAL',
        COUNT: 'DV_COUNT'
    })
    .constant('ATTRIBUTES', {
        DV_QUANTITY: [{viewText: 'magnitude'}, {viewText: 'precision'}, {viewText: 'units'}],
        DV_TEXT: [{viewText: 'value'}],
        DV_CODED_TEXT: [{viewText: 'value'}, {viewText: 'terminologyId'}, {viewText: 'code'}],
        DV_DATE_TIME: [{viewText: 'year'}, {viewText: 'month'}, {viewText: 'day'}, {viewText: 'minute'}, {viewText: 'second'},
            {viewText: 'fractionalSecond'}, {viewText: 'timeZone'}, {viewText: 'value'}],
        DV_ORDINAL: [{viewText: 'magnitude'}, {viewText: 'precision'}, {viewText: 'units'}]
    });