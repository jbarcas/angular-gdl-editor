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

  it('should jump to the /home path when / is accessed', function() {
    browser.get('#/');
    expect(browser.getLocationAbsUrl()).toBe("/tab-guidelines");
  });

  describe('tab guidelines', function() {

    beforeEach(function() {
      browser.get('index.html#/tabs/tab-guidelines');
    });


    it('should render tab guidelines view when user navigates to /tab-guidelines', function() {
      element.all(by.repeater('vm.guides.length')).count().then(
        function(count) {
          console.log("count: " + count);
        }
      );

    });

  });

});
