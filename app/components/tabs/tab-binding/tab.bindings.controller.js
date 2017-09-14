/**
 * Created by jbarros on 13/08/15.
 */

angular.module('app.controllers', [])
    .controller('BindingsCtrl', BindingsCtrl);

function BindingsCtrl($log, guidelineFactory, terminologyFactory, utilsFactory, modalService) {

    var vm = this;
    vm.termBindings = guidelineFactory.getTermBindings();
    vm.termBinding = vm.termBindings ? vm.termBindings[Object.keys(vm.termBindings)[0]] : {};
    vm.terminology = vm.termBinding.id;
    vm.terminologies = [];
    vm.changeTab = changeTab;
    vm.getName = getName;
    vm.getCodes = getCodes;
    vm.showTerminologyCodes = showTerminologyCodes;
    vm.newBinding = newBinding;
    vm.addBinding = addBinding;
    vm.removeBinding = removeBinding;
    vm.newTerminology = newTerminology;
    vm.removeBindingTerminology = removeBindingTerminology;
    //vm.termBindings = {};
    vm.errorMsg = false;

    vm.magnifier = "../assets/img/magnifier.png";
    vm.pencil = "../assets/img/pencil.png";
    vm.delete = "../assets/img/del.png";

    vm.isEmpty = isEmpty;

    getTerminologies();

    function getTerminologies() {
        return terminologyFactory.getAll().then(
            function (data) {
                vm.terminologies = data;
                return vm.terminologies;
            },
            function (error) {
                vm.errorMsg = error.error;
            }
        );
    }

    function changeTab(tab) {
        vm.termBinding = tab;
        vm.terminology = tab.id;
    }

    function getName(gtCode) {
        return guidelineFactory.getText(gtCode);
    }

    function getCodes(gtCode) {
        var codes = "";
        angular.forEach(vm.termBinding.bindings[gtCode].codes, function(code) {
            codes = codes.concat(code.codeString + ", ");
        });
        return codes.substring(0, codes.length - 2);
    }

    function isEmpty (obj) {
        return angular.isUndefined(obj) || Object.keys(obj).length === 0;
    }

    function showTerminologyCodes(node) {

        // The terms bindings present in the guideline
        var terms = node.binding.codes;

        var codes = [];
        angular.forEach(terms, function(term) {
            codes.push(term.codeString);
        });

        // Used by the tree to show the current bindings of the guideline
        var selectedItems = [];

        terminologyFactory.getTerminology(vm.terminology).then(getTerminologySuccess, getTerminologyFailed);

        function getTerminologySuccess(response) {
            var termsArray = CSVToArray(response);

            var modalData = {headerText: vm.terminology};

            var items = getNodes();

            var modalOptions = {
                component: 'modalWithTreeComponent',
                size: 'lg',
                resolve: {
                    items: function() {
                        return items;
                    },
                    selectedItems: function() {
                        return selectedItems;
                    },
                    /*labels: function() {
                        return dataForModal;
                    },*/
                    multiSelection: function() {
                        return true;
                    },
                    dirSelectable: function() {
                        return true;
                    }
                }
            };

            modalService.showModal(modalOptions, modalData).then(showModalSuccess, showModalFailed);

            function showModalSuccess(response) {
                var selectedItems = response.data.selectedItems;
                node.binding.codes = [];
                angular.forEach(selectedItems, function(selectedItem) {
                    var termBinding = {
                        terminologyId: {
                            name: vm.terminology,
                            value: vm.terminology
                        },
                        codeString: selectedItem.id
                    };
                    node.binding.codes.push(termBinding);
                });
            }

            function showModalFailed(error) {
                console.log(error);
            }

            function getICD10Nodes() {
                var nodes = [];
                var parent = "";
                angular.forEach(termsArray, function(term) {
                    term = {id: term[0], viewText: term[1], parent: term[2]};
                    // Let's add the current node as selected as default if it belongs to the guideline bindings
                    if(codes.indexOf(term.id) > -1) {
                        selectedItems.push(term);
                    }
                    if(term.id.startsWith(parent.id)) {
                        if(!parent.children) {
                            parent.children = [];
                        }
                        parent.children.push(term);
                        return;
                    }
                    parent = term;
                    nodes.push(parent);
                });
                nodes.shift();
                return nodes;
            }

            function getNodes() {
                // The conversion of ICD10 is different from the remaining terminologies
                if (vm.terminology === "ICD10") {
                    return getICD10Nodes();
                }
                var idToNodeMap = {};   //Keeps track of nodes using id as key, for fast lookup
                var root = null;        //Initially set our loop to null loop over data
                termsArray.forEach(function(term) {

                    if(term[0] === "id" && term[1] === "text" && term[2] === "parent") {
                        return;
                    }

                    //convert the array into an object
                    term = {id: term[0], viewText: term[1], parent: term[2]};

                    //each node will have children, so let's give it a "children" property
                    term.children = [];

                    //add an entry for this node to the map so that any future children can lookup the parent
                    idToNodeMap[term.id] = term;

                    //Does this node have a parent?
                    if(term.parent === "") {
                        //Doesn't look like it, so this node is the root of the tree
                        root = term;
                    } else {
                        //This node has a parent, so let's look it up using the id
                        parentNode = idToNodeMap[term.parent];

                        //We don't need this property, so let's delete it.
                        delete term.parent;

                        // Let's add the current node as selected as default if it belongs to the guideline bindings
                        if(codes.indexOf(term.id) > -1) {
                            selectedItems.push(term);
                        }

                        //Let's add the current node as a child of the parent node.
                        if(parentNode) {
                            parentNode.children.push(term);
                        }
                    }
                });
                return idToNodeMap[Object.keys(idToNodeMap)[0]];
            }
        }

        function getTerminologyFailed(error) {
            console.log(error);
        }


    }

    /**
     *
     * This funciton is used to parse a CSV
     * Source: https://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data#answer-1293163
     *
     * @param strData
     * @param strDelimiter
     * @returns {*[]}
     * @constructor
     */
    function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
            ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }

    function newBinding() {
        var modalOptions = {};
        modalOptions.resolve = {};
        modalOptions.component = "modalWithTreeComponent";
        modalOptions.resolve.items = function() {
            var terms = guidelineFactory.getOntology().termDefinitions.en.terms;
            var modalItems = [];
            angular.forEach(terms, function (term) {
                term.viewText = term.id + " - " + term.text;
                //term.type = leftElementType;
                modalItems.push(term);
            });
            modalItems = modalItems.sort(compare);
            return modalItems;
        }
        modalService.showModal(modalOptions, {headerText: "Select local term"}).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            var response = modalResponse.data.selectedItem;
            var termBinding = {
                id: response.id,
                codes: [],
                uri: ''
            };
            guidelineFactory.getCurrentGuide().ontology.termBindings[vm.terminology].bindings[termBinding.id] = termBinding;
            console.log(modalResponse);
        }

        function showModalFailed(modalResponse) {
            console.log(modalResponse);
        }
    }



    /**
     * Create a new terminology in which you can add termBindings.
     *
     */
    function newTerminology() {

        var items = [];
        angular.forEach(vm.terminologies, function(terminology) {
           items.push({viewText: terminology});
        });

        var modalOptions = {
            component: 'modalWithTreeComponent',
            size: 'md',
            resolve: {
                items: function() {
                    return items;
                },
                labels: function() {
                    return modalData;
                }
            }
        };

        var modalData = {
            headerText: "Add new terminology",
            bodyText: "New terminology"
        };

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }

            var terminologyId = modalResponse.data.selectedItem.viewText;
            // If the terminology is already set, do nothing
            if(vm.terminologies.indexOf(terminologyId) == -1) {
                return;
            }

            var newTermBinding = {
                id: terminologyId,
                bindings: {}
            };

            // set the termBinding into the guideline
            guidelineFactory.setTermBinding(newTermBinding);

            // Refresh the view
            vm.termBindings = guidelineFactory.getTermBindings();

        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in newTerminology()');
        }

    }

    /**
     * Used to sort by name the gt codes displayed in the popup when an IS_A choice is selected
     * @param a
     * @param b
     * @returns {number}
     */
    function compare(a,b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }

    function addBinding(node) {

        var binding = node.binding;

        var modalData = {
            headerText: "Select local term",
            bodyText: "Name"
        };

        var modalOptions = {
            component: "modalWithTreeComponent",
            resolve: {
                items: function() {
                    var terms = guidelineFactory.getOntology().termDefinitions.en.terms;
                    var modalItems = [];
                    angular.forEach(terms, function (term) {
                        term.viewText = term.id + " - " + term.text;
                        modalItems.push(term);
                    });
                    modalItems = modalItems.sort(compare);
                    return modalItems;
                }
            }
        };

        modalService.showModal(modalOptions, modalData).then(showModalComplete, showModalFailed);

        function showModalComplete(modalResponse) {
            if (modalResponse.data === undefined) {
                return;
            }
            // Remove the old binding
            delete vm.termBinding.bindings[binding.id];
            // Add the new one
            vm.termBinding.bindings[modalResponse.data.selectedItem.id] = {
                id: modalResponse.data.selectedItem.id,
                codes: [],
                uri: ""
            }
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in updateRightItem');
        }
    }

    function removeBinding (node) {
        var bindingId = node.binding.id;
        modalService.showModal(
            {component: 'dialogComponent'},
            {bodyText: 'Are you sure you want remove the binding "' + bindingId +'"'}
        ).then(showModalComplete, showModalFailed);

        function showModalComplete() {
            var terminologyId = node.vm.termBinding.id;
            delete vm.termBindings[terminologyId].bindings[bindingId];
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in removeBinding()');
        }
    }

    function removeBindingTerminology(terminology) {
        var terminologyId = terminology.vm.termBinding.id;
        modalService.showModal(
            {component: 'dialogComponent'},
            {bodyText: 'Are you sure you want remove the terminology binding "' + terminologyId +'"'}
        ).then(showModalComplete, showModalFailed);

        function showModalComplete() {
            var terminologyId = terminology.vm.termBinding.id;
            guidelineFactory.removeBindingTerminology(terminologyId);
            vm.termBinding = vm.termBindings ? vm.termBindings[Object.keys(vm.termBindings)[0]] : {};
        }

        function showModalFailed() {
            $log.info('Modal dismissed at: ' + new Date() + ' in removeBindingTerminology()');
        }

    }


}
