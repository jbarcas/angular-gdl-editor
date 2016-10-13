'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('GDL Editor application', function() {

  it('should have a title', function() {
    browser.get('index.html');
    expect(browser.getTitle()).toEqual('GDL Editor');
  });

  it('should automatically redirect to /tabs/tab-guidelines when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/tab-guidelines");
  });

  it('should automatically redirect to /tabs/tab-guidelines when location hash/fragment is empty', function() {
    browser.get('');
    expect(browser.getLocationAbsUrl()).toMatch("/tab-guidelines");
  });

  describe('tab guidelines', function() {

    beforeEach(function() {
      browser.get('index.html#/tabs/tab-guidelines');
    });


    it('should render tab guidelines view when user navigates to /tab-guidelines', function() {
      /*element.all(by.repeater('guide in vm.guides'))
        .then(function(guides) {
          expect(guides.length).toBe(3);
        });*/

      /*browser.debugger();
      var foo = element(by.binding('vm.guides.length'));
      expect(foo.getId()).not.toBe(undefined);
      expect(foo.getText()).toMatch(24); */

      element.all(by.repeater('vm.guides.length')).count().then(
        function(count) {
          console.log("count: " + count);
        }
      );

    });

  });

});
