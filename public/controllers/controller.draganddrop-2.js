/**
 * Created by jbarros on 11/05/15.
 */

$(function() {
    $("#catalog").accordion();
});

angular.module('app').controller('DragDropCtrl2', function($scope) {
    $scope.remove = function (scope) {
        scope.remove();
    };

    $scope.toggle = function (scope) {
        scope.toggle();
    };

    $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
    };

    $scope.newSubItem = function (scope) {
        /*        var nodeData = scope.$modelValue;
         nodeData.elements.push({
         id: nodeData.id * 10 + nodeData.nodes.length,
         title: nodeData.title + '.' + (nodeData.nodes.length + 1),
         nodes: []
         }); */
    };

    $scope.collapseAll = function () {
        $scope.$broadcast('collapseAll');
    };

    $scope.expandAll = function () {
        $scope.$broadcast('expandAll');
    };

    $scope.openArchetypes = function () {
        alert("show Archetype tree modal");
    }

    $scope.data = [
        {
            "id": "gt0164",
            "archetypeId": "openEHR-EHR-EVALUATION.problem-diagnosis.v1",
            "templateId": "diagnosis_icd10",
            "domain": "EHR",
            "elements": [
                {
                    "id": "gt0112",
                    "path": "/data[at0001]/items[at0002.1]"
                },
                {
                    "id": "gt0129",
                    "path": "/data[at0001]/items[at0003]"
                }
            ],
            "predicates": [
                "/data[at0001]/items[at0002.1] is_a local::gt0104|Vascular disease|"
            ],
            "predicateStatements": [
                {
                    "type": "BinaryExpression",
                    "expressionItem": {
                        "left": {
                            "type": "Variable",
                            "expressionItem": {
                                "path": "/data[at0001]/items[at0002.1]"
                            }
                        },
                        "right": {
                            "type": "CodedTextConstant",
                            "expressionItem": {
                                "codedText": {
                                    "definingCode": {
                                        "terminologyId": {
                                            "name": "local",
                                            "value": "local"
                                        },
                                        "codeString": "gt0104"
                                    },
                                    "value": "Vascular disease"
                                },
                                "value": "local::gt0104|Vascular disease|"
                            }
                        },
                        "operator": "IS_A"
                    }
                }
            ]
        },
        {
            "id": "gt0160",
            "archetypeId": "openEHR-EHR-EVALUATION.problem-diagnosis.v1",
            "templateId": "diagnosis_icd10",
            "domain": "EHR",
            "elements": [
                {
                    "id": "gt0123",
                    "path": "/data[at0001]/items[at0003]"
                },
                {
                    "id": "gt0108",
                    "path": "/data[at0001]/items[at0002.1]"
                }
            ],
            "predicates": [
                "/data[at0001]/items[at0002.1] is_a local::gt0101|Hypertension|"
            ],
            "predicateStatements": [
                {
                    "type": "BinaryExpression",
                    "expressionItem": {
                        "left": {
                            "type": "Variable",
                            "expressionItem": {
                                "path": "/data[at0001]/items[at0002.1]"
                            }
                        },
                        "right": {
                            "type": "CodedTextConstant",
                            "expressionItem": {
                                "codedText": {
                                    "definingCode": {
                                        "terminologyId": {
                                            "name": "local",
                                            "value": "local"
                                        },
                                        "codeString": "gt0101"
                                    },
                                    "value": "Hypertension"
                                },
                                "value": "local::gt0101|Hypertension|"
                            }
                        },
                        "operator": "IS_A"
                    }
                }
            ]
        },
        {
            "id": "gt0161",
            "archetypeId": "openEHR-EHR-EVALUATION.problem-diagnosis.v1",
            "templateId": "diagnosis_icd10",
            "domain": "EHR",
            "elements": [
                {
                    "id": "gt0109",
                    "path": "/data[at0001]/items[at0002.1]"
                },
                {
                    "id": "gt0126",
                    "path": "/data[at0001]/items[at0003]"
                }
            ],
            "predicates": [
                "/data[at0001]/items[at0002.1] is_a local::gt0102|Diabetes|"
            ],
            "predicateStatements": [
                {
                    "type": "BinaryExpression",
                    "expressionItem": {
                        "left": {
                            "type": "Variable",
                            "expressionItem": {
                                "path": "/data[at0001]/items[at0002.1]"
                            }
                        },
                        "right": {
                            "type": "CodedTextConstant",
                            "expressionItem": {
                                "codedText": {
                                    "definingCode": {
                                        "terminologyId": {
                                            "name": "local",
                                            "value": "local"
                                        },
                                        "codeString": "gt0102"
                                    },
                                    "value": "Diabetes"
                                },
                                "value": "local::gt0102|Diabetes|"
                            }
                        },
                        "operator": "IS_A"
                    }
                }
            ]
        },
        {
            "id": "gt0162",
            "archetypeId": "openEHR-EHR-EVALUATION.problem-diagnosis.v1",
            "templateId": "diagnosis_icd10",
            "domain": "EHR",
            "elements": [
                {
                    "id": "gt0110",
                    "path": "/data[at0001]/items[at0002.1]"
                },
                {
                    "id": "gt0127",
                    "path": "/data[at0001]/items[at0003]"
                }
            ],
            "predicates": [
                "/data[at0001]/items[at0002.1] is_a local::gt0100|Congestive heart failure|"
            ],
            "predicateStatements": [
                {
                    "type": "BinaryExpression",
                    "expressionItem": {
                        "left": {
                            "type": "Variable",
                            "expressionItem": {
                                "path": "/data[at0001]/items[at0002.1]"
                            }
                        },
                        "right": {
                            "type": "CodedTextConstant",
                            "expressionItem": {
                                "codedText": {
                                    "definingCode": {
                                        "terminologyId": {
                                            "name": "local",
                                            "value": "local"
                                        },
                                        "codeString": "gt0100"
                                    },
                                    "value": "Congestive heart failure"
                                },
                                "value": "local::gt0100|Congestive heart failure|"
                            }
                        },
                        "operator": "IS_A"
                    }
                }
            ]
        },
        {
            "id": "gt0163",
            "archetypeId": "openEHR-EHR-EVALUATION.problem-diagnosis.v1",
            "templateId": "diagnosis_icd10",
            "domain": "EHR",
            "elements": [
                {
                    "id": "gt0111",
                    "path": "/data[at0001]/items[at0002.1]"
                },
                {
                    "id": "gt0128",
                    "path": "/data[at0001]/items[at0003]"
                }
            ],
            "predicates": [
                "/data[at0001]/items[at0002.1] is_a local::gt0103|Previous stroke or TIA|"
            ],
            "predicateStatements": [
                {
                    "type": "BinaryExpression",
                    "expressionItem": {
                        "left": {
                            "type": "Variable",
                            "expressionItem": {
                                "path": "/data[at0001]/items[at0002.1]"
                            }
                        },
                        "right": {
                            "type": "CodedTextConstant",
                            "expressionItem": {
                                "codedText": {
                                    "definingCode": {
                                        "terminologyId": {
                                            "name": "local",
                                            "value": "local"
                                        },
                                        "codeString": "gt0103"
                                    },
                                    "value": "Previous stroke or TIA"
                                },
                                "value": "local::gt0103|Previous stroke or TIA|"
                            }
                        },
                        "operator": "IS_A"
                    }
                }
            ]
        },
        {
            "id": "gt0157",
            "archetypeId": "openEHR-EHR-EVALUATION.chadsvas_diagnosis_review.v1",
            "domain": "EHR",
            "elements": [
                {
                    "id": "gt0142",
                    "path": "/data[at0001]/items[at0037]"
                },
                {
                    "id": "gt0143",
                    "path": "/data[at0001]/items[at0039]"
                },
                {
                    "id": "gt0140",
                    "path": "/data[at0001]/items[at0038]"
                },
                {
                    "id": "gt0141",
                    "path": "/data[at0001]/items[at0036]"
                },
                {
                    "id": "gt0139",
                    "path": "/data[at0001]/items[at0040]"
                },
                {
                    "id": "gt0137",
                    "path": "/data[at0001]/items[at0035]"
                },
                {
                    "id": "gt0138",
                    "path": "/data[at0001]/items[at0041]"
                }
            ],
            "predicates": [
                "max(/data[at0001]/items[at0041])"
            ],
            "predicateStatements": [
                {
                    "type": "UnaryExpression",
                    "expressionItem": {
                        "operand": {
                            "type": "Variable",
                            "expressionItem": {
                                "path": "/data[at0001]/items[at0041]"
                            }
                        },
                        "operator": "MAX"
                    }
                }
            ]
        },
        {
            "id": "gt0158",
            "archetypeId": "openEHR-EHR-EVALUATION.chadsvas_diagnosis_review.v1",
            "domain": "CDS",
            "elements": [
                {
                    "id": "gt0117",
                    "path": "/data[at0001]/items[at0038]"
                },
                {
                    "id": "gt0118",
                    "path": "/data[at0001]/items[at0039]"
                },
                {
                    "id": "gt0119",
                    "path": "/data[at0001]/items[at0040]"
                },
                {
                    "id": "gt0124",
                    "path": "/data[at0001]/items[at0041]"
                },
                {
                    "id": "gt0114",
                    "path": "/data[at0001]/items[at0035]"
                },
                {
                    "id": "gt0115",
                    "path": "/data[at0001]/items[at0036]"
                },
                {
                    "id": "gt0116",
                    "path": "/data[at0001]/items[at0037]"
                }
            ],
            "predicates": []
        },
        {
            "id": "gt0159",
            "archetypeId": "openEHR-EHR-EVALUATION.problem-diagnosis.v1",
            "templateId": "diagnosis_icd10",
            "domain": "EHR",
            "elements": [
                {
                    "id": "gt0122",
                    "path": "/data[at0001]/items[at0002.1]"
                },
                {
                    "id": "gt0125",
                    "path": "/data[at0001]/items[at0003]"
                }
            ],
            "predicates": [
                "/data[at0001]/items[at0002.1] is_a local::gt0149|Atrial fibrillation diagnosis|"
            ],
            "predicateStatements": [
                {
                    "type": "BinaryExpression",
                    "expressionItem": {
                        "left": {
                            "type": "Variable",
                            "expressionItem": {
                                "path": "/data[at0001]/items[at0002.1]"
                            }
                        },
                        "right": {
                            "type": "CodedTextConstant",
                            "expressionItem": {
                                "codedText": {
                                    "definingCode": {
                                        "terminologyId": {
                                            "name": "local",
                                            "value": "local"
                                        },
                                        "codeString": "gt0149"
                                    },
                                    "value": "Atrial fibrillation diagnosis"
                                },
                                "value": "local::gt0149|Atrial fibrillation diagnosis|"
                            }
                        },
                        "operator": "IS_A"
                    }
                }
            ]
        }
    ]

});