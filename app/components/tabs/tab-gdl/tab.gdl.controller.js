/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.controllers')
    .controller('GdlCtrl', GdlCtrl);

function GdlCtrl(gdlFactory, guidelineFactory) {

    vm = this;
    vm.guide = {};
    vm.guide.id = guidelineFactory.getId();

    vm.gdl;

    vm.editorOptions = {
        lineNumbers: true
    };

    activate();

    function activate() {
        if(angular.isUndefined(vm.guide.id)) {
            return;
        }
        return getGdl(vm.guide.id).then(function() {
            console.log("GDL retrieved");
        })
    };

    function getGdl(guideline) {
        return gdlFactory.getGdl(guideline).then(function(response) {
            vm.gdl = response;
            //return vm.gdl;
        })
    };

};
