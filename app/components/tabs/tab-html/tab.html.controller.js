/**
 * Created by jbarros on 16/03/17.
 */

angular.module('app.controllers')
  .controller('HtmlCtrl', HtmlCtrl);

function HtmlCtrl(htmlFactory) {

  vm = this;
  vm.html = {};
  vm.errorMsg = false;

  getHtml();

  function getHtml() {
    htmlFactory.getHtml().then(
      function (data) {
        data = data.substr(data.indexOf('<h1>'));
        data = data.split('</body>')[0];
        vm.html = data;
      },
      function (error) {
        vm.errorMsg = error.error;
      }
    )
  }
}
