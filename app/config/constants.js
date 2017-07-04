/**
 * Created by jbarros on 6/08/15.
 */

angular.module('app.constants', [])
    //FIXME: This URL should be enviroment dependent and specified at building time
    .constant('API_URL', 'http://localhost:8080/km/admin')
    .constant('API_MISC_URL', 'http://localhost:8080/km/misc')
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
        DV_QUANTITY: ['magnitude', 'precision', 'units'],
        DV_TEXT: ['value'],
        DV_CODED_TEXT: ['value', 'terminologyId', 'code'],
        DV_DATE_TIME: ['year', 'month', 'day', 'hour', 'minute', 'second', 'fractionalSecond', 'timeZone', 'value'],
        DV_ORDINAL: ['magnitude', 'precision', 'units']
    })
    .constant('OPERATORS', {
        'MULTIPLICATION': "*",
        "ADDITION": "+",
        "SUBSTRATION": "-",
        "DIVISION": "/",
        "EXPONENT": "^"
    })
    .constant('NULLVALUE', {
        NO_INFORMATION: {viewText: 'No information', value: 271},
        UNKNOWN: {viewText: 'Unknown', value: 253},
        MASKED: {viewText: 'Masked', value: 272},
        NOT_APPLICABLE: {viewText: 'Not applicable', value: 273}
    })
    .constant('CONDITION_OPERATORS', {
        EXISTS: [
            {label: 'exists', value: 'INEQUAL'},
            {label: 'does not exist', value: 'EQUALITY'}
        ],
        ATTRIBUTE: [
            {label: '==', value: 'EQUALITY'},
            {label: '!=', value: 'INEQUAL'},
            {label: '<', value: 'LESS_THAN'},
            {label: '<=', value: 'LESS_THAN_OR_EQUAL'},
            {label: '>', value: 'GREATER_THAN'},
            {label: '>=', value: 'GREATER_THAN_OR_EQUAL'}
        ],
        ELEMENT: [
            {label: '==', value: 'EQUALITY'},
            {label: '!=', value: 'INEQUAL'},
            {label: '<', value: 'LESS_THAN'},
            {label: '<=', value: 'LESS_THAN_OR_EQUAL'},
            {label: '>', value: 'GREATER_THAN'},
            {label: '>=', value: 'GREATER_THAN_OR_EQUAL'},
            {label: 'IS_A', value: 'IS_A'},
            {label: '!IS_A', value: 'IS_NOT_A'}
        ],
        NULLVALUE: [
            {label: '==', value: 'EQUALITY'},
            {label: '!=', value: 'INEQUAL'}
        ],
        DATAVALUE: [
            {label: '==', value: 'EQUALITY'},
            {label: '!=', value: 'INEQUAL'},
            {label: '<', value: 'LESS_THAN'},
            {label: '<=', value: 'LESS_THAN_OR_EQUAL'},
            {label: '>', value: 'GREATER_THAN'},
            {label: '>=', value: 'GREATER_THAN_OR_EQUAL'},
            {label: 'IS_A', value: 'IS_A'},
            {label: '!IS_A', value: 'IS_NOT_A'}
        ],
        OR: [
            {label: 'OR', value: 'OR'}
        ]    })


;